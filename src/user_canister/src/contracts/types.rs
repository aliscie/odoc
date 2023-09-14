use std::collections::HashMap;
use std::sync::atomic::Ordering;

use ic_cdk::{api::call::ManualReply, caller, export::{
    candid::{CandidType, Deserialize},
    Principal,
}};

use crate::contracts::PaymentContract;
use crate::{CONTRACTS_STORE, Share, SharesContract};
use crate::files::COUNTER;
use crate::storage_schema::ContractId;
use crate::tables::Table;
use crate::user::User;

#[derive(Eq, PartialOrd, PartialEq, Clone, Debug, CandidType, Deserialize)]
pub enum Contract {
    PaymentContract(ContractId),
    SharesContract(ContractId),
    // CustomContract(Table),
}

#[derive(Eq, PartialOrd, PartialEq, Clone, Debug, CandidType, Deserialize)]
pub enum StoredContract {
    PaymentContract(PaymentContract),
    SharesContract(SharesContract),
    // CustomContract(Table),
}

impl Contract {
    pub fn get_all_contracts() -> Option<HashMap<ContractId, StoredContract>> {
        CONTRACTS_STORE.with(|contracts_store| {
            let caller_contracts = contracts_store.borrow();
            let caller_contracts_map = caller_contracts.get(&caller())?;
            Some(caller_contracts_map.clone())
        })
    }
}
