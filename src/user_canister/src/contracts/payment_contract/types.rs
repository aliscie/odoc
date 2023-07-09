use std::collections::HashMap;
use std::sync::atomic::Ordering;

use ic_cdk::{api::call::ManualReply, caller, export::{
    candid::{CandidType, Deserialize},
    Principal,
}};

use crate::{CONTRACTS_STORE, FILE_CONTENTS, StoredContract, WALLETS_STORE};
use crate::contracts::Contract;
use crate::files::COUNTER;
use crate::storage_schema::{ContentId, ContractId};
use crate::tables::Table;
use crate::user::User;

#[derive(PartialEq, Eq, PartialOrd, Clone, Debug, CandidType, Deserialize)]
pub struct Payment {
    pub(crate) contract_id: ContractId,
    pub(crate) receiver: Principal,
    pub(crate) sender: Principal,
    pub(crate) amount: u64,
    pub(crate) canceled: bool,
    pub(crate) released: bool,
    pub(crate) confirmed: bool,
}


impl Payment {
    pub fn new(receiver: Principal, sender: Principal, amount: u64) -> Self {
        let payment = Payment {
            contract_id: COUNTER.fetch_add(1, Ordering::SeqCst).to_string(),
            receiver,
            sender,
            amount,
            canceled: false,
            released: false,
            confirmed: false,
        };

        // Update the contract storage with the new payment
        CONTRACTS_STORE.with(|contracts_store| {
            let mut caller_contracts = contracts_store.borrow_mut();
            let caller_contract = caller_contracts
                .entry(caller())
                .or_insert_with(HashMap::new);

            let contract = caller_contract
                .entry(payment.clone().contract_id)
                .or_insert_with(|| StoredContract::PaymentContract(payment.clone()));

            if let StoredContract::PaymentContract(existing_payment) = contract {
                *existing_payment = payment.clone();
            } else {
                panic!("Invalid contract type");
            }
        });

        payment
    }

    pub fn update_payment_contracts(contracts: Vec<StoredContract>) -> Result<(), String> {
        let user_balance: u64 = WALLETS_STORE.with(|wallets_store| {
            let wallets = wallets_store.borrow();
            let wallet = wallets.get(&caller()).unwrap();
            wallet.balance
        });

        let mut total_amount: u64 = 0;
        let mut visited = vec![];

        let all_contracts: HashMap<ContractId, StoredContract> = Contract::get_all_contracts().unwrap_or(HashMap::new());

        for contract in &contracts {
            if let StoredContract::PaymentContract(payment) = contract {
                if !payment.released && payment.receiver != caller() {
                    visited.push(payment.clone().contract_id);
                    total_amount += payment.amount;
                }
            }
        }

        for contract in all_contracts.values() {
            if let StoredContract::PaymentContract(payment) = contract {
                if !payment.released && payment.receiver != caller() && !visited.contains(&payment.contract_id) {
                    visited.push(payment.clone().contract_id);
                    total_amount += payment.amount;
                }
            }
        };

        if total_amount > user_balance {
            return Err("Total non-released contracts exceeds your current balance of 1000".to_string());
        }


        for contract in contracts {
            if let StoredContract::PaymentContract(payment) = contract {
                Payment::update_or_create(caller(), payment.clone())?;
                Payment::update_or_create(payment.receiver.clone(), payment)?;
            } else {
                panic!("Invalid contract type");
            }
        };
        Ok(())
    }


    pub fn is_updatable(self) -> Result<(), String> {
        if self.confirmed {
            return Err("Payment contract is confirmed and cannot be updated".to_string());
        } else if self.released {
            return Err("Payment contract is already realised".to_string());
        }
        Ok(())
    }

    pub fn update_or_create(owner: Principal, payment: Payment) -> Result<Payment, String> {
        CONTRACTS_STORE.with(|contracts_store| {
            let mut caller_contracts = contracts_store.borrow_mut();
            let caller_contract = caller_contracts
                .entry(owner)
                .or_insert_with(HashMap::new);

            let contract = caller_contract
                .entry(payment.clone().contract_id)
                .or_insert_with(|| StoredContract::PaymentContract(payment.clone()));

            if let StoredContract::PaymentContract(existing_payment) = contract {
                if existing_payment.confirmed {
                    return Err("Payment contract is confirmed and cannot be updated".to_string());
                }
                if existing_payment.canceled == true {
                    return Err("Payment contract is canceled and cannot be updated".to_string());
                }
                *existing_payment = payment.clone();
                return Ok(payment);
            }

            Err("Somthing went wrong.".to_string())
        })
    }

