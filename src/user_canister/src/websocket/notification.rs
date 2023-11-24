use candid::{CandidType, Deserialize, Principal};
use ic_cdk::{caller, println};

use std::collections::BTreeMap;

use crate::{CLIENTS_CONNECTED, FILE_CONTENTS, NOTIFICATIONS, USER_FILES};
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
    // let client_principal: Option<Principal> = CLIENTS_CONNECTED.with(|clients_connected| {
    //     let clients_connected = clients_connected.borrow();
    //     clients_connected.get(&user).cloned()
    // });



    let msg: AppMessage = AppMessage {
        text: notification.clone().title, // Assuming Notification has a 'text' field
        timestamp: 0,
    };
    CLIENTS_CONNECTED.with(|clients_connected| {
        let clients_connected = clients_connected.borrow();
        for (k, v) in clients_connected.iter() {
            println!("....... v {}", v == &user); //TODO  one of these must return True.
            println!("....... k {}", k == &user);
            send_app_message(k.clone(), msg.clone());
        }
    });

    // if let Some(client_principal) = client_principal {
    //
    //
    //     // send_app_message(client_principal, msg);
    //
    //     NOTIFICATIONS.with(|notifications| {
    //         let mut notifications = notifications.borrow_mut();
    //
    //         // If the user doesn't have any notifications yet, create an empty Vec
    //         let user_notifications = notifications.entry(user).or_insert(Vec::new());
    //
    //         // Push the new notification to the user's notifications
    //         user_notifications.push(notification);
    //         println!("User notifications: {:?}", user_notifications);
    //     });
    // } else {
    //     println!("User notifications Flair....!");
    //     // Handle the case where the user is not connected
    //     // You may want to log or handle this situation accordingly
    // }
}

// pub fn get_notifications(user: Principal) -> Vec<Notification> {
//
// }

// pub fn see_notification(user: Principal){
//     NOTIFICATIONS.with
// }