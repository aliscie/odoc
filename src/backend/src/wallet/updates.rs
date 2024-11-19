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
use icrc_ledger_types::icrc2::transfer_from::{TransferFromArgs, TransferFromError};
use num::Num;
use serde_json::{self};
use std::time;
use crate::ckusdc_index_types::*;

async fn get_user_balance() -> Result<Nat, String> {
    let args = Account {
        owner: caller(),
        subaccount: None,
    };
    let res = ic_cdk::call::<(Account, ), (Nat, )>(
        Principal::from_text("xevnm-gaaaa-aaaar-qafnq-cai").unwrap(),
        "icrc1_balance_of",
        (args, ),
    )
        .await
        .map_err(|(_, message)| Error::IcCdkError { message });
    return if let Ok(x) = res {
        Ok(x.0)
    } else {
        let b = format!("{:?}", res);
        Err(b)
    };
}


async fn get_fee() -> Nat {
    let res = ic_cdk::call::<(), (Nat, )>(
        Principal::from_text("xevnm-gaaaa-aaaar-qafnq-cai").unwrap(),
        "icrc1_fee",
        (),
    )
        .await
        .map_err(|(_, message)| Error::IcCdkError { message });
    res.unwrap().0
}


#[update]
async fn check_external_transactions(max_results: Nat) -> Result<GetTransactions, Error> {
    let args = GetAccountTransactionsArgs {
        max_results,
        start: None,
        account: Index_Account {
            owner: caller(),
            subaccount: None,
        },
    };

    let res = ic_cdk::call::<(GetAccountTransactionsArgs, ), (Result<GetTransactions, GetTransactionsErr>, )>(
        Principal::from_text("xrs4b-hiaaa-aaaar-qafoa-cai").unwrap(),
        "get_account_transactions",
        (args, ),
    )
        .await
        .map_err(|(_, message)| Error::IcCdkError { message })?
        .0
        .map_err(|e| Error::IcCdkError {
            message: format!("{:?}", e.message),
        })?;

    let mut wallet = Wallet::get(caller());
    for transaction in &res.transactions {
        if let Some(t) = &transaction.transaction.transfer {
            if t.to.owner == ic_cdk::id() {
                wallet
                    .deposit(
                        nat_to_u64(t.amount.clone()) as f64,
                        "ExternalWallet".to_string(),
                        ExchangeType::Deposit,
                    )
                    .map_err(|e| Error::IcCdkError {
                        message: format!("{:?}", e),
                    })?;
            }
        }

        if let Some(t) = &transaction.transaction.transfer {
            if t.from.owner == ic_cdk::id() {
                wallet.withdraw(
                    nat_to_u64(t.amount.clone()) as f64,
                    "ExternalWallet".to_string(),
                    ExchangeType::Withdraw,
                )
                    .map_err(|e| Error::IcCdkError {
                        message: format!("{:?}", e),
                    })?;
            }
        }
    }

    Ok(res)
}

async fn transfer_from(amount: Nat, from: Principal, to: Principal) -> Result<BlockIndex, Error> {
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
    let res = ic_cdk::call::<(TransferFromArgs, ), (Result<BlockIndex, TransferFromError>, )>(
        Principal::from_text("xevnm-gaaaa-aaaar-qafnq-cai").unwrap(),
        "icrc2_transfer_from",
        (args, ),
    )
        .await
        .map_err(|(_, message)| Error::IcCdkError { message })?
        .0
        .map_err(|e| Error::IcCdkError {
            message: format!("{:?}", e),
        });
    res
}

#[update]
async fn deposit_ckusdt() -> Result<Wallet, Error> {
    let mut wallet = Wallet::get(caller());
    let balance = get_user_balance().await;
    if balance.is_err() {
        return Err(Error::IcCdkError {
            message: format!("{:?}", balance),
        });
    }
    let balance = balance.unwrap();
    if balance > Nat::from(1 as u64) {
        let fee: Nat = get_fee().await;
        transfer_from(balance.clone() - fee, caller(), ic_cdk::id()).await?;

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
    Ok(wallet.clone())
}

#[update]
async fn withdraw_ckusdt(amount: u64, address: String) -> Result<Nat, Error> {
    let balance = get_user_balance().await;
    if balance.is_err() {
        return Err(Error::IcCdkError {
            message: format!("{:?}", balance),
        });
    }
    let balance = balance.unwrap();
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
