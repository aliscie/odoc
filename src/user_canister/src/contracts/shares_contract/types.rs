use std::collections::{HashMap, HashSet};
use std::sync::atomic::Ordering;
use serde::Serialize;

use candid::Principal;
use ic_cdk::{caller, print};
use candid::{CandidType, Deserialize};

use crate::{CONTRACTS_STORE, StoredContract};
use crate::COUNTER;
use crate::storage_schema::{ContractId, ShareContractId, ShareRequestId};
use crate::tables::Formula;
use crate::websocket::{NoteContent, Notification};


#[derive(PartialEq, Eq, Clone, Debug, Serialize, CandidType, Deserialize)]
pub struct Share {
    pub(crate) share_contract_id: ShareContractId,
    pub(crate) receiver: Principal,
    pub(crate) confirmed: bool,
    pub(crate) accumulation: u64,
    // pub(crate) contractor: Option<Principal>,
    // the contract auther/ requester
    // only receiver can mutate this
    pub(crate) share: u64,
    pub(crate) extra_cells: HashMap<String, String>,
}

#[derive(PartialEq, Eq, Clone, Debug, Serialize, CandidType, Deserialize)]
pub struct ShareRequest {
    pub(crate) id: ShareRequestId,
    pub(crate) name: ContractId,
    pub(crate) shares: Vec<Share>,
    pub(crate) requester: Principal,
    pub(crate) approvals: Vec<Principal>,
    pub(crate) is_applied: bool,
}

impl ShareRequest {
    pub fn new(name: ContractId, shares: Vec<Share>, requester: Principal) -> ShareRequest {
        let id = COUNTER.fetch_add(1, Ordering::SeqCst).to_string();
        let approvals = vec![];
        let is_applied = false;
        ShareRequest {
            id,
            name,
            shares,
            requester,
            approvals,
            is_applied,
        }
    }

    pub fn is_approved(&self) -> bool {
        for share in &self.shares {
            if !self.approvals.contains(&share.receiver) {
                return false;
            }
            for share in &self.shares {
                if !self.approvals.contains(&share.receiver) {
                    return false;
                }
            };
        }
        true
    }
}


#[derive(Eq, PartialOrd, PartialEq, Clone, Debug, Serialize, CandidType, Deserialize)]
pub struct SharePayment {
    pub(crate) amount: u64,
    pub(crate) sender: Principal,
    // pub(crate) date: String,
}

#[derive(Eq, PartialOrd, PartialEq, Clone, Debug, Serialize, CandidType, Deserialize)]
pub struct SharePaymentOption {
    pub(crate) id: String,
    pub(crate) title: String,
    pub(crate) description: String,
    pub(crate) date: String,
    pub(crate) amount: u64,
}


#[derive(Eq, PartialEq, Clone, Debug, Serialize, CandidType, Deserialize)]
pub struct SharesContract {
    pub(crate) contract_id: ContractId,
    pub(crate) shares: Vec<Share>,
    pub(crate) payments: Vec<SharePayment>,
    pub(crate) payment_options: Vec<SharePaymentOption>,
    pub(crate) shares_requests: HashMap<ShareRequestId, ShareRequest>,
    pub(crate) author: String,

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
            payment_options: vec![],
            shares_requests: HashMap::new(),
            author: caller().to_string(),
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
    pub fn is_all_approved(&self) -> bool {
        for (_, share_request) in &self.shares_requests {
            if !share_request.is_approved() {
                return false;
            }
        }
        true
    }

