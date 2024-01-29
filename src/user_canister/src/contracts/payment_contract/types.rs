use std::collections::HashMap;
use std::sync::atomic::Ordering;

use ic_cdk::{caller};
use candid::{CandidType, Deserialize, Principal};

use crate::{CONTRACTS_STORE, StoredContract, Wallet, websocket};
use crate::contracts::Contract;
use crate::COUNTER;
use crate::storage_schema::{ContentId, ContractId};
use crate::websocket::{NoteContent, Notification, PaymentAction};


#[derive(PartialEq, Eq, Clone, Debug, CandidType, Deserialize)]
pub struct PaymentContract {
    pub(crate) contract_id: ContractId,
    pub(crate) receiver: Principal,
    pub(crate) sender: Principal,
    pub(crate) amount: u64,
    pub(crate) canceled: bool,
    pub(crate) released: bool,
    pub(crate) confirmed: bool,
    pub(crate) extra_cells: HashMap<String, String>,
    pub(crate) objected: Option<String>,
    // pub(crate) date_created: u64,
    // pub(crate) date_updated: u64,
    // pub(crate) date_conformed: u64,
    // pub(crate) date_date_released: u64,
    // pub(crate) date_date_canceled: u64,
}

// ------------ TODO study the imposable of make the PaymentContract like the shares contract ------------ \\
//               in which all the rows of the table stored in a field payments : Vec<>
//                 #[derive(Eq, PartialOrd, PartialEq, Clone, Debug, CandidType, Deserialize)]
//                 pub struct PaymentContract {
//                     pub(crate) contract_id: ContractId,
//                     pub(crate) payments: Vec<Payment>,
//                 }


// ------------ TODO Maybe we can get rid of both types of cutracts ------------ \\
//                  we could use only custom contract to achieve both functionalities

