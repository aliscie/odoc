use std::collections::HashMap;


use candid::{CandidType, Deserialize, Principal};
use ic_cdk::{caller};
use serde::Serialize;

use crate::{CONTRACTS_STORE, CustomContract, SharesContract};
use crate::contracts::PaymentContract;

use crate::storage_schema::ContractId;


#[derive(Eq, PartialOrd, PartialEq, Clone, Debug, CandidType, Serialize, Deserialize)]
pub enum Contract {
    PaymentContract(ContractId),
    SharesContract(ContractId),
    // CustomContract(Table),
}

#[derive(PartialEq, Clone, Debug, CandidType, Deserialize)]
pub enum StoredContract {

    PaymentContract(PaymentContract),
    SharesContract(SharesContract),
    CustomContract(CustomContract),
}

impl Contract {
    pub fn get_all_contracts() -> Option<HashMap<ContractId, StoredContract>> {
        CONTRACTS_STORE.with(|contracts_store| {
            let caller_contracts = contracts_store.borrow();
            let caller_contracts_map = caller_contracts.get(&caller())?;
            Some(caller_contracts_map.clone())
        })
    }

    pub fn get_contract(author: Principal, contract_id: String) -> Option<StoredContract> {
        CONTRACTS_STORE.with(|contracts_store| {
            let caller_contracts = contracts_store.borrow();
            let caller_contracts_map = caller_contracts.get(&author)?;
            let contract = caller_contracts_map.get(&contract_id)?;
            Some(contract.clone())
        })
    }
}
