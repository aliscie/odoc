use std::collections::HashMap;
use std::sync::atomic::Ordering;

use candid::Principal;
use ic_cdk::{api::call::ManualReply, call, caller, export::{
    candid::{CandidType, Deserialize},
}};

use crate::{CONTRACTS_STORE, ExchangeType, PaymentContract, StoredContract, Wallet};
use crate::files::COUNTER;
use crate::storage_schema::{ContractId, ShareContractId};
use crate::user::User;

#[derive(PartialEq, Eq, PartialOrd, Clone, Debug, CandidType, Deserialize)]
pub struct Share {
    pub(crate) share_contract_id: ShareContractId,
    pub(crate) receiver: Principal,
    pub(crate) conformed: bool,
    pub(crate) accumulation: u64,
    pub(crate) contractor: Option<Principal>,
    // the contract auther/ requester
    // only receiver can mutate this
    pub(crate) share: u64,
}

#[derive(PartialEq, Eq, PartialOrd, Clone, Debug, CandidType, Deserialize)]
pub struct ShareRequest {
    pub(crate) share_contract_id: ShareContractId,
    pub(crate) receiver: Principal,
    pub(crate) contractor: Option<Principal>,
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

    pub(crate) shares_requests: Vec<Share>,

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
            shares_requests: vec![],
        };
        if !share.clone().is_valid_shares() {
            panic!("Shares does not sum to 100%")
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

    pub fn is_valid_shares(&mut self) -> bool {
        let mut shares_value = 0;
        for share in &self.shares {
            shares_value += share.share
        }
        shares_value == 1
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
                let mut share_contract = existing_share_contract.clone();
                if let Some(existing_share) = existing_share_contract
                    .shares
                    .iter_mut()
                    .find(|s| s.share_contract_id == updated_share.share_contract_id)
                {
                    if existing_share.conformed {
                        return Err("Share is conformed and cannot be updated".to_string());
                    }
                    let original_value = existing_share.share;
                    existing_share.share = updated_share.share;

                    if !share_contract.is_valid_shares() {
                        // reset share value to original value.
                        existing_share.share = original_value;
                        return Err("Shares does not sum to 100%".to_string());
                    };

                    return Ok(());
                }
            }

            Err("Share not found in contract".to_string())
        })
    }

    pub fn conform(&mut self, share_contract_id: ShareContractId) -> Result<(), String> {
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
                    .find(|s| s.share_contract_id == share_contract_id)
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

    pub fn request(&mut self, shares_request: Share) -> Result<(), String> {
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
                existing_share_contract.shares_requests.push(shares_request);
            }

            Err("Share not found in contract".to_string())
        })
    }

    pub fn approve_request(&mut self, share_request_contract_id: ShareContractId) -> Result<(), String> {
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
                    .shares_requests
                    .iter_mut()
                    .find(|s| s.share_contract_id == share_request_contract_id)
                {
                    if existing_share.conformed {
                        return Err("Share is conformed and cannot be updated".to_string());
                    }

                    // 1. approve
                    if caller() == existing_share.receiver {
                        existing_share.conformed = true;
                    } else {
                        return Err("Only the share receiver can conform share".to_string());
                    }

                    // 2. set the share
                    let mut share = existing_share_contract.shares.iter_mut().find(|s| s.share_contract_id == share_request_contract_id).unwrap();
                    share = existing_share;
                    if !existing_share_contract.is_valid_shares() {
                        return Err("Shares does not sum to 100%".to_string());
                    }

                    return Ok(());
                }
            }

            Err("Share not found in contract".to_string())
        })
    }


    pub fn pay(&mut self, amount: u64) -> Result<SharesContract, String> {

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
                existing_share_contract.payments.push(payment);
                return Ok(existing_share_contract.clone());
            }

            return Err("Share not found in contract".to_string());
        })
    }
}

