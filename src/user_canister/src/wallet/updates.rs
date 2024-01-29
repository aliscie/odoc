




use ic_cdk::caller;
use ic_cdk_macros::update;



use crate::{ExchangeType, PaymentContract, Wallet};

//
#[update]
fn deposit_usdt(amount: f64) -> Result<f64, String> {
    let mut wallet = Wallet::get(caller());
    wallet.deposit(amount.clone() , "ExternalWallet".to_string(), ExchangeType::Deposit)?;
    Ok(wallet.balance + amount)
}

#[update]
fn withdraw_usdt(amount: f64) -> Result<f64, String> {
    let mut wallet = Wallet::get(caller());
    let dept = PaymentContract::get_total_dept(caller()) as f64;
    if dept > 0.0 && dept >= (wallet.clone().balance - amount.clone()) {
        return Err(format!("Your total dept it{}, You can cancel some of the contract to withdraw which may effect your trust score.", dept).to_string());
    }
    wallet.withdraw(amount.clone(), "".to_string(), ExchangeType::Withdraw)?;
    Ok(wallet.balance - amount)
}