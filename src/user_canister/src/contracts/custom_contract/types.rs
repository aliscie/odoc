use std::collections::HashMap;

use candid::{CandidType, Deserialize};
use candid::Principal;
use ic_cdk::{call, caller};
use serde::Serialize;

use crate::{CONTRACTS_STORE, ExchangeType, StoredContract, Wallet};
use crate::contracts::custom_contract::utils::{notify_about_promise};
use crate::storage_schema::ContractId;
use crate::tables::{ContractPermissionType, Execute, Filter, Formula, PermissionType};
use crate::user_history::UserHistory;
use crate::websocket::{NoteContent, Notification, PaymentAction};

// make me a function of list of days


#[derive(PartialOrd, PartialEq, Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct CColumn {
    pub id: String,
    pub editable: bool,
    pub field: String,
    pub headerName: String,
    pub deletable: bool,
    pub column_type: String,
    pub formula_string: String,
    pub filters: Vec<Filter>,
    pub permissions: Vec<PermissionType>,
}


#[derive(Eq, PartialOrd, PartialEq, Clone, Debug, CandidType, Deserialize, Serialize)]
pub(crate) struct CCell {
    pub value: String,
    pub field: String,
}


#[derive(Eq, PartialOrd, PartialEq, Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct CRow {
    pub cells: Vec<CCell>,
    pub id: String,
}


#[derive(PartialOrd, PartialEq, Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct ContractError {
    pub message: String,
    // pub payment: CPayment,
}


#[derive(PartialOrd, PartialEq, Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct CContract {
    pub id: String,
    pub name: String,
    pub columns: Vec<CColumn>,
    pub rows: Vec<CRow>,
    pub creator: Principal,
    pub date_created: f64,
    // pub rows: Vec<HashMap<String, String>>
}

#[derive(PartialOrd, PartialEq, Clone, Debug, CandidType, Deserialize, Serialize)]
pub enum PaymentStatus {
    Released,
    Confirmed,
    ConfirmedCancellation,
    RequestCancellation,
    HighPromise,
    ApproveHighPromise,
    // when ApproveHighPromise the user can't withdraw the payment at all
    Objected(String),
    None,
}

#[derive(PartialOrd, PartialEq, Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct CPayment {
    pub contract_id: ContractId,
    pub id: String,
    pub amount: f64,
    pub sender: Principal,
    pub receiver: Principal,
    pub date_created: f64,
    pub date_released: f64,
    // pub date_updated: f64,
    pub status: PaymentStatus,
    // Note if released == false then it is a promise not a payment
    // Note if conformed == true then the receiver is claiming the promos
    // Note if conformed == true the the promos should be protected and updatable.
}

impl CPayment {
    pub fn default() -> Self {
        Self {
            contract_id: ContractId::default(),
            id: "".to_string(),
            amount: 0.0,
            sender: Principal::anonymous(),
            receiver: Principal::anonymous(),
            date_created: 0.0,
            date_released: 0.0,
            status: PaymentStatus::None,
        }
    }
    pub fn pay(mut self) -> Result<Self, String> {
        let mut sender_wallet = Wallet::get(self.sender.clone());
        if self.amount > sender_wallet.balance {
            return Err(String::from("Insufficient balance"));
        }
        if self.sender == self.receiver {
            return Err(String::from("You can't send to your self"));
        };

        let mut receiver_wallet = Wallet::get(self.receiver.clone());
        let withdraw = ExchangeType::LocalSend;
        let deposit = ExchangeType::LocalSend;
        sender_wallet.withdraw(self.amount.clone(), self.receiver.clone().to_string(), withdraw)?;
        let _ = sender_wallet.remove_dept(self.id.clone());
        receiver_wallet.deposit(self.amount, self.sender.clone().to_string(), deposit)?;

        // ----------------- UserHistory ----------------- \\
        let mut user_history = UserHistory::get(self.sender.clone());
        user_history.payment_action(self.clone());
        user_history.save();

        // TODO think about this later again, maybey other people should not be effect by others actions
        //  see how people respond to this
        //  Alos, we are already storing the same payment object in notifications for this users, so this can be stipulation issue in our DS
        let mut user_history = UserHistory::get(self.receiver.clone());
        user_history.payment_action(self.clone());
        user_history.save();
        // ---------------------------------------------------

        self.status = PaymentStatus::Released;

        // ---------------- handle notifications ----------------\\
        UserHistory::get(self.sender.clone()).payment_action(self.clone());

        let content = NoteContent::CPaymentContract(self.clone(), PaymentAction::Released);
        let new_notification = Notification {
            id: self.id.clone(),
            sender: caller(),
            receiver: self.receiver.clone(),
            content,
            is_seen: false,
            time: ic_cdk::api::time() as f64,
        };
        new_notification.save();

        Ok(self.clone())
    }
}


