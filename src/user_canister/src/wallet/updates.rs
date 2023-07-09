use std::collections::HashMap;
use std::fs::File;
use std::sync::atomic::Ordering;

use candid::{candid_method, Principal};
use ic_cdk::caller;
use ic_cdk_macros::update;
use serde::__private::de::Content;

use crate::{Exchange, ExchangeType, Wallet, WALLETS_STORE};

//
#[update]
#[candid_method(update)]
fn deposit_usdt(amount: u64) -> Result<u64, String> {
    let mut wallet = Wallet::get();
    wallet.deposit(amount, "".to_string())?;
    Ok(wallet.balance + amount)
}

#[update]
#[candid_method(update)]
fn withdraw_usdt(amount: u64) -> Result<u64, String> {
    let mut wallet = Wallet::get();
    wallet.withdraw(amount, "".to_string())?;
    Ok(wallet.balance - amount)
}