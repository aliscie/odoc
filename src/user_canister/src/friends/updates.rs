use std::sync::atomic::Ordering;

use candid::Principal;
use ic_cdk::{caller, println};
use ic_cdk_macros::update;

use crate::{FRIENDS_STORE, websocket};
use crate::files::COUNTER;
use crate::friends::Friend;
use crate::user::User;
use crate::websocket::{NoteContent, Notification};

#[update]
pub fn send_friend_request(user_principal: String) -> Result<User, String> {
    let user = User::get_user_from_text_principal(user_principal.clone());
    if user.clone().is_none() {
        return Err("User does not exist".to_string());
    }

    if caller() == user.clone().unwrap().principal() {
        return Err("You can't send a friend request to yourself.".to_string());
    }


    let mut friend = if let Some(friend) = Friend::get_friends_of_caller() {
        friend
    } else {
        Friend {
            friend_requests: Vec::new(),
            friends: Vec::new(),
        }
    };


    if !friend.friends.contains(&user.clone().unwrap()) && !friend.friend_requests.contains(&user.clone().unwrap()) {
        friend.send_friend_request(user.clone().unwrap())?;
        if let Ok(u) = Principal::from_text(user_principal) {
            websocket::notify_friend_request(u);
        }

        Ok(user.unwrap())
    } else {
        Err("Friend request already sent or user is already a friend.".to_string())
    }
}

#[update]
pub fn accept_friend_request(user_principal: String) -> Result<User, String> {

    // ToDo prevent the friend request sender from accepting the request
    //  Only the request receiver can accept_friend_request

    let user = User::get_user_from_text_principal(user_principal.clone());
    if let Some(friend) = Friend::get_friends_of_caller() {
        if let Some(_index) = friend.friend_requests.iter().position(|request| *request == user.clone().unwrap()) {
            FRIENDS_STORE.with(|friends_store| {
                let mut store = friends_store.borrow_mut();
                store.entry(caller()).or_default().friend_requests.retain(|request| *request != user.clone().unwrap());
                store.entry(caller()).or_default().friends.push(user.clone().unwrap());

                // Add the caller to the friend's list as well
                store.entry(user_principal.parse().unwrap()).or_default().friends.push(User::get_user_from_principal(caller()).unwrap());
            });

            // -------- notification seen ------ \\\
            let note = websocket::get_friend_request_id(user.clone().unwrap().principal(), caller());
            if let Some(notification) = note {
                notification.seen();
            } else {
                let note = websocket::get_friend_request_id(caller(), user.clone().unwrap().principal());
                note.clone().unwrap().seen();
            };
            let note_content = NoteContent::AcceptFriendRequest;
            let new_note = Notification::new(user.clone().unwrap().principal(), note_content);
            new_note.save();

            Ok(user.unwrap())
        } else {
            Err("No friend request found from the specified user.".to_string())
        }
    } else {
        Err("Failed to retrieve caller's friend list.".to_string())
    }
}

#[update]
pub fn unfriend(user_principal: String) -> Result<User, String> {
    let user = User::get_user_from_text_principal(user_principal);
    if let Some(mut friend) = Friend::get_friends_of_caller() {
        if let Some(_index) = friend.friends.iter().position(|friend| friend.clone() == user.clone().unwrap()) {
            friend.unfriend(&user.clone().unwrap());

            // -------- notification ------ \\\
            let note = websocket::get_friend_request_id(user.clone().unwrap().principal(), caller());
            if let Some(notification) = note {
                notification.seen();
            } else {
                let note = websocket::get_friend_request_id(caller(), user.clone().unwrap().principal());
                note.unwrap().seen();
            };
            let new_note = Notification {
                id: COUNTER.fetch_add(1, Ordering::SeqCst).to_string(),
                content: NoteContent::Unfriend,
                sender: caller(),
                receiver: user.clone().unwrap().principal(),
                is_seen: false,
            };
            new_note.save();

            Ok(user.unwrap())
        } else {
            Err("The specified user is not a friend.".to_string())
        }
    } else {
        Err("Failed to retrieve caller's friend list.".to_string())
    }
}

#[update]
pub fn cancel_friend_request(user_principal: String) -> Result<User, String> {
    let user = User::get_user_from_text_principal(user_principal);
    if let Some(mut friend) = Friend::get_friends_of_caller() {
        if let Some(_index) = friend.friend_requests.iter().position(|request| *request == user.clone().unwrap()) {
            friend.cancel_friend_request(&user.clone().unwrap());

            //------------ Get the id of the notification with receiver caller() and sender user ------------\\
            let note = websocket::get_friend_request_id(caller(), user.clone().unwrap().principal());
            if let Some(notification) = note {
                notification.delete();
            } else {
                let note = websocket::get_friend_request_id(user.clone().unwrap().principal(), caller());
                if let Some(notification) = note {
                    notification.delete();
                    // rais error if id is not found
                }
            }
            Ok(user.unwrap())
        } else {
            Err("No friend request found from the specified user.".to_string())
        }
    } else {
        Err("Failed to retrieve caller's friend list.".to_string())
    }
}