#[derive(PartialOrd, PartialEq, Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct CustomContract {
    pub id: String,
    pub name: String,
    pub creator: Principal,
    pub date_created: f64,
    pub date_updated: f64,
    pub contracts: Vec<CContract>,
    pub payments: Vec<CPayment>,
    pub promises: Vec<CPayment>,
    pub formulas: Vec<Formula>,
    pub permissions: Vec<ContractPermissionType>,
}

impl CColumn {
    pub fn can_update(&self) -> bool {
        self.permissions.contains(&PermissionType::Edit(caller())) || self.permissions.contains(&PermissionType::AnyOneEdite)
    }
}


impl CustomContract {
    // pub fn exec(&self, formula: Formula, target_column: CColumn) {
    //     match formula.execute {
    //         Execute::TransferToken => {
    //             // let transfer_token = TransferToken {
    //             //     from: self.creator,
    //             //     to: formula.trigger_target,
    //             //     amount: 1,
    //             // };
    //         }
    //         Execute::TransferUsdt(c_payment) => {
    //             // handle CPayment
    //             let target_contract = self.get_contract_of_column(formula.trigger_target).unwrap();
    //             for row in target_contract.rows.clone() {
    //                 let cell = row.cells.iter().find(|cell| cell.field == target_column.field).unwrap();
    //                 // let payment_contract = PaymentContract::new(payment.clone());
    //                 // payment_contract.transfer_usdt(cell.value.parse::<f64>().unwrap());
    //             }
    //             // let payment_contract = PaymentContract::new(payment);
    //             // payment_contract.transfer_usdt();
    //         }
    //         Execute::TransferNft => {
    //             // let transfer_token = TransferToken {
    //             //     from: self.creator,
    //             //     to: formula.trigger_target,
    //             //     amount: 1,
    //             // };
    //         }
    //     }
    // }

    pub fn execute_formulas(&mut self) -> Result<Self, String> {
        for formula in self.formulas.clone() {
            // let column_id: String = formula.trigger_target.clone();
            // let trigger: Trigger = formula.trigger.clone();
            // let trigger_target: String = formula.trigger_target.clone();
            // let operation: Operation = formula.operation.clone();

            // on save formula sender == caller()
            // on exec formula no need to check caller().
            let execute: Execute = formula.execute.clone();
            if let Execute::TransferUsdt(c_payment) = execute {
                c_payment.pay()?;
                // self.release_payment(c_payment)?
            }
        }
        self.formulas = vec![];
        Ok(self.clone())
    }

    // pub fn release_payment(&mut self, c_payment: CPayment) -> Result<(), String> {
    //     if self.promises.contains(&c_payment) && caller() == c_payment.sender {
    //         let c_payment = c_payment.clone().pay()?;
    //         self.promises.retain(|payment| payment.id != c_payment.id);
    //         self.payments.push(c_payment);
    //         self.clone().save()?;
    //         Ok(())
    //     } else {
    //         Err("Payment not found".to_string())
    //     }
    // }

    pub fn can_update_cell(&self, cell: &CCell) -> bool {
        if let Some(column) = self.get_column(&cell.field.clone()) {
            column.can_update()
        } else {
            true
        }
    }

