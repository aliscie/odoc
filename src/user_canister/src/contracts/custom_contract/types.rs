use std::collections::HashMap;

use serde::Serialize;

use ic_cdk::caller;
use candid::{CandidType, Deserialize};
use candid::Principal;

use crate::{CONTRACTS_STORE, SharesContract, StoredContract};
use crate::contracts::custom_contract::cell_permision;
use crate::contracts::PaymentContract;

use crate::storage_schema::ContractId;
use crate::tables::{ColumnTypes, Filter, Formula, PermissionType};


#[derive(PartialOrd, PartialEq, Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct CColumn {
    pub id: String,
    pub editable: bool,
    pub field: String,
    pub headerName: String,
    pub deletable: bool,
    pub column_type: ColumnTypes,
    pub formula: Option<Formula>,
    pub data_validator: Option<String>,
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
    pub amount: f64,
    pub sender: Principal,
    pub date_created: f64,
    pub released: bool,
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
}

impl CColumn {
    pub fn can_update(&self) -> bool {
        self.permissions.contains(&PermissionType::Edit(caller())) || self.permissions.contains(&PermissionType::AnyOneEdite)
    }
}


impl CustomContract {
    pub fn can_update_cell(&self, cell: &CCell) -> bool {
        if let Some(column) = self.get_column(cell.field.clone()) {
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
    pub fn get_column(&self, field: String) -> Option<CColumn> {
        let mut columns = vec![];
        for contract in self.contracts.clone() {
            columns.extend(contract.columns);
        }
        columns.iter().find(|column| column.field == field).map(|column| column.clone())
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
        CONTRACTS_STORE.with(|contracts_store| {
            let mut caller_contracts = contracts_store.borrow_mut();
            let caller_contracts_map = caller_contracts.entry(caller()).or_insert_with(HashMap::new);
            caller_contracts_map.insert(self.id.clone(), StoredContract::CustomContract(self.clone()));
        });
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