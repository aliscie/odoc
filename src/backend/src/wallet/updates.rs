use alloy_consensus::{SignableTransaction, TxEip1559, TxEnvelope};
use alloy_primitives::{hex, Signature, TxKind, U256};
use candid::Nat;
use candid::Principal;
use evm_rpc_canister_types::{
    BlockTag, EthMainnetService, EthSepoliaService, EvmRpcCanister, GetTransactionCountArgs,
    GetTransactionCountResult, MultiGetTransactionCountResult, RequestResult, RpcService,
};
use ic_cdk::caller;
use ic_cdk_macros::update;
use ic_ethereum_types::Address;
use num::{BigUint, Num};
use serde_json::{self, Value};

use crate::{assert_token_symbol_length, parse_eth_address, UserToken};
use crate::{CPayment, ExchangeType, PaymentStatus, Wallet};
use crate::workspaces::{estimate_transaction_fees, EthereumNetwork, EVM_RPC, nat_to_u256, nat_to_u64, validate_caller_not_anonymous};

// use crate::workspaces::{EthereumWallet, validate_caller_not_anonymous};

#[update]
fn deposit_usdt(amount: f64) -> Result<f64, String> {
    let mut wallet = Wallet::get(caller());
    let wallet = wallet.deposit(amount.clone(), "ExternalWallet".to_string(), ExchangeType::Deposit)?;
    Ok(wallet.balance)
}
