use std::collections::HashMap;

use serde::Serialize;

use ic_cdk::caller;
use candid::{CandidType, Deserialize};
use candid::Principal;

use crate::{CONTRACTS_STORE, ExchangeType, SharesContract, StoredContract, Wallet};
use crate::contracts::custom_contract::cell_permision;
use crate::contracts::PaymentContract;

use crate::storage_schema::ContractId;
use crate::tables::{ColumnTypes, Execute, Filter, Formula, PermissionType, Trigger};


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
}

#[derive(PartialOrd, PartialEq, Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct CPayment {
    pub id: String,
    pub amount: f64,
    pub sender: Principal,
    pub receiver: Principal,
    pub date_created: f64,
    pub date_released: f64,
    // pub date_updated: f64,
    pub released: bool,
    // Note if released == false then it is a promise not a payment
    // Note if conformed == true then the receiver is claiming the promos
    // Note if conformed == true the the promos should be protected and updatable.
}

impl CPayment {
    pub fn pay(mut self) -> Self {
        let mut sender_wallet = Wallet::get(self.sender.clone());
        let mut receiver_wallet = Wallet::get(self.receiver.clone());
        let withdraw = ExchangeType::LocalSend;
        let deposit = ExchangeType::LocalSend;
        sender_wallet.withdraw(self.amount.clone(), self.receiver.clone().to_string(), withdraw).expect("TODO: panic message");
        sender_wallet.remove_debt(self.id.clone()).expect("TODO: remove_debt panic message");
        receiver_wallet.deposit(self.amount, self.sender.clone().to_string(), deposit).expect("TODO: pay deposit panic message");
        self.released = true;
        return self.clone();
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
    pub formulas: Vec<Formula>,
}

impl CColumn {
    pub fn can_update(&self) -> bool {
        self.permissions.contains(&PermissionType::Edit(caller())) || self.permissions.contains(&PermissionType::AnyOneEdite)
    }
}


impl CustomContract {
    pub fn exec(&self, formula: Formula, target_column: CColumn) {
        match formula.execute {
            Execute::TransferToken => {
                // let transfer_token = TransferToken {
                //     from: self.creator,
                //     to: formula.trigger_target,
                //     amount: 1,
                // };
            }
            Execute::TransferUsdt(c_payment) => {
                // handle CPayment
                let target_contract = self.get_contract_of_column(formula.trigger_target).unwrap();
                for row in target_contract.rows.clone() {
                    let cell = row.cells.iter().find(|cell| cell.field == target_column.field).unwrap();
                    // let payment_contract = PaymentContract::new(payment.clone());
                    // payment_contract.transfer_usdt(cell.value.parse::<f64>().unwrap());
                }
                // let payment_contract = PaymentContract::new(payment);
                // payment_contract.transfer_usdt();
            }
            Execute::TransferNft => {
                // let transfer_token = TransferToken {
                //     from: self.creator,
                //     to: formula.trigger_target,
                //     amount: 1,
                // };
            }
        }
    }

    pub fn execute_formula(&mut self) {
        for formula in self.formulas.clone() {
            // let column_id: String = formula.trigger_target.clone();
            // let trigger: Trigger = formula.trigger.clone();
            // let trigger_target: String = formula.trigger_target.clone();
            // let operation: Operation = formula.operation.clone();
            let execute: Execute = formula.execute.clone();
            if let Execute::TransferUsdt(c_payment) = execute {
                let c_payment = c_payment.pay();
                self.payments.retain(|payment| payment.id != c_payment.id);
                self.payments.push(c_payment);
                self.clone().save().expect("TODO: panic message");
            }
        }
    }

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
    pub fn save(mut self) -> Result<Self, String> {
        if let Some(old_contract) = Self::get(self.id.clone()) {
            self.date_created = old_contract.date_created;
            self.date_updated = ic_cdk::api::time() as f64;
            self.creator = old_contract.creator;
            self.payments = old_contract.clone().update_payments(self.payments.clone());
            self.contracts = self.contracts.iter().map(|contract| cell_permision::check_cells_update_permissions(contract.clone(), old_contract.clone())).collect();
            self.contracts = self.contracts.iter().map(|contract| cell_permision::check_cells_add_delete_permissions(contract.clone(), old_contract.clone())).collect();
        }
        for payment in self.payments.clone() {
            // let receiver_wallet = Wallet::get(payment.reciver.clone());
            let sender_wallet = Wallet::get(payment.sender.clone());
            sender_wallet.add_debt(payment.amount.clone(), payment.id.clone())?;
        }
        CONTRACTS_STORE.with(|contracts_store| {
            let mut caller_contracts = contracts_store.borrow_mut();
            let caller_contracts_map = caller_contracts.entry(caller()).or_insert_with(HashMap::new);
            caller_contracts_map.insert(self.id.clone(), StoredContract::CustomContract(self.clone()));
        });
        // self.execute_formula();
        Ok(self)
    }

    pub fn update_payments(mut self, payment: Vec<CPayment>) -> Vec<CPayment> {
        payment.iter().map(|payment| {
            let old_payment = self.payments.iter().find(|old_payment| old_payment.date_created == payment.date_created).unwrap();
            if old_payment.released {
                old_payment.clone()
            } else {
                payment.clone()
            }
        }).collect()
    }
}