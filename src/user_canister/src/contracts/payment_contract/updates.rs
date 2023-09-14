use std::collections::HashMap;
use std::fs::File;
use std::sync::atomic::Ordering;

use candid::{candid_method, Principal};
use ic_cdk::caller;
use ic_cdk_macros::update;
use serde::__private::de::Content;

use crate::{CONTRACTS_STORE, ExchangeType, FILE_CONTENTS, StoredContract, USER_FILES, Wallet};
use crate::contracts::{Contract, PaymentContract};
use crate::files::{COUNTER, FileNode};
use crate::files_content::{ContentData, ContentNode};
use crate::storage_schema::{ContentId, ContentTree, ContractId, FileId};
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

    let payment1 = PaymentContract::new(user.clone(), user.clone(), 100);
    let payment2 = PaymentContract::new(user.clone(), user.clone(), 200);
    let payment3 = PaymentContract::new(user.clone(), user.clone(), 150);
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
fn cancel_payment(id: ContentId) -> Result<(), String> {
    let payment = PaymentContract::get(id.clone())?;
    PaymentContract::cancel_payment(payment.receiver, id.clone())?;
    PaymentContract::cancel_payment(payment.sender, id.clone())

    // if payment.confirmed {
    //TODO reduce the trust score
    // }
}


#[update]
#[candid_method(update)]
fn release_payment(id: ContentId) -> Result<(), String> {
    let payment = PaymentContract::get(id.clone())?;
    let mut message = "".to_string();
    if payment.receiver.to_string() == "2vxsx-fae" {
        message.push_str("Payment is have no receiver. ");
    }
    if payment.amount == 0 {
        message.push_str("Payment amount is 0. ");
    }
    if message != "" {
        return Err(message);
    }

    let payment = PaymentContract::release_payment(id.clone())?;

    let mut receiver_wallet = Wallet::get(payment.receiver.clone());
    let mut sender_wallet = Wallet::get(caller());
    receiver_wallet.deposit(payment.amount, caller().to_string(), ExchangeType::LocalReceive)?;
    sender_wallet.withdraw(payment.amount, payment.receiver.to_string(), ExchangeType::LocalSend)?;

    // if payment.confirmed {
    //TODO increase the trust score
    // }


    Ok(())
}

#[update]
#[candid_method(update)]
fn delete_payment(id: String) -> Result<(), String> {
    PaymentContract::delete_for_both(id)
}

#[update]
#[candid_method(update)]
fn accept_payment(id: ContentId) -> Result<(), String> {
    let payment = PaymentContract::get(id.clone())?;
    PaymentContract::accept_payment(payment.receiver, id.clone())?;
    PaymentContract::accept_payment(payment.sender, id.clone())
}
