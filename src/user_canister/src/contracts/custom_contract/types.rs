use std::collections::HashMap;

use candid::{CandidType, Deserialize};
use candid::Principal;
use ic_cdk::{call, caller};
use serde::Serialize;

use crate::{CONTRACTS_STORE, ExchangeType, SharesContract, StoredContract, Wallet};
use crate::contracts::custom_contract::cell_permision;
use crate::contracts::custom_contract::utils::{notify_about_promise, notify_custom_contract};
use crate::storage_schema::ContractId;
use crate::tables::{ColumnTypes, Execute, Filter, Formula, PermissionType};
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
    pub column_type: ColumnTypes,
    pub formula_string: String,
    pub filters: Vec<Filter>,
    pub permissions: Vec<PermissionType>,
}


#[derive(Eq, PartialOrd, PartialEq, Clone, Debug, CandidType, Deserialize, Serialize)]
pub(crate) struct CCell {
    pub value: String,
    pub field: String,
    pub id: String,
}


#[derive(Eq, PartialOrd, PartialEq, Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct CRow {
    pub cells: Vec<CCell>,
    pub id: String,
}


#[derive(PartialOrd, PartialEq, Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct CContract {
    pub id: String,
    pub name: String,
    pub columns: Vec<CColumn>,
    pub rows: Vec<CRow>,
    // pub rows: Vec<HashMap<String, String>>
}

