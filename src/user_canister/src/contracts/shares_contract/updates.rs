use std::sync::atomic::Ordering;

use candid::Principal;
use ic_cdk::{call, caller};
use ic_cdk_macros::update;

use crate::{ExchangeType, Share, SharesContract, Wallet, websocket};
use crate::files::COUNTER;
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
fn pay_for_share_contract(contract_id: ContractId, amount: u64) -> Result<(), String> {
    // TODO fix this issue too much cloning

    let mut contract: SharesContract = SharesContract::get(contract_id)?;
    let mut wallet = Wallet::get(caller());

    wallet.withdraw(amount.clone(), "".to_string(), ExchangeType::LocalSend)?;

    contract.pay(amount.clone())?;

    for share in contract.clone().shares.iter() {
        let share_value = amount.clone() * (share.clone().share / 100);
        let mut wallet = Wallet::get(share.receiver.clone());
        wallet.deposit(share_value, "".to_string(), ExchangeType::LocalReceive)?;

        let new_notification = Notification {
            id: COUNTER.fetch_add(1, Ordering::SeqCst).to_string(),
            sender: caller(),
            receiver: share.receiver.clone(),
            content: NoteContent::SharePayment(contract.clone()),
            is_seen: false,
        };
        new_notification.save(share.receiver.clone());
    }
    Ok(())
}

#[update]
fn conform_share(share_contract_id: ShareContractId, contract_id: ContractId) -> Result<(), String> {
    let mut contract = SharesContract::get(contract_id)?;
    contract.conform(share_contract_id)
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
fn approve_request(share_requests_id: Vec<ShareContractId>, contract_id: ContractId) -> Result<(), String> {
    let mut contract = SharesContract::get(contract_id)?;
    for request in share_requests_id {
        contract.approve_request(request)?;
    }
    Ok(())
}

#[update]
fn apply_request(share_requests_id: Vec<ShareContractId>, contract_id: ContractId) -> Result<(), String> {
    let mut contract = SharesContract::get(contract_id)?;
    for request in share_requests_id {
        contract.apply_request(request)?;
    }
    Ok(())
}
