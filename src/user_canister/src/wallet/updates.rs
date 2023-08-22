use std::collections::HashMap;
use std::fs::File;
use std::sync::atomic::Ordering;

use candid::{candid_method, Principal};
use ic_cdk::caller;
use ic_cdk_macros::update;
use serde::__private::de::Content;

use crate::{Exchange, ExchangeType, Payment, Wallet, WALLETS_STORE};

//
#[update]
#[candid_method(update)]
fn deposit_usdt(amount: u64) -> Result<u64, String> {
    let mut wallet = Wallet::get(caller());
    wallet.deposit(amount, "".to_string(), ExchangeType::Deposit)?;
    Ok(wallet.balance + amount)
}

#[update]
#[candid_method(update)]
fn withdraw_usdt(amount: u64) -> Result<u64, String> {
    let mut wallet = Wallet::get(caller());
    let dept = Payment::get_total_dept(caller());
    if dept > 0 && dept >= (wallet.balance - amount) {
        return Err(format!("Your total dept it{}, You can cancel some of the contract to withdraw which may effect your trust score.", dept).to_string());
    }
    wallet.withdraw(amount, "".to_string(), ExchangeType::Withdraw)?;
    Ok(wallet.balance - amount)
}