use candid::{CandidType, Deserialize, Principal};
use ic_cdk::{caller, print, println};
use std::sync::atomic::Ordering;
use serde::{Serialize};

use std::collections::BTreeMap;

use crate::{FILE_CONTENTS, NOTIFICATIONS, USER_FILES, websocket};
use crate::files::COUNTER;
use crate::websocket::{AppMessage, send_app_message};

#[derive(Eq, PartialOrd, PartialEq, Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct FriendRequestNotification {
    pub(crate) sender: Principal,
    pub(crate) receiver: Principal,
}

#[derive(Eq, PartialOrd, PartialEq, Clone, Debug, CandidType, Serialize, Deserialize)]
pub enum NoteContent {
    FriendRequest(FriendRequestNotification),
    // ContractUpdate(FileUpdateNotification),
}

#[derive(Eq, PartialOrd, Serialize, PartialEq, Clone, Debug, CandidType, Deserialize)]
pub struct Notification {
    pub(crate) id: String,
    pub(crate) content: NoteContent,
    pub(crate) is_seen: bool,

}

// impliemtn a function to Notification that get the id of friedn requst by importing reciveer and sender
impl Notification {}


pub fn get_friend_request_id(sender: Principal, receiver: Principal) -> Option<String> {
    NOTIFICATIONS.with(|notifications| {
        let user_notifications = notifications.borrow();
        let user_notifications = user_notifications.get(&receiver);
        if let Some(user_notifications) = user_notifications {
            for notification in user_notifications {
                if let NoteContent::FriendRequest(friend_request) = &notification.content {
                    if friend_request.sender == sender {
                        return Some(notification.id.clone());
                    }
                }
            }
        }
        None
    })
}

pub fn notify_friend_request(user_principal: Principal) {
    let friend_request_notification = FriendRequestNotification {
        sender: caller(),
        receiver: user_principal,
    };

    // Example of creating a new Notification with the FriendRequest content
    let new_notification = Notification {
        id: COUNTER.fetch_add(1, Ordering::SeqCst).to_string(),
        content: NoteContent::FriendRequest(friend_request_notification),
        is_seen: false,
    };

    websocket::notify(user_principal.clone(), new_notification);
}

pub fn notify(user: Principal, notification: Notification) {
    print("before notification sent");
    let msg: AppMessage = AppMessage {
        notification: Some(notification.clone()),
        text: notification.id.clone(),
        timestamp: 0,
    };
    NOTIFICATIONS.with(|notifications| {
        let mut user_notifications = notifications.borrow_mut();
        let user_notifications = user_notifications.entry(user.clone()).or_insert_with(Vec::new);
        user_notifications.push(notification);
    });
    print("notification sent");
    send_app_message(user, msg.clone());
}

type id = String;

pub fn unnotify(user: Principal, id: String) {
    // let msg: AppMessage = AppMessage {
    //     notification: None,
    //     text: "Unfriend".to_string(),
    //     timestamp: 0,
    // };

    NOTIFICATIONS.with(|notifications| {
        let mut user_notifications = notifications.borrow_mut();
        let user_notifications = user_notifications.entry(caller()).or_insert_with(Vec::new);
        user_notifications.retain(|n| n.id != id);
    });
    // send_app_message(user, msg.clone());
}