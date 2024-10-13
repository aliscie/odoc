use candid::Principal;
use ic_cdk::caller;
use ic_cdk_macros::update;

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
