use std::sync::atomic::Ordering;

use candid::{CandidType, Deserialize, Principal};
use ic_cdk::caller;
use serde::Serialize;

use crate::{CPayment, NOTIFICATIONS, SharePayment, SharesContract, USER_FILES, websocket};
use crate::chat::Message;
use crate::COUNTER;
use crate::friends::Friend;
use crate::websocket::{AppMessage, notification, send_app_message};

#[derive(PartialEq, Clone, Debug, CandidType, Deserialize)]
pub struct FriendRequestNotification {
    friend: Friend,
}


#[derive(Eq, PartialOrd, PartialEq, Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct ContractNotification {
    pub(crate) contract_type: String,
    pub(crate) contract_id: String,
}

#[derive(Eq, PartialEq, Clone, Debug, CandidType, Serialize, Deserialize)]
pub enum PaymentAction {
    Cancelled,
    Released,
    Accepted,
    Update,
    Objected,
    Promise,
    // ActionType(Principal), // if needed u can, action done by user with the Principal
}

#[derive(PartialEq, Clone, Debug, CandidType, Deserialize)]
pub enum NoteContent {
    FriendRequest(FriendRequestNotification),
    ContractUpdate(ContractNotification),
    SharePayment(SharesContract),
    Unfriend,
    AcceptFriendRequest,
    ShareRequestApplied(SharesContract),
    ShareRequestApproved(SharesContract),
    ConformShare(String),
    ApproveShareRequest(String),
    ApplyShareRequest(String),
    NewMessage(Message),
    RemovedFromChat(String),
    CPaymentContract(CPayment, PaymentAction),
    CustomContract(String, CPayment),
    // FilePermition(FileID,Vec<Contract>)
}

#[derive(PartialEq, Clone, Debug, CandidType, Deserialize)]
pub struct Notification {
    pub(crate) id: String,
    pub(crate) sender: Principal,
    pub(crate) receiver: Principal,
    pub(crate) content: NoteContent,
    pub(crate) is_seen: bool,
    pub(crate) time: f64,
}

// impliemtn a function to Notification that get the id of friedn requst by importing reciveer and sender
impl Notification {
    pub fn new(id: String, user: Principal, content: NoteContent) -> Self {
        Notification {
            id,
            content,
            sender: caller(),
            receiver: user,
            is_seen: false,
            time: ic_cdk::api::time() as f64,
        }
    }


    pub fn save(&self) {
        NOTIFICATIONS.with(|notifications| {
            let mut user_notifications = notifications.borrow_mut();
            let user_notifications = user_notifications.entry(self.receiver).or_default();
            user_notifications.retain(|notification| notification.id != self.id);
            user_notifications.push(self.clone());
        });
        let msg: AppMessage = AppMessage {
            notification: Some(self.clone()),
            text: self.id.clone(),
            timestamp: ic_cdk::api::time(),
        };
        send_app_message(self.receiver, msg.clone());
    }

    pub fn send(&self) {
        let msg: AppMessage = AppMessage {
            notification: Some(self.clone()),
            text: self.id.clone(),
            timestamp: ic_cdk::api::time(),
        };
        send_app_message(self.receiver, msg.clone());
    }

    pub fn send_to(&self, to: Principal) {
        let msg: AppMessage = AppMessage {
            notification: Some(self.clone()),
            text: self.id.clone(),
            timestamp: ic_cdk::api::time(),
        };
        send_app_message(to, msg.clone());
    }
    // pub fn undo(user: Principal, id: String) {
    //     // let msg: AppMessage = AppMessage {
    //     //     notification: None,
    //     //     text: "Unfriend".to_string(),
    //     //     timestamp: ic_cdk::api::time(),
    //     // };
    //
    //     let notification = Notification::get(id);
    //     if let Some(notification) = notification {
    //         notification.delete();
    //     }
    //     // send_app_message(user, msg.clone());
    // }

    pub fn delete(&self) {
        NOTIFICATIONS.with(|notifications| {
            let mut user_notifications = notifications.borrow_mut();
            let user_notifications = user_notifications.entry(caller()).or_insert_with(Vec::new);
            user_notifications.retain(|n| n.id != self.id);
            let msg: AppMessage = AppMessage {
                notification: Some(self.clone()),
                text: "Delete".to_string(),
                timestamp: ic_cdk::api::time(),
            };
            send_app_message(self.receiver, msg.clone());
        });
    }

    pub fn seen(&self) {
        NOTIFICATIONS.with(|notifications| {
            let mut user_notifications = notifications.borrow_mut();
            let user_notifications = user_notifications.entry(caller()).or_insert_with(Vec::new);

            // Create a new version of user_notifications with is_seen updated
            let updated_user_notifications: Vec<Notification> = user_notifications
                .iter_mut()
                .map(|mut notification| {
                    if notification.id == self.id.clone() {
                        notification.is_seen = true;
                    }
                    notification.clone()
                })
                .collect();

            // Replace the original user_notifications with the updated version
            *user_notifications = updated_user_notifications;
        });
    }

    pub fn get(id: String) -> Option<Self> {
        NOTIFICATIONS.with(|notifications| {
            let user_notifications = notifications.borrow();
            let user_notifications = user_notifications.get(&caller());
            if let Some(user_notifications) = user_notifications {
                for notification in user_notifications {
                    if notification.id == id {
                        return Some(notification.clone());
                    }
                }
            }
            None
        })
    }
}


pub fn get_friend_request_note(sender: Principal, receiver: Principal) -> Option<Notification> {
    NOTIFICATIONS.with(|notifications| {
        let user_notifications = notifications.borrow();
        let user_notifications = user_notifications.get(&receiver);
        if let Some(user_notifications) = user_notifications {
            for notification in user_notifications {
                if notification.sender == sender {
                    return Some(notification.clone());
                }
            }
        }
        None
    })
}


pub fn notify_friend_request(f: Friend) {
    let friend_request_notification = FriendRequestNotification { friend: f.clone() };
    // Example of creating a new Notification with the FriendRequest content
    let receiver: Principal = Principal::from_text(&f.receiver.id).unwrap();
    let new_notification = Notification {
        id: caller().to_string() + &f.receiver.id.clone(),
        sender: caller(),
        receiver,
        content: NoteContent::FriendRequest(friend_request_notification),
        is_seen: false,
        time: ic_cdk::api::time() as f64,
    };
    new_notification.save();
}

type id = String;


pub fn contract_notification(receiver: Principal, sender: Principal, contract_type: String, contract_id: String) {
    let new_notification = Notification {
        id: COUNTER.fetch_add(1, Ordering::SeqCst).to_string(),
        sender,
        receiver,
        content: NoteContent::ContractUpdate(ContractNotification {
            contract_type,
            contract_id,
        }),
        is_seen: false,
        time: ic_cdk::api::time() as f64,
    };
    new_notification.save();
}
