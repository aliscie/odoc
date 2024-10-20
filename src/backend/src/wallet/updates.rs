use candid::Principal;
use ic_cdk::caller;
use ic_cdk::update;
use serde_json::{self, Value};
use candid::{Nat};
use crate::{EthereumWallet, read_state};
use crate::workspaces::{estimate_transaction_fees, EthereumNetwork, EVM_RPC, nat_to_u256, nat_to_u64, validate_caller_not_anonymous};
use evm_rpc_canister_types::{
    BlockTag, EthMainnetService, EthSepoliaService, EvmRpcCanister, GetTransactionCountArgs,
    GetTransactionCountResult, MultiGetTransactionCountResult, RequestResult, RpcService,
};
use ic_ethereum_types::Address;
use alloy_primitives::{hex, Signature, TxKind, U256};
use alloy_consensus::{SignableTransaction, TxEip1559, TxEnvelope};
use num::{BigUint, Num};
// use crate::workspaces::{EthereumWallet, validate_caller_not_anonymous};

use crate::{CPayment, ExchangeType, PaymentStatus, Wallet};

#[update]
fn deposit_usdt(amount: f64) -> Result<f64, String> {
    let mut wallet = Wallet::get(caller());
    let wallet = wallet.deposit(amount.clone(), "ExternalWallet".to_string(), ExchangeType::Deposit)?;
    Ok(wallet.balance)
}


#[update]
fn internal_transaction(amount: f64, receiver: String) -> Result<CPayment, String> {
    let now: f64 = ic_cdk::api::time() as f64;
    let payment = CPayment {
        contract_id: "none".to_string(),
        id: now.clone().to_string(),
        amount,
        sender: caller(),
        receiver: Principal::from_text(receiver).unwrap(),
        date_created: now.clone(),
        date_released: now,
        status: PaymentStatus::Released,
        cells: vec![],
    };
    payment.pay()
}


#[update]
fn withdraw_usdt(amount: f64) -> Result<f64, String> {
    let mut wallet = Wallet::get(caller());
    let remaining = wallet.balance - amount;
    let wallet = wallet.calc_dept();
    if wallet.total_debt.clone() > remaining {
        let dept = wallet.total_debt.clone() - remaining;
        return Err(format!("Your total dept is {}, You can cancel some of the contract to withdraw which may effect your trust score.", dept).to_string());
    }

    wallet.withdraw(amount.clone(), "ExternalWallet".to_string(), ExchangeType::Withdraw)?;
    Ok(remaining)
}


#[update]
pub async fn ethereum_address(owner: Option<Principal>) -> String {
    let caller = validate_caller_not_anonymous();
    let owner = owner.unwrap_or(caller);
    let wallet = EthereumWallet::new(owner).await;
    wallet.ethereum_address().to_string()
}

#[update]
pub async fn get_balance(address: Option<String>) -> Nat {
    let address = address.unwrap_or(ethereum_address(None).await);

    let json = format!(
        r#"{{ "jsonrpc": "2.0", "method": "eth_getBalance", "params": ["{}", "latest"], "id": 1 }}"#,
        address
    );

    let max_response_size_bytes = 500_u64;
    let num_cycles = 1_000_000_000u128;

    let ethereum_network = read_state(|s| s.ethereum_network());

    let rpc_service = match ethereum_network {
        EthereumNetwork::Mainnet => RpcService::EthMainnet(EthMainnetService::PublicNode),
        EthereumNetwork::Sepolia => RpcService::EthSepolia(EthSepoliaService::PublicNode),
    };

    let (response, ) = EVM_RPC
        .request(rpc_service, json, max_response_size_bytes, num_cycles)
        .await
        .expect("RPC call failed");

    let hex_balance = match response {
        RequestResult::Ok(balance_result) => {
            // The response to a successful `eth_getBalance` call has the following format:
            // { "id": "[ID]", "jsonrpc": "2.0", "result": "[BALANCE IN HEX]" }
            let response: serde_json::Value = serde_json::from_str(&balance_result).unwrap();
            response
                .get("result")
                .and_then(|v| v.as_str())
                .unwrap()
                .to_string()
        }
        RequestResult::Err(e) => panic!("Received an error response: {:?}", e),
    };

    // Remove the "0x" prefix before converting to a decimal number.
    Nat(BigUint::from_str_radix(&hex_balance[2..], 16).unwrap())
}

