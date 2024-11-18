use crate::wallet::error::{Error, USDCResult};
use crate::websocket::{NoteContent, Notification};
use crate::workspaces::{
    estimate_transaction_fees, nat_to_u256, nat_to_u64, validate_caller_not_anonymous,
    EthereumNetwork, EVM_RPC,
};
use crate::{assert_token_symbol_length, parse_eth_address, wallet, UserToken};
use crate::{CPayment, ExchangeType, PaymentStatus, Wallet};
use alloy_consensus::{SignableTransaction, TxEip1559, TxEnvelope};
use alloy_primitives::{address, hex, Signature, TxKind, U256};
use candid::CandidType;
use candid::{func, Nat, Principal};
use ethers_core::types::Res;
use evm_rpc_canister_types::{
    BlockTag, EthMainnetService, EthSepoliaService, EvmRpcCanister, GetTransactionCountArgs,
    GetTransactionCountResult, MultiGetTransactionCountResult, RequestResult, RpcService,
};
use ic_cdk::caller;
use ic_cdk_macros::update;
use icrc_ledger_types::icrc1::account::Account;
use icrc_ledger_types::icrc1::transfer::BlockIndex;
use icrc_ledger_types::icrc2::transfer_from::TransferFromArgs;
use num::Num;
use serde_json::{self};
use std::time;

async fn get_user_balance() -> USDCResult<Nat> {
    let args = Account {
        owner: caller(),
        subaccount: None,
    };
    ic_cdk::call::<(Account,), (USDCResult<Nat>,)>(
        Principal::from_text("xevnm-gaaaa-aaaar-qafnq-cai").unwrap(),
        "icrc1_balance_of",
        (args,),
    )
    .await
    .map_err(|(_, message)| Error::IcCdkError { message })?
    .0
    .map_err(|e| Error::IcCdkError {
        message: format!("{:?}", e),
    })
}

async fn transfer_from(amount: Nat, from: Principal, to: Principal) -> USDCResult<BlockIndex> {
    let args = TransferFromArgs {
        spender_subaccount: None,
        from: Account {
            owner: from,
            subaccount: None,
        },
        to: Account {
            owner: to,
            subaccount: None,
        },
        amount,
        fee: None,
        memo: None,
        created_at_time: None,
    };
    ic_cdk::call::<(TransferFromArgs,), (USDCResult<BlockIndex>,)>(
        Principal::from_text("xevnm-gaaaa-aaaar-qafnq-cai").unwrap(),
        "icrc2_transfer_from",
        (args,),
    )
    .await
    .map_err(|(_, message)| Error::IcCdkError { message })?
    .0
    .map_err(|e| Error::IcCdkError {
        message: format!("{:?}", e),
    })
}

#[update]
async fn deposit_ckusdt() -> Result<Nat, Error> {
    let balance = get_user_balance().await?;
    if balance > Nat::from(0 as u64) {
        transfer_from(balance.clone(), caller(), ic_cdk::id()).await?;
        let mut wallet = Wallet::get(caller());
        wallet
            .deposit(
                nat_to_u64(balance.clone()) as f64,
                "ExternalWallet".to_string(),
                ExchangeType::Deposit,
            )
            .map_err(|e| Error::IcCdkError {
                message: format!("{:?}", e),
            })?;
        let message = format!("You received {} CKUSD", balance);
        Notification::new(
            format!("{:?}", time::SystemTime::now()),
            caller(),
            NoteContent::ReceivedDeposit(message),
        )
        .save();
    }
    Ok(balance)
}

#[update]
async fn withdraw_ckusdt(amount: u64, address: String) -> Result<Nat, Error> {
    let balance = get_user_balance().await?;
    if Nat::from(amount.clone()) >= balance {
        transfer_from(
            Nat::from(amount.clone() as u64),
            ic_cdk::id(),
            Principal::from_text(address.clone()).unwrap(),
        )
        .await?;
        let mut wallet = Wallet::get(caller());
        wallet
            .withdraw(amount as f64, address, ExchangeType::Withdraw)
            .map_err(|e| Error::IcCdkError { message: e })?;
    }
    Ok(balance)
}
