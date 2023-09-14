use std::collections::HashMap;
use std::sync::atomic::Ordering;

use candid::Principal;
use ic_cdk::{api::call::ManualReply, call, caller, export::{
    candid::{CandidType, Deserialize},
}};

use crate::{CONTRACTS_STORE, ExchangeType, PaymentContract, StoredContract, Wallet};
use crate::files::COUNTER;
use crate::storage_schema::ContractId;
use crate::user::User;

#[derive(PartialEq, Eq, PartialOrd, Clone, Debug, CandidType, Deserialize)]
pub struct Share {
    pub(crate) contract_id: ContractId,
    pub(crate) receiver: Principal,
    pub(crate) conformed: bool,
    pub(crate) accumulation: u64,
    // only receiver can mutate this
    pub(crate) share: u64,
}


#[derive(Eq, PartialOrd, PartialEq, Clone, Debug, CandidType, Deserialize)]
pub struct SharePayment {
    pub(crate) amount: u64,
    pub(crate) sender: Principal,
    // pub(crate) date: String,
}


#[derive(Eq, PartialOrd, PartialEq, Clone, Debug, CandidType, Deserialize)]
pub struct SharesContract {
    pub(crate) contract_id: ContractId,
    pub(crate) shares: Vec<Share>,
    pub(crate) payments: Vec<SharePayment>,

    // Note SharesContract arrange
    // 1. the payer should have their access/services/goods using `access_formula` and `access_id`
    // 2. the receiver should have their shares using `shares`.

    // for example, (if payment.amount == 14) {storeApi.sendProduct(product_id, payer_location)}
    // pub(crate) access_formula: String,


    // Each payer will have an access to a file/page with the id <access_id> after sending the payment
    // pub(crate) access_id: String,

    // this is like each user should pay 14$
    // pub(crate) expected_payment: u64,
}

impl SharesContract {

    pub fn new(shares: Vec<Share>) -> SharesContract {
        let share = SharesContract {
            contract_id: COUNTER.fetch_add(1, Ordering::SeqCst).to_string(),
            shares,
            payments: vec![],
        };
        CONTRACTS_STORE.with(|contracts_store| {
            let mut caller_contracts = contracts_store.borrow_mut();
            let caller_contract = caller_contracts
                .entry(caller())
                .or_insert_with(HashMap::new);

            let contract = caller_contract
                .entry(share.clone().contract_id)
                .or_insert_with(|| StoredContract::SharesContract(share.clone()));

            if let StoredContract::SharesContract(existing_share) = contract {
                *existing_share = share.clone();
            } else {
                panic!("Invalid contract type");
            }
        });

        share
    }

    pub fn get(contract_id: ContractId) -> Result<SharesContract, String> {
        CONTRACTS_STORE.with(|contracts_store| {
            let caller_contracts = contracts_store.borrow();
            let caller_contract = caller_contracts
                .get(&caller())
                .ok_or("Caller has no contracts")?;
            let contract = caller_contract
                .get(&contract_id) // Use payment.contract_id as the key
                .ok_or("Contract not found")?;

            if let StoredContract::SharesContract(existing_share) = contract {
                return Ok(existing_share.clone());
            }

            Err("Payment not found in contract".to_string())
        })
    }

    pub fn update(&mut self, updated_share: Share) -> Result<(), String> {
        CONTRACTS_STORE.with(|contracts_store| {
            let mut caller_contracts = contracts_store.borrow_mut();
            let caller_contract = caller_contracts
                .get_mut(&caller())
                .ok_or("Caller has no contracts")?;

            let contract = caller_contract
                .get_mut(&self.contract_id) // Use updated_share.contract_id as the key
                .ok_or("Contract not found")?;

            // TODO if let StoredContract::SharesContract(existing_share_contract) = self {
            if let StoredContract::SharesContract(existing_share_contract) = contract {
                // Find the corresponding share in the contract's shares list
                if let Some(existing_share) = existing_share_contract
                    .shares
                    .iter_mut()
                    .find(|s| s.receiver == updated_share.receiver)
                {
                    if existing_share.conformed {
                        return Err("Share is conformed and cannot be updated".to_string());
                    }

                    existing_share.share = updated_share.share;

                    return Ok(());
                }
            }

            Err("Share not found in contract".to_string())
        })
    }

    pub fn conform(&mut self) -> Result<(), String> {
        CONTRACTS_STORE.with(|contracts_store| {
            let mut caller_contracts = contracts_store.borrow_mut();
            let caller_contract = caller_contracts
                .get_mut(&caller())
                .ok_or("Caller has no contracts")?;

            let contract = caller_contract
                .get_mut(&self.contract_id) // Use updated_share.contract_id as the key
                .ok_or("Contract not found")?;

            if let StoredContract::SharesContract(existing_share_contract) = contract {
                // Find the corresponding share in the contract's shares list
                if let Some(existing_share) = existing_share_contract
                    .shares
                    .iter_mut()
                    .find(|s| s.contract_id == self.contract_id)
                {
                    if existing_share.conformed {
                        return Err("Share is conformed and cannot be updated".to_string());
                    }

                    if caller() == existing_share.receiver {
                        existing_share.conformed = true;
                    } else {
                        return Err("Only the share receiver can conform share".to_string());
                    }


                    return Ok(());
                }
            }

            Err("Share not found in contract".to_string())
        })
    }

    pub fn pay(&mut self, amount: u64) -> Result<(), String> {

        // 1. Create payment
        let payment = SharePayment {
            sender: caller(),
            amount,
        };

        CONTRACTS_STORE.with(|contracts_store| {
            let mut caller_contracts = contracts_store.borrow_mut();
            let caller_contract = caller_contracts
                .get_mut(&caller())
                .ok_or("Caller has no contracts")?;

            let contract = caller_contract
                .get_mut(&self.contract_id)
                .ok_or("Contract not found")?;

            if let StoredContract::SharesContract(existing_share_contract) = contract {
                // 1.2. Deposit payments for share holders
                existing_share_contract.payments.push(payment);


                let mut wallet = Wallet::get(caller());
                wallet.withdraw(amount, "".to_string(), ExchangeType::LocalSend)?;


                // 2. Distribute payments to share holders
                for existing_share in existing_share_contract.shares.iter_mut() {
                    let share_value = amount * existing_share.share;
                    let mut wallet = Wallet::get(existing_share.receiver);
                    wallet.deposit(share_value, "".to_string(), ExchangeType::LocalReceive)?;
                    existing_share.accumulation += share_value;
                }

                return Ok(());
            }

            Err("Share not found in contract".to_string())
        })
    }
}

