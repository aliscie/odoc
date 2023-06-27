use std::collections::HashMap;
use std::sync::atomic::Ordering;

use ic_cdk::{api::call::ManualReply, caller, export::{
    candid::{CandidType, Deserialize},
    Principal,
}};

use crate::{CONTRACTS_STORE, FILE_CONTENTS, StoredContract};
use crate::contracts::Contract;
use crate::files::COUNTER;
use crate::tables::Table;
use crate::user::User;

#[derive(PartialEq, Eq, PartialOrd, Clone, Debug, Default, CandidType, Deserialize)]
pub struct Payment {
    contract_id: u64,
    pub(crate) receiver: User,
    pub(crate) sender: User,
    pub(crate) amount: u64,
    pub(crate) released: bool,
    pub(crate) confirmed: bool,
}


impl Payment {
    pub fn new(receiver: User, sender: User, amount: u64) -> Self {
        let payment = Payment {
            contract_id: COUNTER.fetch_add(1, Ordering::SeqCst),
            receiver,
            sender,
            amount,
            released: false,
            confirmed: false,
        };

        CONTRACTS_STORE.with(|contracts_store| {
            let mut caller_contracts = contracts_store.borrow_mut();
            let caller_contract = caller_contracts
                .entry(caller())
                .or_insert_with(HashMap::new);

            let contract = caller_contract
                .entry(payment.contract_id)
                .or_insert_with(|| StoredContract::PaymentContract(payment.clone()));

            if let StoredContract::PaymentContract(existing_payment) = contract {
                *existing_payment = payment.clone();
            } else {
                panic!("Invalid contract type");
            }
        });

        payment
    }

    pub fn update(payment: Payment) -> Result<(), String> {
        CONTRACTS_STORE.with(|contracts_store| {
            let mut caller_contracts = contracts_store.borrow_mut();
            let caller_contract = caller_contracts
                .get_mut(&caller())
                .ok_or("Caller has no contracts")?;
            let contract = caller_contract
                .get_mut(&payment.get_contract_id())
                .ok_or("Contract not found")?;

            if let StoredContract::PaymentContract(existing_payment) = contract {
                if existing_payment.confirmed {
                    return Err("Payment contract is confirmed and cannot be updated".to_string());
                }

                *existing_payment = payment;
                return Ok(());
            }

            Err("Payment not found in contract".to_string())
        })
    }

    pub fn multi_update(payments: Vec<Payment>) -> Vec<Result<(), String>> {
        payments
            .into_iter()
            .map(|payment| Self::update(payment))
            .collect()
    }
    pub fn get_contract_id(&self) -> u64 {
        self.contract_id
    }
}