    pub fn save(&self) -> Result<(), String> {
        let mut contractors = vec![];
        for share in &self.shares {
            contractors.push(share.receiver);
        }

        if caller().to_string() != self.clone().author && !contractors.contains(&caller()) {
            return Err("Only the author or the contractors can save the contract".to_string());
        }

        if !self.clone().is_valid_shares() {
            let ms: String = format!("{:?} Shares does not sum to 100% ", self.clone().contract_id);
            return Err(ms);
        }
        self.clone().is_valid_requests()?;
        let author: Principal = Principal::from_text(self.clone().author).unwrap();
        CONTRACTS_STORE.with(|contracts_store| {
            let mut caller_contracts = contracts_store.borrow_mut();
            let caller_contract = caller_contracts
                .entry(author)
                .or_insert_with(HashMap::new);


            // check if there are changes by comparing old and new payment
            if let Some(StoredContract::SharesContract(old_share)) = caller_contract.get(&self.clone().contract_id) {
                if old_share == self {
                    return Err("No changes detected in the shares contract".to_string());
                };
                if old_share.payments != self.clone().payments {
                    return Err("You can't update payments".to_string());
                };

                for old_share in old_share.shares.iter() {
                    if old_share.clone().confirmed && old_share != self.clone().shares.iter().find(|s| s.share_contract_id == old_share.share_contract_id).unwrap() {
                        return Err("You can't update a confirmed shares".to_string());
                    }
                };
                // check if share_requests != old_share_requests
                if old_share.shares_requests != self.clone().shares_requests {
                    for (id, request) in self.clone().shares_requests {
                        if let Some(old_shares) = old_share.shares_requests.get(&id) {
                            if old_shares.is_approved() && old_shares.shares != request.shares {
                                return Err("You can't update approved shares".to_string());
                            };
                        };
                        // ----------- TODO ---------- \\
                        //              if is_approved then share.shares_requests.ma(share=>{return old_share.shares_requests.get().shares.get())})
                        //              Get the old share and set it back to prevent any update in case of is_approved
                    };
                };


                //TODO  keep is_applied and approvals same as old_share.requests
                // for old_share_request in old_share.shares_requests.values() {
                //     if old_share_request.approvals != share.clone().shares_requests.values().find(|s| s.id == old_share_request.id).unwrap().approvals {
                //         return Err("You can't update approvals".to_string());
                //     }
                //     if old_share_request.is_applied != share.clone().shares_requests.values().find(|s| s.id == old_share_request.id).unwrap().is_applied {
                //         return Err("You can't update is_applied".to_string());
                //     }
                // };

                // TODO
                //     share.shares_requests.iter_mut().for_each(|(id, request)| {
                //         if let Some(old_request) = old_share.shares_requests.get(id) {
                //             request.is_applied = old_request.clone().is_applied;
                //             request.approvals = old_request.approvals.clone();
                //         }
                //     });
            }

            let contract = caller_contract
                .entry(self.clone().contract_id)
                .or_insert_with(|| StoredContract::SharesContract(self.clone()));


            if let StoredContract::SharesContract(existing_share) = contract {
                *existing_share = self.clone();
            };
            Ok(())
        })
    }

    pub fn update_shares_contracts(contracts: Vec<StoredContract>) -> Result<(), String> {
        for contract in contracts {
            if let StoredContract::SharesContract(share_contract) = contract {
                share_contract.save()?;
            }
        };
        Ok(())
    }

