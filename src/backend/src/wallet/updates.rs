use crate::wallet::error::{Error, USDCResult};
use crate::websocket::{NoteContent, Notification};
use crate::workspaces::{
    estimate_transaction_fees, nat_to_u256, nat_to_u64, validate_caller_not_anonymous,
    EthereumNetwork, EVM_RPC,
};
use crate::{assert_token_symbol_length, parse_eth_address, wallet, UserToken, Exchange};
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
// use std::time;
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
    ic_cdk::call::<(TransferFromArgs, ), (Result<BlockIndex, TransferFromError>, )>(
        Principal::from_text("xevnm-gaaaa-aaaar-qafnq-cai").unwrap(),
        "icrc2_transfer_from",
        (args, ),
    )
        .await
        .map_err(|(_, message)| Error::IcCdkError { message })?
        .0
        .map_err(|e| Error::IcCdkError {
            message: format!("{:?}", e),
        })
}


// #[update]
// async fn get_local_balance() -> Result<Nat, String> {
//     get_user_balance().await
// }


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
    if balance > Nat::from(3000000 as u64) {
        let fee: Nat = get_fee().await;
        transfer_from(balance.clone() - fee.clone(), caller(), ic_cdk::id()).await?;
        let res = wallet
            .deposit(
                nat_to_u64((balance.clone() - fee) / Nat::from(1000000 as u64)) as f64,
                "ExternalWallet".to_string(),
                ExchangeType::Deposit,
            );
        if let Err(wallet_error) = res {
            return Err(Error::IcCdkError {
                message: format!("{:?}", wallet_error)
            });
        }
        return Ok(wallet.clone());
    }
    Err(Error::IcCdkError {
        message: format!("{:?}", "falied to deposit".to_string())
    })
}

#[update]
async fn withdraw_ckusdt(amount: u64, address: String) -> Result<Wallet, Error> {
    let balance = get_user_balance().await;
    if balance.is_err() {
        return Err(Error::IcCdkError {
            message: format!("{:?}", balance),
        });
    }
    let balance = balance.unwrap();

    let mut wallet = Wallet::get(caller());
    let res = wallet.withdraw(amount as f64, address.clone(), ExchangeType::Withdraw);
    if res.is_err() {
        return Err(Error::IcCdkError {
            message: format!("wallet error: {:?}", res),
        });
    }

    if Nat::from(amount.clone()) >= balance {
        transfer_from(
            Nat::from(amount.clone() as u64 * 1000000),
            ic_cdk::id(),
            Principal::from_text(address.clone()).unwrap(),
        )
            .await?;
    }
    Ok(wallet)
}


#[update]
pub fn internal_transaction(amount: f64, receiver: String, _type: ExchangeType) -> Result<(), String> {
    // let mut wallet = Wallet::get(caller());
    let payment = CPayment {
        contract_id: "none".to_string(),
        id: "".to_string(),
        amount: amount,
        sender: caller(),
        receiver: Principal::from_text(receiver.clone()).unwrap(),
        date_created: 0.0,
        date_released: 0.0,
        status: PaymentStatus::Released,
        cells: vec![],
    };
    payment.pay()?;
    Ok(())

    // if wallet.balance >= amount {
    //     let new_exchange = Exchange {
    //         from: wallet.owner.clone(),
    //         to: receiver.clone(),
    //         amount,
    //         _type,
    //         date_created: ic_cdk::api::time() as f64,
    //     };
    //
    //     wallet.exchanges.push(new_exchange);
    //     wallet.balance -= amount.clone();
    //
    //     wallet.save();
    //
    //     return Ok(());
    // } else {
    //     return Err(String::from("Insufficient balance"));
    // }

    // let res = payment.pay()?;
    // return Ok(());
}