#[derive(PartialOrd, PartialEq, Clone, Debug, CandidType, Deserialize, Serialize)]
pub enum PaymentStatus {
    Canceled,
    Released,
    Confirmed,
    ConfirmedCancellation,
    RequestCancellation,
    HeighConformed,
    ApproveHeighConformed,
    // when ApproveHeighConformed the user can't withdraw the payment at all
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
    pub fn pay(mut self) -> Result<Self, String> {
        let mut sender_wallet = Wallet::get(self.sender.clone());
        if self.amount > sender_wallet.balance {
            return Err(String::from("Insufficient balance"));
        }
        let mut receiver_wallet = Wallet::get(self.receiver.clone());
        let withdraw = ExchangeType::LocalSend;
        let deposit = ExchangeType::LocalSend;
        sender_wallet.withdraw(self.amount.clone(), self.receiver.clone().to_string(), withdraw)?;
        sender_wallet.remove_dept(self.id.clone())?;
        receiver_wallet.deposit(self.amount, self.sender.clone().to_string(), deposit)?;
        self.status = PaymentStatus::Released;

        // ---------------- handle notifications ----------------\\
        UserHistory::get(self.sender.clone()).release_payment(self.id.clone());

        let content = NoteContent::CPaymentContract(self.clone(), PaymentAction::Released);
        let new_notification = Notification {
            id: self.id.clone(),
            sender: caller(),
            receiver: self.receiver.clone(),
            content,
            is_seen: false,
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

    pub fn get_c_contract(&self, id: &str) -> Option<CContract> {
        self.contracts.iter().find(|contract| contract.id == id).map(|contract| contract.clone())
    }
    pub fn get_cell_value(&self, id: &str) -> Option<CCell> {
        for contract in self.contracts.clone() {
            for row in contract.rows {
                for cell in row.cells {
                    if cell.id == id {
                        return Some(cell);
                    }
                }
            }
        }
        None
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

    pub fn get(id: String) -> Option<Self> {
        CONTRACTS_STORE.with(|contracts_store| {
            let caller_contracts = contracts_store.borrow();
            let caller_contracts_map = caller_contracts.get(&caller())?;
            let contract = caller_contracts_map.get(&id)?;
            match contract {
                StoredContract::CustomContract(contract) => Some(contract.clone()),
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
        if let Some(old_contract) = Self::get(self.id.clone()) {
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


    pub fn save(mut self) -> Result<Self, String> {
        if let Some(old_contract) = Self::get(self.id.clone()) {
            self.date_created = old_contract.date_created;
            self.date_updated = ic_cdk::api::time() as f64;
            self.creator = old_contract.creator;
            // self.payments = old_contract.clone().update_payments(self.payments.clone());
            self.payments = old_contract.payments.clone();

            self.contracts = self.contracts.iter().map(|contract| cell_permision::check_cells_update_permissions(contract.clone(), old_contract.clone())).collect();
            self.contracts = self.contracts.iter().map(|contract| cell_permision::check_cells_add_delete_permissions(contract.clone(), old_contract.clone())).collect();


            // rerun odl promos if payment.status == PaymentStatus::Canceled. else promise
            self.promises = self.promises.iter_mut().map(|promise| {
                if let Some(old_promise) = old_contract.promises.iter().find(|p| p.id == promise.id) {
                    promise.contract_id = self.id.clone();
                    if promise.status == PaymentStatus::Canceled && old_promise.status == PaymentStatus::Confirmed {
                        let text: String = "You can't cancel confirmed payment but you can request canalisation".to_string();
                        notify_custom_contract(old_promise.clone(), text);
                        old_promise.clone()
                    } else if promise.clone().status == PaymentStatus::ConfirmedCancellation && PaymentStatus::ConfirmedCancellation != old_promise.status {
                        let text: String = "Only receiver can confined cancellation".to_string();
                        notify_custom_contract(old_promise.clone(), text);
                        old_promise.clone()
                    } else {
                        promise.clone()
                    }
                } else {
                    promise.clone()
                }
            }).collect();


            // prevent delete if Confirmed
            for old_promise in old_contract.promises.clone() {
                if old_promise.status == PaymentStatus::Confirmed && !self.promises.iter().find(|p| p.id == old_promise.id).is_none() {
                    let text: String = "You can't delete confirmed payment".to_string();
                    notify_custom_contract(old_promise.clone(), text);
                    self.promises.push(old_promise.clone());
                }
            }
        }

        // ------- handle formulas security ------- \\
        for formula in self.formulas.clone() {
            let old_formula: Option<&Formula> = self.formulas.iter().find(|f| f.column_id == formula.column_id);
            if let Some(old_formula) = old_formula {
                if &formula != old_formula {
                    if let Execute::TransferUsdt(p) = formula.execute {
                        if caller() != p.sender {
                            notify_custom_contract(p, "You can't save a formula for other people as senders".to_string());
                            self.formulas.retain(|f| f.column_id != formula.column_id);
                        }
                    }
                }
            }
        }

        // ---------------- handle notifications ----------------\\
        for mut payment in self.promises.clone() {
            // let receiver_wallet = Wallet::get(payment.reciver.clone());


            let wallet = Wallet::get(payment.sender);
            if payment.status == PaymentStatus::Released && payment.sender == caller() && payment.amount <= wallet.balance {
                let payment = payment.clone().pay()?;
                self.promises.retain(|p| p.id != payment.id);
                self.payments.push(payment.clone());
            } else if wallet.total_debt > wallet.balance {
                notify_custom_contract(payment.clone(), "Incipient palace fund this promises will be ignored".to_string());
                self.promises.retain(|p| p.id != payment.id);
            } else {
                wallet.add_dept(payment.amount.clone(), payment.id.clone())?;
                // TODO remove dept when cancel +  conform cancellation
                // For now it seams fine to keep dept if not canceled
                // remove dept only when cancel
                UserHistory::get(caller()).promise_payment(payment.clone());
                payment.contract_id = self.id.clone();
                notify_about_promise(payment, PaymentAction::Promise);
            }
        }

        self.execute_formulas();
        CONTRACTS_STORE.with(|contracts_store| {
            let mut caller_contracts = contracts_store.borrow_mut();
            let caller_contracts_map = caller_contracts.entry(caller()).or_insert_with(HashMap::new);
            caller_contracts_map.insert(self.id.clone(), StoredContract::CustomContract(self.clone()));
        });

        Ok(self)
    }
}