    pub fn update(payment: Payment) -> Result<(), String> {
        CONTRACTS_STORE.with(|contracts_store| {
            let mut caller_contracts = contracts_store.borrow_mut();
            let caller_contract = caller_contracts
                .get_mut(&caller())
                .ok_or("Caller has no contracts")?;
            let contract = caller_contract
                .get_mut(&payment.contract_id) // Use payment.contract_id as the key
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

    // pub fn accept_for_both(sender: String, id: ContentId) -> Result<(), String> {
    //     let sender: Principal = sender.parse().unwrap();
    //     Payment::accept_payment(sender, id.clone())?;
    //     Payment::accept_payment(caller(), id)
    // }

    pub fn accept_payment(sender: Principal, contract_id: ContentId) -> Result<(), String> {
        CONTRACTS_STORE.with(|contracts_store| {
            let mut caller_contracts = contracts_store.borrow_mut();
            let caller_contract = caller_contracts
                .get_mut(&sender)
                .ok_or("Caller has no contracts")?;
            let contract = caller_contract
                .get_mut(&contract_id) // Use payment.contract_id as the key
                .ok_or("Contract not found")?;

            if let StoredContract::PaymentContract(existing_payment) = contract {
                if existing_payment.confirmed {
                    return Err("Payment contract is already confirmed.".to_string());
                }
                if existing_payment.receiver != caller() {
                    return Err("Payment contract is not for this user.".to_string());
                }
                existing_payment.confirmed = true;
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

    pub fn delete_for_both(contract_id: ContractId) -> Result<(), String> {
        let payment = Payment::get(contract_id.clone())?;
        Payment::delete_payment_contract(payment.receiver, contract_id.clone())?;
        Payment::delete_payment_contract(payment.sender, contract_id)
    }

    pub fn cancel_payment(user: Principal, contract_id: ContractId) -> Result<(), String> {
        CONTRACTS_STORE.with(|contracts_store| {
            let mut caller_contracts = contracts_store.borrow_mut();
            let caller_contract = caller_contracts
                .get_mut(&user)
                .ok_or("Caller has no contracts")?;
            let contract = caller_contract
                .get_mut(&contract_id) // Use payment.contract_id as the key
                .ok_or("Contract not found")?;

            if let StoredContract::PaymentContract(existing_payment) = contract {
                if existing_payment.confirmed {
                    return Err("Payment contract is confirmed and cannot be updated".to_string());
                }
                if existing_payment.released {
                    return Err("Payment contract is already released".to_string());
                }

                return if existing_payment.canceled == true {
                    Err("Payment contract is already canceled".to_string())
                } else {
                    existing_payment.canceled = true;
                    Ok(())
                };
            }

            Err("Payment not found in contract".to_string())
        })
    }

    pub fn delete_payment_contract(user: Principal, contract_id: ContractId) -> Result<(), String> {
        CONTRACTS_STORE.with(|contracts_store| {
            let mut caller_contracts = contracts_store.borrow_mut();
            let caller_contract = caller_contracts
                .get_mut(&user)
                .ok_or("Caller has no contracts")?;
            if let Some(contract) = caller_contract.remove(&contract_id) {
                if let StoredContract::PaymentContract(payment) = contract {
                    if payment.confirmed {
                        return Err("Payment contract is confirmed and cannot be deleted, Hint: You can request a delete first.".to_string());
                    }
                    if payment.released {
                        return Err("Payment contract is already released".to_string());
                    }
                    caller_contract.remove(&contract_id);
                }
            }
            Ok(())
        })
    }
    pub fn get(contract_id: ContractId) -> Result<Payment, String> {
        CONTRACTS_STORE.with(|contracts_store| {
            let caller_contracts = contracts_store.borrow();
            let caller_contract = caller_contracts
                .get(&caller())
                .ok_or("Caller has no contracts")?;
            let contract = caller_contract
                .get(&contract_id) // Use payment.contract_id as the key
                .ok_or("Contract not found")?;

            if let StoredContract::PaymentContract(existing_payment) = contract {
                return Ok(existing_payment.clone());
            }

            Err("Payment not found in contract".to_string())
        })
    }
    pub fn get_contract_id(&self) -> ContractId {
        self.contract_id.clone() // Return a reference to the contract_id
    }
}