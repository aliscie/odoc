use std::borrow::Cow;
use std::sync::atomic::Ordering;

use candid::{CandidType, Decode, Deserialize, Encode, Principal};
use ic_cdk::caller;
use ic_stable_structures::storable::Bound;
use ic_stable_structures::Storable;
use serde::Serialize;

use crate::chat::Message;
use crate::friends::Friend;
use crate::websocket::{notification, send_app_message, AppMessage};
use crate::COUNTER;
use crate::{websocket, CPayment, NOTIFICATIONS, USER_FILES};

#[derive(PartialEq, Clone, Debug, CandidType, Deserialize)]
pub struct FriendRequestNotification {
    pub friend: Friend,
}

#[derive(Eq, PartialOrd, PartialEq, Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct ContractNotification {
    pub(crate) contract_type: String,
    pub(crate) contract_id: String,
}

#[derive(PartialEq, Clone, Debug, CandidType, Serialize, Deserialize)]
pub enum PaymentAction {
    Cancelled,
    Released,
    Accepted,
    Update,
    Objected,
    Promise,
    RequestCancellation(CPayment),
    // ActionType(Principal), // if needed u can, action done by user with the Principal
}

#[derive(PartialEq, Clone, Debug, CandidType, Deserialize)]
pub enum NoteContent {
    FriendRequest(FriendRequestNotification),
    ContractUpdate(ContractNotification),
    // SharePayment(SharesContract),
    Unfriend,
    AcceptFriendRequest,
    // ShareRequestApplied(SharesContract),
    // ShareRequestApproved(SharesContract),
    ReceivedDeposit(String),
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

#[derive(PartialEq, Clone, Debug, CandidType, Deserialize)]
pub struct NotificationVec {
    pub(crate) notifications: Vec<Notification>,
}

impl Storable for Notification {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

impl Storable for NotificationVec {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        if let Ok(x) = Decode!(bytes.as_ref(), Self) {
            return x;
        }
        return NotificationVec {
            notifications: vec![],
        };
    }

    // fn from_bytes(bytes: Cow<[u8]>) -> Self {
    //     Decode!(bytes.as_ref(), Self).unwrap()
    // }

    const BOUND: Bound = Bound::Unbounded;
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
    pub fn get_list(user: &Principal) -> Vec<Self> {
        NOTIFICATIONS.with(|notifications| {
            let user_notifications = notifications.borrow();
            user_notifications
                .get(&user.to_string())
                .map_or_else(Vec::new, |notifications_for_user| {
                    notifications_for_user.notifications.clone()
                })
        })
    }
    pub fn get_list_promises(user: &Principal) -> Vec<CPayment> {
        NOTIFICATIONS.with(|notifications| {
            let user_notifications = notifications.borrow();
            user_notifications.get(&user.to_string()).map_or_else(
                Vec::new,
                |notifications_for_user| {
                    notifications_for_user
                        .notifications
                        .iter()
                        .filter_map(|notification| {
                            if let NoteContent::CPaymentContract(payment, _) = &notification.content
                            {
                                Some(payment.clone())
                            } else {
                                None
                            }
                        })
                        .collect()
                },
            )
        })
    }

    pub fn save(&self) {
        self.pure_save();
        let msg: AppMessage = AppMessage {
            notification: Some(self.clone()),
            text: self.id.clone(),
            timestamp: ic_cdk::api::time(),
        };
        send_app_message(self.receiver, msg.clone());
    }
    pub fn pure_save(&self) {
        NOTIFICATIONS.with(|notifications| {
            let mut notifications = notifications.borrow_mut();
            let mut user_notifications = notifications.get(&self.receiver.to_text());
            if let Some((mut user_notifications)) = user_notifications {
                let mut notifications_list = user_notifications.notifications;
                notifications_list.retain(|notification| notification.id != self.id);
                notifications_list.push(self.clone());
                notifications.insert(
                    self.receiver.to_text(),
                    NotificationVec {
                        notifications: notifications_list,
                    },
                );
            } else {
                notifications.insert(
                    self.receiver.to_text(),
                    NotificationVec {
                        notifications: vec![self.clone()],
                    },
                );
            }
        });
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
            let mut user_notifications = user_notifications
                .get(&caller().to_string())
                .unwrap_or_else(|| NotificationVec {
                    notifications: vec![],
                });
            user_notifications.notifications.retain(|n| n.id != self.id);
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
            let mut user_notifications = user_notifications
                .get(&caller().to_string())
                .unwrap_or_else(|| NotificationVec {
                    notifications: vec![],
                });

            // Update the is_seen field of the relevant notifications
            for notification in &mut user_notifications.notifications {
                if notification.id == self.id {
                    notification.is_seen = true;
                }
            }
        });
    }

    pub fn get(id: String) -> Option<Self> {
        NOTIFICATIONS.with(|notifications| {
            let user_notifications = notifications.borrow();
            if let Some(user_notifications) = user_notifications.get(&caller().to_string()) {
                for notification in &user_notifications.notifications {
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
        if let Some(user_notifications) = user_notifications.get(&receiver.to_text()) {
            for notification in &user_notifications.notifications {
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
        id: f.id,
        sender: caller(),
        receiver,
        content: NoteContent::FriendRequest(friend_request_notification),
        is_seen: false,
        time: ic_cdk::api::time() as f64,
    };
    new_notification.save();
}

type id = String;

pub fn contract_notification(
    receiver: Principal,
    sender: Principal,
    contract_type: String,
    contract_id: String,
) {
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