impl PaymentContract {
    pub fn new(receiver: Principal, sender: Principal, amount: u64) -> Self {
        let payment = PaymentContract {
            contract_id: COUNTER.fetch_add(1, Ordering::SeqCst).to_string(),
            receiver,
            sender,
            amount,
            canceled: false,
            released: false,
            confirmed: false,
            extra_cells: Default::default(),
            objected: None,
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
    pub fn get_total_dept(sender: Principal) -> u64 {
        let mut total_dept: u64 = 0;
        let all_contracts: HashMap<ContractId, StoredContract> = Contract::get_all_contracts().unwrap_or(HashMap::new());

        for contract in all_contracts.values() {
            if let StoredContract::PaymentContract(payment) = contract {
                if (!payment.released && !payment.canceled) && payment.sender == sender {
                    total_dept += payment.amount;
                }
            }
        };

        total_dept
    }

    pub fn update_payment_contracts(contracts: Vec<StoredContract>) -> Result<(), String> {
        let user_balance: f64 = Wallet::get(caller()).balance;

        let mut total_amount = 0.0;
        let mut visited = vec![];

        let all_contracts: HashMap<ContractId, StoredContract> = Contract::get_all_contracts().unwrap_or(HashMap::new());

        for contract in &contracts {
            if let StoredContract::PaymentContract(payment) = contract {
                if !payment.released && payment.receiver != caller() {
                    visited.push(payment.clone().contract_id);
                    total_amount += payment.amount as f64;
                }
            }
        }

        for contract in all_contracts.values() {
            if let StoredContract::PaymentContract(payment) = contract {
                if !payment.released && payment.receiver != caller() && !visited.contains(&payment.contract_id) {
                    visited.push(payment.clone().contract_id);
                    total_amount += payment.amount as f64;
                }
            }
        };
        // TODO instead of this use wallet.total_debt
        //     wallet.add_debt(payment.amount, payment.id)?;
        if total_amount > user_balance {
            let message = format!("Total non-released contracts exceeds your current balance of {}", user_balance).to_string();
            return Err(message);
        }

        // save the payment
        for contract in contracts {
            if let StoredContract::PaymentContract(payment) = contract {
                let payment = payment.update_or_create(caller())?;
                let content = NoteContent::PaymentContract(payment.clone(), PaymentAction::Update);
                let new_notification = Notification {
                    id: payment.contract_id.clone(),
                    sender: caller(),
                    receiver: payment.receiver.clone(),
                    content,
                    is_seen: false,
                };
                new_notification.save();
                websocket::contract_notification(payment.receiver.clone(), caller(), "payment".to_string(), payment.clone().contract_id);
            }
            // else {
            //     panic!("Invalid contract type");
            // }
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

    pub fn update_or_create(mut self, owner: Principal) -> Result<PaymentContract, String> {
        if let Ok(old_payment) = Self::get(owner, self.contract_id.clone()) {
            if old_payment == self {
                return Err("No changes detected in the payment contract.".to_string());
            }
            if old_payment.released {
                return Err("Payment contract is already realised".to_string());
            }
            if old_payment.confirmed {
                return Err("Payment contract is confirmed and cannot be updated".to_string());
            }
            if old_payment.canceled {
                return Err("Payment contract is canceled and cannot be updated".to_string());
            }
        };
        self.save()
    }


    // pub fn accept_for_both(sender: String, id: ContentId) -> Result<(), String> {
    //     let sender: Principal = sender.parse().unwrap();
    //     Payment::accept_payment(sender, id.clone())?;
    //     Payment::accept_payment(caller(), id)
    // }

    pub fn conform(mut self) -> Result<Self, String> {
        // let mut payment = PaymentContract::get(user, contract_id.clone())?;
        if self.receiver != caller() {
            return Err("Payment contract is not for this user.".to_string());
        }
        if self.confirmed {
            return Err("Payment contract is already confirmed.".to_string());
        }
        self.confirmed = true;
        self.save()?;
        Ok(self)
    }


    pub fn release(mut self) -> Result<PaymentContract, String> {
        if self.released == true {
            return Err("Payment contract is already released".to_string());
        };
        self.released = true;
        self.canceled = false;
        self.save()
    }

    pub fn cancel_payment(contract_id: ContractId) -> Result<(), String> {
        let mut payment = PaymentContract::get(caller(), contract_id.clone())?;
        if payment.sender != caller() {
            return Err("Payment contract is not for this user.".to_string());
        }
        if payment.canceled == true {
            return Err("Payment contract is already canceled".to_string());
        };
        if payment.confirmed == true {
            return Err("Payment contract is confirmed and cannot be canceled".to_string());
        };
        if payment.released == true {
            return Err("Payment contract is released and cannot be canceled".to_string());
        };
        payment.canceled = true;
        payment.save()?;
        Ok(())
    }

    pub fn delete(&self) -> Result<(), String> {
        CONTRACTS_STORE.with(|contracts_store| {
            let mut caller_contracts = contracts_store.borrow_mut();
            let caller_contract = caller_contracts
                .get_mut(&caller())
                .ok_or("Caller has no contracts")?;
            if let Some(contract) = caller_contract.remove(&self.contract_id) {
                if let StoredContract::PaymentContract(payment) = contract {
                    if payment.confirmed {
                        return Err("Payment contract is confirmed and cannot be deleted, Hint: You can request a delete first.".to_string());
                    }
                    if payment.released {
                        return Err("Payment contract is already released".to_string());
                    }
                    caller_contract.remove(&self.contract_id);
                }
            }
            Ok(())
        })
    }

    pub fn save(&self) -> Result<Self, String> {
        CONTRACTS_STORE.with(|contracts_store| {
            let mut caller_contracts = contracts_store.borrow_mut();
            let caller_contract = caller_contracts
                .get_mut(&caller())
                .ok_or("Caller has no contracts")?;
            caller_contract.insert(self.contract_id.clone(), StoredContract::PaymentContract(self.clone()));
            Ok(self.clone())
        })
    }

    pub fn get(user: Principal, contract_id: ContractId) -> Result<PaymentContract, String> {
        CONTRACTS_STORE.with(|contracts_store| {
            let mut caller_contracts = contracts_store.borrow_mut(); // Use borrow_mut to get a mutable reference
            let caller_contract = caller_contracts
                .get_mut(&user)
                .ok_or("Caller has no contracts")?;
            let contract = caller_contract
                .get(&contract_id)
                .ok_or("Contract not found")?;

            if let StoredContract::PaymentContract(existing_payment) = contract {
                return Ok(existing_payment.clone());
            }

            Err("Payment not found in contract".to_string())
        })
    }

    // Helper function to get contracts for a user
    fn get_list(user: Principal) -> Vec<StoredContract> {
        let res = CONTRACTS_STORE.with(|contracts_store| {
            let caller_contracts = contracts_store.borrow();
            caller_contracts.get(&user).cloned()
        });
        if let Some(contracts) = res {
            contracts.values().cloned().collect()
        } else {
            Vec::new()
        }
    }

    pub fn get_released_payments(user: Principal) -> Vec<PaymentContract> {
        let caller_contract = Self::get_list(user);

        let mut all_payments: Vec<PaymentContract> = Vec::new();

        for contract in caller_contract {
            if let StoredContract::PaymentContract(payment) = contract {
                if payment.released {
                    all_payments.push(payment.clone());
                }
            }
        }

        all_payments
    }

    pub fn get_canceled_payments(user: Principal, from: u64, to: u64) -> Vec<PaymentContract> {
        let caller_contract = Self::get_list(user);

        let mut canceled_payments: Vec<PaymentContract> = Vec::new();
        let mut count = 0;

        for contract in caller_contract {
            if let StoredContract::PaymentContract(payment) = contract {
                if payment.canceled && payment.sender == user && payment.confirmed {
                    // Check if the payment index is within the specified range
                    if count >= from && count < to {
                        canceled_payments.push(payment.clone());
                    }

                    count += 1;

                    // Break the loop if we have collected the required number of payments
                    if count >= to {
                        break;
                    }
                }
            }
        }

        canceled_payments
    }

    pub fn get_latest_canceled_payments(user: Principal, from: u64, to: u64) -> Vec<PaymentContract> {
        let caller_contract = Self::get_list(user);

        let mut canceled_payments: Vec<PaymentContract> = Vec::new();
        let mut count = 0;

        // Convert values to Vec and iterate through it in reverse order
        for contract in caller_contract.iter().rev() {
            if let StoredContract::PaymentContract(payment) = contract {
                if payment.canceled && payment.sender == caller() {
                    // Check if the payment index is within the specified range
                    if count >= from && count < to {
                        canceled_payments.push(payment.clone());
                    }

                    count += 1;

                    // Break the loop if we have collected the required number of payments
                    if count >= to {
                        break;
                    }
                }
            }
        }

        canceled_payments
    }
}