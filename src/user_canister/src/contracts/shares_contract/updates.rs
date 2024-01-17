use std::sync::atomic::Ordering;

use candid::Principal;
use ic_cdk::caller;
use ic_cdk_macros::update;

use crate::{ExchangeType, Share, SharesContract, Wallet, websocket};
use crate::COUNTER;
use crate::storage_schema::{ContractId, ShareContractId};
use crate::websocket::{NoteContent, Notification};

#[update]
fn create_share_contract(shares: Vec<Share>) -> Result<String, String> {
    let _new_share_contract = SharesContract::new(shares);
    Ok("Payment not found in contract".to_string())
    // Err("Payment not found in contract".to_string())
}


// #[update]
// fn update_shares(shares: Vec<Share>, contract_id: ContractId) -> Result<String, String> {
//     let mut share_contract = SharesContract::get(contract_id)?;
//     for share in shares {
//         share_contract.update(share).expect("TODO: panic message");
//     }
//
//     Ok("Share updated.".to_string())
// }


#[update]
fn pay_for_share_contract(contract_id: ContractId, amount: u64, author: String) -> Result<(), String> {
    // TODO fix this issue too much cloning
    let author: Principal = author.parse().unwrap();
    let mut contract: SharesContract = SharesContract::get(contract_id, author)?;
    let mut wallet = Wallet::get(caller());
    let from = caller().to_string();
    let to = author.to_string();

    wallet.withdraw(amount.clone(), to, ExchangeType::LocalSend)?;

    contract.pay(amount.clone())?;

    for share in contract.clone().shares.iter() {
        let share_value = amount.clone() * (share.clone().share / 100);
        let mut wallet = Wallet::get(share.receiver.clone());
        wallet.deposit(share_value, from.clone(), ExchangeType::LocalReceive)?;

        let new_notification = Notification {
            id: COUNTER.fetch_add(1, Ordering::SeqCst).to_string(),
            sender: caller(),
            receiver: share.receiver.clone(),
            content: NoteContent::SharePayment(contract.clone()),
            is_seen: false,
        };
        new_notification.save();
    }
    Ok(())
}

#[update]
fn conform_share(user: String, share_contract_id: ShareContractId, contract_id: ContractId) -> Result<(), String> {
    let user: Principal = Principal::from_text(user).expect("Error at converting user to principal");
    let mut contract = SharesContract::get_for_author(user, contract_id)?;
    let content: NoteContent = NoteContent::ConformShare(share_contract_id.clone());
    let new_note = Notification {
        id: COUNTER.fetch_add(1, Ordering::SeqCst).to_string(),
        sender: caller(),
        receiver: user,
        content,
        is_seen: false,
    };
    new_note.save();
    contract.conform(user, share_contract_id)
}


// #[update]
// fn request_share_change(shares_requests: Vec<ShareRequest>, contract_id: ContractId) -> Result<(), String> {
//     let mut contract = SharesContract::get(contract_id)?;
//     for share_request in shares_requests {
//         let request = Share {
//             share_contract_id: share_request.share_contract_id,
//             receiver: share_request.receiver,
//             share: share_request.share,
//             confirmed: false,
//             accumulation: 0,
//             contractor: Some(caller()),
//         };
//         contract.request(request).expect("Error at adding share_request");
//     };
//     Ok(())
// }


#[update]
fn approve_request(author: String, share_requests_id: ShareContractId, contract_id: ContractId) -> Result<(), String> {
    let author = Principal::from_text(author).expect("Error at converting user to principal");
    let mut contract: SharesContract = SharesContract::get_for_author(author, contract_id)?;
    contract.approve_request(author, share_requests_id)?;
    if contract.is_all_approved() {
        let content: NoteContent = NoteContent::ShareRequestApproved(contract.clone());
        let new_note = Notification {
            id: COUNTER.fetch_add(1, Ordering::SeqCst).to_string(),
            sender: caller(),
            receiver: author,
            content,
            is_seen: false,
        };
        new_note.save();
    }
    Ok(())
}

#[update]
fn apply_request(share_requests_id: ShareContractId, contract_id: ContractId, author: String) -> Result<(), String> {
    let author: Principal = author.parse().unwrap();
    let mut contract: SharesContract = SharesContract::get(contract_id, author)?;
    contract.apply_request(share_requests_id)?;
    let content: NoteContent = NoteContent::ApplyShareRequest(contract.contract_id.clone());

    // ---------- Notify receivers ---------- \\
    let mut new_note = Notification {
        id: COUNTER.fetch_add(1, Ordering::SeqCst).to_string(),
        sender: caller(),
        receiver: author,
        content,
        is_seen: false,
    };

    for share in contract.clone().shares.iter() {
        if share.receiver != author {
            new_note.receiver = share.receiver.clone();
            new_note.save();
        }
    }

    Ok(())
}