    pub fn get_c_contract(&self, contract_id: &str) -> Option<CContract> {
        self.contracts.iter().find(|contract| contract.id == contract_id).map(|contract| contract.clone())
    }

    pub fn get_columns(&self) -> Vec<CColumn> {
        let mut columns = vec![];
        for contract in self.contracts.clone() {
            columns.extend(contract.columns);
        }
        columns
    }

    pub fn get_contract_of_column(&self, field: String) -> Option<CContract> {
        for contract in self.contracts.clone() {
            let column = contract.columns.iter().find(|column| column.field == field).map(|column| column.clone());
            if let Some(column) = column {
                return Some(contract.clone());
            }
        }

        None
    }

    pub fn get_column(&self, field: &String) -> Option<CColumn> {
        let mut columns = vec![];
        for contract in self.contracts.clone() {
            columns.extend(contract.columns);
        }
        columns.iter().find(|column| &column.field == field).map(|column| column.clone())
    }

    pub fn get(id: &String, creator: &Principal) -> Option<Self> {
        CONTRACTS_STORE.with(|contracts_store| {
            let caller_contracts = contracts_store.borrow();
            let caller_contracts_map = caller_contracts.get(creator)?;
            let contract = caller_contracts_map.get(id)?;
            match contract {
                StoredContract::CustomContract(contract) => Some(contract.clone()), // Change here
                _ => None
            }
        })
    }


    pub fn get_for_user(id: String, user: Principal) -> Option<Self> {
        CONTRACTS_STORE.with(|contracts_store| {
            let caller_contracts = contracts_store.borrow();
            let caller_contracts_map = caller_contracts.get(&user)?;
            let contract = caller_contracts_map.get(&id)?;
            match contract {
                StoredContract::CustomContract(contract) => Some(contract.clone()),
                _ => None
            }
        })
    }

    pub fn delete(mut self) -> Result<(), String> {
        if caller() != self.creator {
            return Err("You can't delete other people's contract".to_string());
        }
        if let Some(old_contract) = Self::get(&self.id, &self.creator.clone()) {
            self.payments = old_contract.payments.clone();
            self.promises = old_contract.promises.clone();
            self.contracts = vec![];
        }

        for promise in self.promises.clone() {
            if promise.status == PaymentStatus::Confirmed {
                return Err("Contract with unreleased promises can't be deleted".to_string());
            }
            let wallet = Wallet::get(caller());
            let _ = wallet.remove_dept(promise.id.clone());
            self.promises.retain(|p| p.id != promise.id);
        }

        // Note no need for this anymore as the payment are stored in the Wallet.
        // if self.payments.len() > 0 {
        //     return Err("Contract with payments can't be deleted".to_string());
        // }

        CONTRACTS_STORE.with(|contracts_store| {
            let mut caller_contracts = contracts_store.borrow_mut();
            let mut caller_contracts_map = caller_contracts.get_mut(&caller()).unwrap();
            caller_contracts_map.remove(&self.id);
        });
        Ok(())
    }
    pub fn pure_save(&self) -> Result<Self, String> {
        CONTRACTS_STORE.with(|contracts_store| {
            let mut caller_contracts = contracts_store.borrow_mut();
            let caller_contracts_map = caller_contracts.entry(self.creator).or_insert_with(HashMap::new);
            caller_contracts_map.insert(self.id.clone(), StoredContract::CustomContract(self.clone()));
        });
        Ok(self.clone())
    }


