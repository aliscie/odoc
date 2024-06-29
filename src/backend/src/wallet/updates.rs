use ic_cdk::caller;
use ic_cdk_macros::update;


use crate::{ExchangeType, Wallet};

//
#[update]
fn deposit_usdt(amount: f64) -> Result<f64, String> {
    let mut wallet = Wallet::get(caller());
    let wallet = wallet.deposit(amount.clone(), "ExternalWallet".to_string(), ExchangeType::Deposit)?;
    Ok(wallet.balance)
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