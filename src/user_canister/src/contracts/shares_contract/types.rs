use candid::Principal;
use ic_cdk::{api::call::ManualReply, caller, export::{
    candid::{CandidType, Deserialize},
}};

use crate::storage_schema::ContractId;

#[derive(PartialEq, Eq, PartialOrd, Clone, Debug, CandidType, Deserialize)]
pub struct Share {
    pub(crate) contract_id: ContractId,
    pub(crate) receiver: Principal,
    pub(crate) share: u64,
}