    pub fn save(&mut self) -> Result<Self, Vec<ContractError>> {
        let mut contract_errors: Vec<ContractError> = vec![];
        if let Some(old_contract) = Self::get(&self.id, &self.creator) {
            self.date_created = old_contract.date_created.clone();
            self.date_updated = ic_cdk::api::time() as f64;
            // self.creator = old_contract.creator.clone(); // no need for this cuz Self::get() already check for this
            // self.payments = old_contract.clone().update_payments(self.payments.clone());
            self.payments = old_contract.payments.clone();


            let contracts: Vec<CContract> = self.contracts.iter_mut().map(|contract| {
                contract.update(&mut contract_errors, &old_contract)
            }).collect();


            // for contract in old_contract.contracts {
            //     let old_contract = self.contracts.clone().get_c_contract(&contract.id, &contract.creator);
            //     if old_contract.is_none() {
            //         // case delete contract
            //     }
            // }
            self.contracts = contracts;

            // rerun odl promos if payment.status == PaymentStatus::Canceled. else promise
            self.promises = self.promises.clone().iter().map(|promise| self.clone().update_promise(&mut contract_errors, promise.clone(), old_contract.clone())).collect();


            // prevent delete if Confirmed
            for old_promise in old_contract.promises {
                if old_promise.status == PaymentStatus::Confirmed && !self.promises.iter().any(|p| p.id == old_promise.id) {
                    let message: String = "You can't delete confirmed payment".to_string();
                    contract_errors.push(ContractError { message });
                    self.promises.push(old_promise.clone());

                    // For deleted promises
                    if !self.promises.iter().any(|p| p.id == old_promise.id.clone()) {
                        let mut user_history = UserHistory::get(caller());
                        user_history.confirm_cancellation(old_promise.clone());
                        user_history.save()
                    }
                }
            }
        } else {
            self.date_created = ic_cdk::api::time() as f64;
            self.payments = vec![];
            self.creator = caller();
        }

        // ------- handle formulas security ------- \\
        for formula in self.formulas.clone() {
            let old_formula: Option<&Formula> = self.formulas.iter().find(|f| f.column_id == formula.column_id);
            if let Some(old_formula) = old_formula {
                if &formula != old_formula {
                    if let Execute::TransferUsdt(payment) = formula.execute {
                        if caller() != payment.sender {
                            let message = "You can't save a formula for other people as senders".to_string();
                            contract_errors.push(ContractError { message });
                            self.formulas.retain(|f| f.column_id != formula.column_id);
                        }
                    }
                }
            }
        }
        //
        // // ---------------- handle promise ----------------\\
        for mut payment in self.promises.clone() {
            // let receiver_wallet = Wallet::get(payment.reciver.clone());
            let wallet = Wallet::get(payment.sender);
            if payment.status == PaymentStatus::Released && payment.sender == caller() {
                let res = payment.clone().pay();
                if let Err(message) = res {
                    contract_errors.push(ContractError { message });
                    self.promises.retain(|p| p.id != payment.id);
                } else if let Ok(payment) = res {
                    self.promises.retain(|p| p.id != payment.id);
                    self.payments.push(payment.clone());
                }
            } else {
                if let Err(message) = wallet.check_dept(payment.amount.clone()) {
                    contract_errors.push(ContractError { message });
                    self.promises.retain(|p| p.id != payment.id);
                }
                UserHistory::get(caller()).payment_action(payment.clone());
                payment.contract_id = self.id.clone();
                notify_about_promise(payment, PaymentAction::Promise);
            }
            // else if payment.status == PaymentStatus::ApproveHighPromise {
            //     if let Err(message) = wallet.add_dept(payment.amount.clone(), payment.id.clone()) {
            //         contract_errors.push(ContractError { message });
            //         self.promises.retain(|p| p.id != payment.id);
            //     } else {
            //         // TODO remove dept when cancel +  conform cancellation
            //         // For now it seams fine to keep dept if not canceled
            //         // remove dept only when cancel
            //         UserHistory::get(caller()).payment_action(payment.clone());
            //         payment.contract_id = self.id.clone();
            //         notify_about_promise(payment, PaymentAction::Promise);
            //     }
            // }
        }

        // self.execute_formulas();
        self.pure_save().expect("TODO: panic message at pure_save");
        if !contract_errors.is_empty() {
            return Err(contract_errors);
        }
        Ok(self.clone())
    }

