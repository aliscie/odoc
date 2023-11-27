use candid::{CandidType, Deserialize, Principal};
use ic_cdk::{caller, println};

use std::collections::BTreeMap;

use crate::{FILE_CONTENTS, NOTIFICATIONS, USER_FILES};
use crate::websocket::{AppMessage, send_app_message};

#[derive(Eq, PartialOrd, PartialEq, Clone, Debug, Default, CandidType, Deserialize)]
pub struct Notification {
    pub(crate) title: String,
    pub(crate) description: String,
    pub(crate) target: String,
    pub(crate) date: String,
    pub(crate) is_seen: bool,
}


pub fn notify(user: Principal, notification: Notification) {
    let msg: AppMessage = AppMessage {
        text: notification.clone().title, // Assuming Notification has a 'text' field
        timestamp: 0,
    };

    send_app_message(user, msg.clone());
}

// pub fn get_notifications(user: Principal) -> Vec<Notification> {
//
// }

// pub fn see_notification(user: Principal){
//     NOTIFICATIONS.with
// }