use std::collections::HashMap;
use std::fs::File;
use std::sync::atomic::Ordering;

use candid::{candid_method, Principal};
use ic_cdk::caller;
use ic_cdk_macros::update;
use serde::__private::de::Content;

use crate::{CONTRACTS_STORE, FILE_CONTENTS, USER_FILES};
use crate::contracts::{Contract, Payment};
use crate::files::{COUNTER, FileNode};
use crate::files_content::{ContentData, ContentNode};
use crate::storage_schema::{ContentTree, ContractId};
use crate::tables::{Column, ColumnTypes, Row, Table};
use crate::tables;
use crate::user::{RegisterUser, User};

#[update]
#[candid_method(update)]
fn create_payment_contract(file_name: String) -> Result<(), String> {
    // fn create_payment_contract(file_name: String) -> Result<(FileNode, ContentNode, Contract), String> {
    let user = User::user_profile();
    if user.is_none() {
        return Err("User not registered".to_string());
    }
    let user: Principal = user.unwrap().id.parse().unwrap();

    let payment1 = Payment::new(user.clone(), user.clone(), 100);
    let payment2 = Payment::new(user.clone(), user.clone(), 200);
    let payment3 = Payment::new(user.clone(), user.clone(), 150);
    let row1 = Row::Contract(Contract::PaymentContract(payment1.get_contract_id()));
    let row2 = Row::Contract(Contract::PaymentContract(payment2.get_contract_id()));
    let row3 = Row::Contract(Contract::PaymentContract(payment3.get_contract_id()));
    let mut table = Table::new();
    table.rows = vec![row1, row2, row3];

    let file_node = FileNode::new(file_name, None);
    let content_node = ContentNode::new(file_node.clone().id, None, "payment_contract".to_string(), "".to_string(), None);
    let table_content = ContentNode::new(
        file_node.clone().id,
        Some(content_node.clone().unwrap().id),
        "".to_string(),
        "".to_string(),
        Some(ContentData::Table(table)));
    let content = ContentNode::new(file_node.id, Some(table_content.clone().unwrap().id), "".to_string(), "".to_string(), None);
    // Ok((file_node, content_node.unwrap(), contract))
    Ok(())
}

