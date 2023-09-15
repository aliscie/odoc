use std::collections::HashMap;
use std::fs::File;

use candid::candid_method;
use ic_cdk::caller;
use ic_cdk_macros::update;

use crate::files::FileNode;
use crate::files_content::{ContentData, ContentNode};
use crate::storage_schema::{ContentId, ContentTree, ContractId, ShareContractId};
use crate::tables::{Column, ColumnTypes, Table};
use crate::user::{RegisterUser, User};
use crate::{ExchangeType, Share, ShareRequest, SharesContract, USER_FILES, Wallet};


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
    let mut wallet = Wallet::get(caller());

    wallet.withdraw(amount, "".to_string(), ExchangeType::LocalSend)?;

    let mut share_contract = contract.pay(amount)?;

    for existing_share in share_contract.shares.iter_mut() {
        let share_value = amount * existing_share.share;
        let mut wallet = Wallet::get(existing_share.receiver);
        wallet.deposit(share_value, "".to_string(), ExchangeType::LocalReceive)?;
        existing_share.accumulation += share_value;
    }
    Ok(())
}

#[update]
#[candid_method(update)]
fn conform(share_contract_id: ShareContractId, contract_id: ContractId) -> Result<(), String> {
    let mut contract = SharesContract::get(contract_id)?;
    contract.conform(share_contract_id)
}


#[update]
#[candid_method(update)]
fn request_share_change(shares_requests: Vec<ShareRequest>, contract_id: ContractId) -> Result<(), String> {
    let mut contract = SharesContract::get(contract_id)?;
    for share_request in shares_requests {
        let request = Share {
            share_contract_id: share_request.share_contract_id,
            receiver: share_request.receiver,
            share: share_request.share,
            conformed: false,
            accumulation: 0,
            contractor: Some(caller()),
        };
        contract.request(request).expect("Error at adding share_request");
    };
    Ok(())
}


#[update]
#[candid_method(update)]
fn approve_request(share_requests_id: Vec<ShareContractId>, contract_id: ContractId) -> Result<(), String> {
    let mut contract = SharesContract::get(contract_id)?;
    for request in share_requests_id {
        contract.approve_request(request).expect("Err at approve_request.");
    }
    Ok(())
}
