use std::collections::HashMap;
use std::fs::File;

use candid::candid_method;
use ic_cdk::caller;
use ic_cdk_macros::update;

use crate::files::FileNode;
use crate::files_content::{ContentData, ContentNode};
use crate::storage_schema::{ContentId, ContentTree, ContractId};
use crate::tables::{Column, ColumnTypes, Table};
use crate::user::{RegisterUser, User};
use crate::{Share, SharesContract, USER_FILES};


#[update]
#[candid_method(update)]
fn create_share_contract(shares: Vec<Share>) -> Result<String, String> {
    let new_share_contract = SharesContract::new(shares);
    Ok("Payment not found in contract".to_string())
    // Err("Payment not found in contract".to_string())
}


#[update]
#[candid_method(update)]
fn update_shares(shares: Vec<Share>, contract_id: ContractId) -> Result<String, String> {
    let mut share_contract = SharesContract::get(contract_id)?;
    for share in shares {
        share_contract.update(share).expect("TODO: panic message");
    }

    Ok("Share updated.".to_string())
}


#[update]
#[candid_method(update)]
fn pay(contract_id: ContractId, amount: u64) -> Result<(), String> {
    let mut contract = SharesContract::get(contract_id)?;
    contract.pay(amount)
}

#[update]
#[candid_method(update)]
fn conform(contract_id: ContractId) -> Result<(), String> {
    let mut contract = SharesContract::get(contract_id)?;
    contract.conform()
}