    pub fn get(contract_id: ContractId, author: Principal) -> Result<SharesContract, String> {
        CONTRACTS_STORE.with(|contracts_store| {
            let caller_contracts = contracts_store.borrow();
            let caller_contract = caller_contracts
                .get(&author)
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

    pub fn get_for_author(author: Principal, contract_id: ContractId) -> Result<SharesContract, String> {
        CONTRACTS_STORE.with(|contracts_store| {
            let caller_contracts = contracts_store.borrow();
            let caller_contract = caller_contracts
                .get(&author)
                .ok_or("author has no contracts")?;
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
            shares_value += share.clone().share
        }
        shares_value == 100
    }

    pub fn is_valid_requests(&mut self) -> Result<String, String> {
        for share_request in self.shares_requests.values() {
            let mut shares_value = 0;
            for share in &share_request.shares {
                shares_value += share.clone().share
            };
            if shares_value != 100 {
                return Err(format!("Shares does not sum to 100% for request {:?}, value:{:?}", share_request.id, shares_value));
            };
        }
        Ok("".to_string())
    }


    pub fn conform(&mut self, user: Principal, share_contract_id: ShareContractId) -> Result<(), String> {
        CONTRACTS_STORE.with(|contracts_store| {
            let mut caller_contracts = contracts_store.borrow_mut();
            let caller_contract = caller_contracts
                .get_mut(&user)
                .ok_or("author has no contracts")?;

            let contract = caller_contract
                .get_mut(&self.contract_id) // Use updated_share.contract_id as the key
                .ok_or("Contract not found")?;

            if let StoredContract::SharesContract(existing_share) = contract {
                let mut updated = existing_share.clone();
                for s in existing_share.clone().shares {
                    if s.share_contract_id == share_contract_id && caller() != s.receiver {
                        return Err("You can't confirm other's shares".to_string());
                    }
                }
                updated.shares = existing_share.clone().shares
                    .into_iter()
                    .map(|mut s| {
                        if s.share_contract_id == share_contract_id && caller() == s.receiver {
                            s.confirmed = true;
                        }
                        s
                    })
                    .collect();
                *existing_share = updated.clone();
                return Ok(());
            };

            Err("Share not found in contract".to_string())
        })
    }


    // pub fn apply_request(&mut self, share_request_id: ShareRequestId) -> Result<ShareRequest, String> {
    //     let request = self.shares_requests.get(&share_request_id);
    //     let is_approved = request.unwrap().is_approved();
    //     let is_applied = request.unwrap().is_applied.clone();
    //
    //     if !is_approved {
    //         return Err("You can't apply a request before approving it from all the share holder".to_string());
    //     };
    //
    //     if is_applied {
    //         return Err("This request was already applied, You can't apply a request twice.".to_string());
    //     };
    //
    //
    //     CONTRACTS_STORE.with(|contracts_store| {
    //         let mut caller_contracts = contracts_store.borrow_mut();
    //         // for now only the author can apply the request, maybe later we can change the logic
    //         let caller_contract = caller_contracts
    //             .entry(caller())
    //             .or_default();
    //
    //         let contract = caller_contract
    //             .get_mut(&self.clone().contract_id)
    //             .ok_or("Contract not found")?;
    //
    //         // set the shares =  to shares_request
    //         if let StoredContract::SharesContract(existing_share) = contract {
    //             let mut updated = existing_share.clone();
    //
    //
    //             // ------------ set share.confirmed = true for all the req.shares ------------ \\
    //             let req = updated.shares_requests.get(&share_request_id).unwrap().clone();
    //             updated.shares = req.shares.clone().into_iter()
    //                 .map(|mut s| {
    //                     s.confirmed = true;
    //                     s
    //                 })
    //                 .collect();
    //
    //             //------------ set is_applied= true of  shares_request with id of share_request_id ------------\\
    //             updated.shares_requests = updated.shares_requests.into_iter()
    //                 .map(|(id, mut s)| {
    //                     if s.id == share_request_id {
    //                         s.is_applied = true;
    //                     }
    //                     (id, s)
    //                 })
    //                 .collect();
    //             updated.save().expect("TODO: panic message");
    //             // *existing_share = updated.clone();
    //
    //             // ----------- Notify everyone in the contract except the caller ------------ \\
    //             let original_share = self.shares.clone();
    //             let new_shares = request.unwrap().shares.clone();
    //             let mut receivers = new_shares.clone().into_iter().map(|s| s.receiver).collect::<Vec<Principal>>();
    //             // add all the receiver from original_share that does not already exits in receivers
    //             for s in original_share.clone() {
    //                 if !receivers.contains(&s.receiver) {
    //                     receivers.push(s.receiver);
    //                 }
    //             };
    //             let note_content = NoteContent::ShareRequestApplied(self.clone());
    //             for receiver in receivers {
    //                 if receiver != caller() {
    //                     let new_notification = Notification::new(receiver, note_content.clone());
    //                     new_notification.save();
    //                 }
    //             }
    //
    //             return Ok(request.unwrap().clone());
    //         };
    //
    //         Err("Share not found in contract".to_string())
    //     })
    // }

    // mote this way shorter always use the save method no need to re use with everytime.
    pub fn apply_request(&mut self, share_request_id: ShareRequestId) -> Result<ShareRequest, String> {
        let request = self.shares_requests.get(&share_request_id);
        let is_approved = request.unwrap().is_approved();
        let is_applied = request.unwrap().is_applied.clone();

        if !is_approved {
            return Err("You can't apply a request before approving it from all the share holder".to_string());
        };

        if is_applied {
            return Err("This request was already applied, You can't apply a request twice.".to_string());
        };

        let mut updated = self.clone();

        // ------------ set share.confirmed = true for all the req.shares ------------ \\
        let req = updated.shares_requests.get(&share_request_id).unwrap().clone();
        updated.shares = req.shares.clone().into_iter()
            .map(|mut s| {
                s.confirmed = true;
                s
            })
            .collect();

        //------------ set is_applied= true of  shares_request with id of share_request_id ------------\\
        updated.shares_requests = updated.shares_requests.into_iter()
            .map(|(id, mut s)| {
                if s.id == share_request_id {
                    s.is_applied = true;
                }
                (id, s)
            })
            .collect();

        let res = updated.save();
        if res.is_err() {
            return Err(res.err().unwrap());
        }

        // ----------- Notify everyone in the contract except the caller ------------ \\
        let original_share = self.shares.clone();
        let new_shares = request.unwrap().shares.clone();
        let mut receivers = new_shares.clone().into_iter().map(|s| s.receiver).collect::<Vec<Principal>>();
        // add all the receiver from original_share that does not already exits in receivers
        for s in original_share.clone() {
            if !receivers.contains(&s.receiver) {
                receivers.push(s.receiver);
            }
        };
        let note_content = NoteContent::ShareRequestApplied(self.clone());
        for receiver in receivers {
            if receiver != caller() {
                let new_notification = Notification::new(receiver, note_content.clone());
                new_notification.save();
            }
        }

        Ok(request.unwrap().clone())
    }


    pub fn approve_request(&mut self, author: Principal, share_request_id: ShareRequestId) -> Result<(), String> {
        let request = self.shares_requests.get(&share_request_id);
        if let Some(request) = request {
            if request.approvals.contains(&caller()) {
                return Err("You have already approved this request".to_string());
            };
        }


        CONTRACTS_STORE.with(|contracts_store| {
            let mut caller_contracts = contracts_store.borrow_mut();
            let caller_contract = caller_contracts
                .entry(author)
                .or_insert_with(HashMap::new);

            let contract = caller_contract
                .get_mut(&self.clone().contract_id)
                .ok_or("Contract not found")?;

            if let StoredContract::SharesContract(existing_share) = contract {
                let mut update_share = existing_share.clone();
                // giving that shares_requests: HashMap<ShareRequestId, ShareRequest>, get shares_requests with id share_request_id
                return if let Some(share_request) = update_share.shares_requests.get_mut(&share_request_id) {
                    update_share.shares_requests.get_mut(&share_request_id).unwrap().approvals.push(caller());
                    *existing_share = update_share.clone();

                    // ----------- Notify everyone in the contract except the caller ------------ \\
                    let original_share = self.shares.clone();
                    let new_shares = request.unwrap().shares.clone();
                    let mut receivers = new_shares.clone().into_iter().map(|s| s.receiver).collect::<Vec<Principal>>();
                    // add all the receiver from original_share that does not already exits in receivers
                    for s in original_share.clone() {
                        if !receivers.contains(&s.receiver) {
                            receivers.push(s.receiver);
                        }
                    };
                    let note_content = NoteContent::ShareRequestApproved(self.clone());
                    for receiver in receivers {
                        if receiver != caller() {
                            let new_notification = Notification::new(receiver, note_content.clone());
                            new_notification.save();
                        }
                    }

                    Ok(())
                } else {
                    Err("Share request not found".to_string())
                };
            } else {
                Err("Invalid contract type".to_string())
            }
        })
    }


    pub fn pay(&mut self, amount: u64) -> Result<(), String> {
        let author: Principal = self.author.parse().unwrap();
        CONTRACTS_STORE.with(|contracts_store| {
            let mut caller_contracts = contracts_store.borrow_mut();
            let caller_contract = caller_contracts
                .entry(author)
                .or_insert_with(HashMap::new);


            // let all_receiver : Vec<Principal> = self.shares.iter().map(|s| s.receiver.clone()).collect();
            // if !all_receiver.contains(&caller()) {
            //     return Err("You can't pay for your own contract".to_string());
            // };


            // 1. update payments
            let new_payment = SharePayment {
                sender: caller(),
                amount: amount.clone(),
            };
            self.payments.push(new_payment);

            // 2. update accumulations iter throught self.shares and update self
            for share in self.shares.iter_mut() {
                share.accumulation += share.share.clone() * amount.clone() / 100;
            }

            let contract = caller_contract
                .entry(self.clone().contract_id)
                .or_insert_with(|| StoredContract::SharesContract(self.clone()));

            // save changes
            if let StoredContract::SharesContract(existing_share) = contract {
                *existing_share = self.clone();
            };

            Ok(())
        })
    }

    pub fn get_payments(user: Principal) -> Vec<SharePayment> {
        let mut payments: Vec<SharePayment> = vec![];
        CONTRACTS_STORE.with(|contracts_store| {
            let caller_contracts = contracts_store.borrow();
            for (_, contracts) in caller_contracts.iter() {
                for (_, contract) in contracts.iter() {
                    if let StoredContract::SharesContract(existing_share) = contract {
                        if existing_share.author == user.to_string() {
                            for p in existing_share.payments.clone() {
                                if p.sender != user {
                                    payments.push(p);
                                }
                            }
                        }
                    }
                }
            }
        });
        return payments;
    }
}

