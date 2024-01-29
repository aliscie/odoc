use std::collections::HashMap;
use std::sync::atomic::Ordering;

use candid::Principal;
use ic_cdk::caller;
use ic_cdk_macros::update;

use crate::{COUNTER, ExchangeType, PaymentContract, Wallet};
use crate::files::FileNode;
use crate::files_content::{ContentData, ContentNode};
use crate::storage_schema::ContentId;
use crate::tables::{Column, ColumnTypes, Row, Table};
use crate::user::User;
use crate::user_history::UserHistory;
use crate::websocket::{NoteContent, Notification, PaymentAction};

// #[update]
// TODO fn create_payment_contract(table, contract) -> Result<(), String> {
//  Remove this unnecessary mess

#[update]
fn cancel_payment(id: ContentId) -> Result<(), String> {
    let payment: PaymentContract = PaymentContract::get(caller(), id.clone())?;
    PaymentContract::cancel_payment(id.clone())?;
    // note no need for caller() in Canceled because it is == payment.sender
    let content: NoteContent = NoteContent::PaymentContract(payment.clone(), PaymentAction::Cancelled);
    let new_note = Notification {
        id: payment.contract_id,
        sender: caller(),
        receiver: payment.receiver,
        content,
        is_seen: false,
    };
    new_note.save();
    let mut profile = UserHistory::get(payment.sender.clone());
    profile.cancel_payment();
    Ok(())
}


#[update]
fn release_payment(id: ContentId) -> Result<(), String> {
    let payment = PaymentContract::get(caller(), id.clone())?;
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

    let payment = payment.release()?;

    let mut receiver_wallet = Wallet::get(payment.receiver.clone());
    let mut sender_wallet = Wallet::get(caller());
    receiver_wallet.deposit(payment.amount.clone() as f64, caller().to_string(), ExchangeType::LocalReceive)?;
    sender_wallet.withdraw(payment.amount.clone() as f64, payment.receiver.to_string().clone(), ExchangeType::LocalSend)?;

    let content: NoteContent = NoteContent::PaymentContract(payment.clone(), PaymentAction::Released);
    let new_note = Notification {
        id: payment.contract_id,
        sender: caller(),
        receiver: payment.receiver.clone(),
        content,
        is_seen: false,
    };
    new_note.save();
    UserHistory::get(payment.sender).release_payment();
    Ok(())
}

#[update]
fn delete_payment(id: String) -> Result<(), String> {
    let payment = PaymentContract::get(caller(), id.clone())?;
    payment.delete()?;
    Ok(())
}

#[update]
fn conform_payment(id: ContentId) -> Result<(), String> {
    let payment = PaymentContract::get(caller(), id.clone())?;
    let payment = payment.conform()?;
    // PaymentContract::accept_payment(payment.sender, id.clone())?;
    let content: NoteContent = NoteContent::PaymentContract(payment.clone(), PaymentAction::Accepted);
    let new_note = Notification {
        id: payment.contract_id,
        sender: caller(),
        receiver: payment.sender.clone(), // Don't get confused the receiver of the payment is the caller()
        content,
        is_seen: false,
    };
    new_note.save();
    Ok(())
}


#[update]
fn object_payment(id: ContentId, comment: String) -> Result<(), String> {
    let mut payment = PaymentContract::get(caller(), id.clone())?;
    if payment.receiver != caller() {
        return Err("You are not the receiver of the payment".to_string());
    }
    if payment.released {
        return Err("Payment is already released".to_string());
    }
    if !payment.confirmed {
        return Err("Payment is not confirmed".to_string());
    }

    payment.objected = Some(comment.clone());
    payment.save()?;
    // Action done by payment.receiver, if needed PaymentAction::Objected(payment.receiver)
    let content: NoteContent = NoteContent::PaymentContract(payment.clone(), PaymentAction::Objected);
    let new_note = Notification {
        id: payment.contract_id,
        sender: caller(),
        receiver: payment.sender.clone(), // Don't get confused the receiver of the payment is the caller()
        content,
        is_seen: false,
    };
    new_note.save();
    Ok(())
}