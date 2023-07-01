use std::collections::HashMap;
use std::fs::File;
use std::sync::atomic::Ordering;

use candid::{candid_method, Principal};
use ic_cdk::caller;
use ic_cdk_macros::update;
use serde::__private::de::Content;

use crate::{CONTRACTS_STORE, FILE_CONTENTS, StoredContract, USER_FILES};
use crate::contracts::{Contract, Payment};
use crate::files::{COUNTER, FileNode};
use crate::files_content::{ContentData, ContentNode};
use crate::storage_schema::{ContentTree, ContractId, FileId};
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
    let mut row1 = Row::new_payment(payment1);
    let mut row2 = Row::new_payment(payment2);
    let mut row3 = Row::new_payment(payment3);
    let mut table = Table::new();
    row1.cells = Some(HashMap::from_iter(vec![("task".to_string(), "signup task".to_string())]));
    row2.cells = Some(HashMap::from_iter(vec![("task".to_string(), "login task".to_string())]));
    row3.cells = Some(HashMap::from_iter(vec![("task".to_string(), "dark mode".to_string())]));
    table.rows = vec![row1.clone(), row2.clone(), row3.clone()];
    table.columns = vec![Column::new("task".to_string(), ColumnTypes::Text)];

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

#[update]
#[candid_method(update)]
fn save_payment_contract(file_id: FileId, file_name: String, parent_file: Option<FileId>, content_tree: ContentTree, contracts: Vec<StoredContract>) -> Result<(), String> {
    let user = User::user_profile();
    if user.is_none() {
        return Err("User not registered".to_string());
    }
    let user: Principal = user.unwrap().id.parse().unwrap();
    let file = FileNode::update_or_create(file_id.clone(), file_name, parent_file);
    let content_tree = ContentNode::update_file_contents(file_id.clone(), content_tree);
    let mut message: String = "".to_string();

    for contract in contracts {
        match contract.clone() {
            StoredContract::PaymentContract(payment) => {
                let p: Result<(), String> = Payment::update_or_create(payment.clone());
                if p.is_err() {
                    let error_message: String = p.err().unwrap();
                    message.push_str(
                        format!("Payment contract with id : {} is not saved, because {}", payment.get_contract_id(), error_message).as_str()
                    );
                }
                message.push_str(format!("Payment contract with id : {} is saved", payment.get_contract_id()).as_str());
            }
            _ => {
                message.push_str("on of contract has invalid type");
            }
        }
    }
    if message.len() > 0 {
        return Err(message);
    }

    return Ok(());
}