#[update]
pub async fn transaction_count(owner: Option<Principal>, block: Option<BlockTag>) -> Nat {
    let caller = validate_caller_not_anonymous();
    let owner = owner.unwrap_or(caller);
    let wallet = EthereumWallet::new(owner).await;
    let rpc_services = read_state(|s| s.evm_rpc_services());
    let args = GetTransactionCountArgs {
        address: wallet.ethereum_address().to_string(),
        block: block.unwrap_or(BlockTag::Finalized),
    };
    let (result, ) = EVM_RPC
        .eth_get_transaction_count(rpc_services, None, args.clone(), 2_000_000_000_u128)
        .await
        .unwrap_or_else(|e| {
            panic!(
                "failed to get transaction count for {:?}, error: {:?}",
                args, e
            )
        });
    match result {
        MultiGetTransactionCountResult::Consistent(consistent_result) => match consistent_result {
            GetTransactionCountResult::Ok(count) => count,
            GetTransactionCountResult::Err(error) => {
                ic_cdk::trap(&format!("failed to get transaction count for {:?}, error: {:?}", args, error))
            }
        },
        MultiGetTransactionCountResult::Inconsistent(inconsistent_results) => {
            ic_cdk::trap(&format!("inconsistent results when retrieving transaction count for {:?}. Received results: {:?}", args, inconsistent_results))
        }
    }
}

#[update]
pub async fn send_eth(to: String, amount: Nat) -> String {
    use alloy_eips::eip2718::Encodable2718;

    let caller = validate_caller_not_anonymous();
    // let _to_address = Address::from_str(&to).unwrap_or_else(|e| {
    let _to_address = to.parse::<Address>().unwrap_or_else(|e| {
        ic_cdk::trap(&format!("failed to parse the recipient address: {:?}", e))
    });
    let chain_id = read_state(|s| s.ethereum_network().chain_id());
    let nonce = nat_to_u64(transaction_count(Some(caller), Some(BlockTag::Latest)).await);
    let (gas_limit, max_fee_per_gas, max_priority_fee_per_gas) = estimate_transaction_fees();

    let transaction = TxEip1559 {
        chain_id,
        nonce,
        gas_limit:gas_limit as u64,
        max_fee_per_gas,
        max_priority_fee_per_gas,
        to: TxKind::Call(to.parse().expect("failed to parse recipient address")),
        value: nat_to_u256(amount),
        access_list: Default::default(),
        input: Default::default(),
    };

    let wallet = EthereumWallet::new(caller).await;
    let tx_hash = transaction.signature_hash().0;
    let (raw_signature, recovery_id) = wallet.sign_with_ecdsa(tx_hash).await;
    let signature = Signature::from_bytes_and_parity(&raw_signature, recovery_id.is_y_odd())
        .expect("BUG: failed to create a signature");
    let signed_tx = transaction.into_signed(signature);

    let raw_transaction_hash = *signed_tx.hash();
    let mut tx_bytes: Vec<u8> = vec![];
    TxEnvelope::from(signed_tx).encode_2718(&mut tx_bytes);
    let raw_transaction_hex = format!("0x{}", hex::encode(&tx_bytes));
    ic_cdk::println!(
        "Sending raw transaction hex {} with transaction hash {}",
        raw_transaction_hex,
        raw_transaction_hash
    );
    // The canister is sending a signed statement, meaning a malicious provider could only affect availability.
    // For demonstration purposes, the canister uses a single provider to send the signed transaction,
    // but in production multiple providers (e.g., using a round-robin strategy) should be used to avoid a single point of failure.
    let single_rpc_service = read_state(|s| s.single_evm_rpc_service());
    let (result, ) = EVM_RPC
        .eth_send_raw_transaction(
            single_rpc_service,
            None,
            raw_transaction_hex.clone(),
            2_000_000_000_u128,
        )
        .await
        .unwrap_or_else(|e| {
            panic!(
                "failed to send raw transaction {}, error: {:?}",
                raw_transaction_hex, e
            )
        });
    ic_cdk::println!(
        "Result of sending raw transaction {}: {:?}. \
    Due to the replicated nature of HTTPs outcalls, an error such as transaction already known or nonce too low could be reported, \
    even though the transaction was successfully sent. \
    Check whether the transaction appears on Etherscan or check that the transaction count on \
    that address at latest block height did increase.",
        raw_transaction_hex,
        result
    );

    raw_transaction_hash.to_string()
}