    //  ----------------------------------------------- Promise CRUD permissions -----------------------------------------------\\
    // pub fn delete_promise_permission(
    // pub fn create_promise_permission(
    pub fn update_promise_permission(&self, mut promise: CPayment, old_promise: CPayment) -> Result<CPayment, String> {
        if old_promise.status == PaymentStatus::None || old_promise.status == PaymentStatus::ApproveHighPromise {
            return Ok(promise);
        }

        promise.amount = old_promise.amount.clone();
        promise.amount = old_promise.amount;
        promise.receiver = old_promise.receiver;


        if promise.sender == caller() && promise.status != old_promise.status {
            match promise.status {
                PaymentStatus::Confirmed => {
                    let message = "Only receiver can confirm a promise".to_string();
                    return Err(message);
                }
                PaymentStatus::ConfirmedCancellation => {
                    let message = "Only receiver can confirm a promise cancellation".to_string();
                    return Err(message);
                }
                PaymentStatus::Released => {
                    return Ok(promise);
                }
                PaymentStatus::RequestCancellation => {
                    return Ok(promise);
                }
                PaymentStatus::HighPromise => {
                    // TODO think about this
                    let message = "You can't confirm a promise".to_string();
                    return Err(message);
                }
                PaymentStatus::ApproveHighPromise => {
                    let message = "Only receiver can confirm a promise".to_string();
                    return Err(message);
                }
                PaymentStatus::Objected(_) => {
                    let message = "Only receiver can object a promise".to_string();
                    return Err(message);
                }
                PaymentStatus::None => {
                    let message = "You can't update a promise to None".to_string();
                    return Err(message);
                }
            }
        } else if promise.receiver == caller() && promise.status != old_promise.status {
            match promise.status {
                PaymentStatus::Confirmed => {
                    return Err("Only sender can confirm a promise".to_string());
                }
                PaymentStatus::ConfirmedCancellation => {
                    return Ok(promise);
                }
                PaymentStatus::Released => {
                    let message = "Only sender can release a promise".to_string();
                    return Err(message);
                }
                PaymentStatus::RequestCancellation => {
                    return Err("Only sender can request a promise cancellation, You can directly ConfirmedCancellation".to_string());
                }
                PaymentStatus::HighPromise => {
                    return Err("Only sender can confirm a promise".to_string());
                }
                PaymentStatus::ApproveHighPromise => {
                    return if old_promise.status == PaymentStatus::HighPromise {
                        Ok(promise)
                    } else {
                        Err("This contract is not meant for high conformation".to_string())
                    };
                }
                PaymentStatus::Objected(_) => {
                    return Ok(promise);
                }
                PaymentStatus::None => {
                    let message = "You can't update a promise to None".to_string();
                    return Err(message);
                }
            }
        }

        Ok(promise)
    }

    pub fn update_promise(&self, contract_errors: &mut Vec<ContractError>, mut promise: CPayment, old_contract: CustomContract) -> CPayment {
        promise.contract_id = self.id.clone();
        // --------------------------------   handle update --------------------------------  \\
        if let Some(old_promise) = old_contract.promises.iter().find(|p| p.id == promise.id) {
            let res = self.update_promise_permission(promise.clone(), old_promise.clone());
            if let Ok(updated_promise) = res {
                // Notify only when permission is denied.
                return updated_promise;
            } else if let Err(message) = res {
                contract_errors.push(ContractError { message });
                return old_promise.clone();
            }
            // accept the update
            return promise;
        }

        // --------------------------------   handle create --------------------------------  \\
        if promise.sender != caller() {
            let message = "Only you can set your self as a sender".to_string();
            contract_errors.push(ContractError { message });
            promise.sender = caller();
            promise.status = PaymentStatus::None;
        }
        // if status's request cancellation notify the receiver
        if promise.status == PaymentStatus::RequestCancellation {
            let not = Notification::get(promise.id.clone());
            if not.is_none() || not.unwrap().content != NoteContent::CPaymentContract(promise.clone(), PaymentAction::RequestCancellation(promise.clone())) {
                notify_about_promise(promise.clone(), PaymentAction::RequestCancellation(promise.clone()));
            }
        }
        promise
    }
}