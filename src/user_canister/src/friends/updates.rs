use std::sync::atomic::Ordering;

use candid::Principal;
use ic_cdk::{caller, println};
use ic_cdk_macros::update;

use crate::{FRIENDS_STORE, websocket};
use crate::COUNTER;
use crate::friends::{Friend};
use crate::user::User;
use crate::websocket::{NoteContent, Notification};

#[update]
pub fn send_friend_request(user_principal: String) -> Result<User, String> {
    let user = User::get_user_from_text_principal(&user_principal);
    if user.clone().is_none() {
        return Err("User does not exist".to_string());
    }

    if caller() == user.clone().unwrap().principal() {
        return Err("You can't send a friend request to yourself.".to_string());
    }

    let friends = Friend::get_list(user_principal.parse().unwrap());

    let mut f: Friend = Friend::new(caller().to_string(), user_principal.clone());
    if !friends.contains(&f) && !friends.contains(&f) {
        Friend::send_friend_request(user.clone().unwrap())?;
        if let Ok(u) = Principal::from_text(user_principal) {
            websocket::notify_friend_request(f);
        }

        Ok(user.unwrap())
    } else {
        Err("Friend request already sent or user is already a friend.".to_string())
    }
}

#[update]
pub fn accept_friend_request(user_principal: String) -> Result<User, String> {
    // Retrieve the current user based on the principal text provided
    let user = User::get_user_from_text_principal(&user_principal)
        .ok_or("User not found.")?;

    // Ensure the friend request receiver (caller) is not the sender (user_principal)
    if caller().to_string() == user_principal {
        return Err("Cannot accept your own friend request.".to_string());
    }

    // Construct a friend object to compare with existing requests
    let mut f: Friend = Friend::new(user_principal.clone(), caller().to_string());

    // Get the caller's friend list
    let friend_list = Friend::get_list(caller());

    // Check if the friend request exists
    if friend_list.iter().any(|request| request == &f) {
        FRIENDS_STORE.with(|friends_store| {
            let mut store = friends_store.borrow_mut();

            // Update the confirmed status of the friend request for the caller
            if let Some(friend_request) = store.entry(caller()).or_default().iter_mut().find(|request| **request == f) {
                friend_request.confirmed = true;
            }

            // Also update the confirmed status in the friend's list
            if let Ok(user_principal_id) = user_principal.parse() {
                if let Some(friend_request) = store.entry(user_principal_id).or_default().iter_mut().find(|request| **request == f) {
                    friend_request.confirmed = true;
                }
            }
        });

        // Update notification status to seen
        let note = Notification::get(user.id.clone() + &*caller().to_text());
        if let Some(notification) = note {
            notification.seen();
        }

        // Create and save a new notification for accepting the friend request
        let note_content = NoteContent::AcceptFriendRequest;
        let new_id = caller().to_string() + &user_principal;
        let new_note = Notification::new(new_id, user.principal().clone(), note_content);
        new_note.save();

        Ok(user)
    } else {
        Err("No friend request found from the specified user.".to_string())
    }
}


#[update]
pub fn unfriend(user_principal: String) -> Result<User, String> {
    let user = User::get_user_from_text_principal(&user_principal);
    let friends = Friend::get_list(caller());
    // let f: Friend = Friend::new(user_principal.clone(), caller().to_string());
    // let f2: Friend = Friend::new(caller().to_string(), user_principal.clone());

    // if let Some(_index) = friend.friends.iter().position(|friend| friend == &f || friend == &f2) {
    Friend::unfriend(&user.clone().unwrap())?;

    // -------- notification ------ \\\
    let note = websocket::get_friend_request_note(user.clone().unwrap().principal(), caller());
    if let Some(notification) = note {
        notification.seen();
    } else {
        let note = websocket::get_friend_request_note(caller(), user.clone().unwrap().principal());
        note.unwrap().seen();
    };
    let new_note = Notification {
        // id: caller().to_string() + &user.clone().unwrap().id + "Unfriend",
        id: caller().to_string() + &user.clone().unwrap().id,
        content: NoteContent::Unfriend,
        sender: caller(),
        receiver: user.clone().unwrap().principal(),
        is_seen: false,
    };
    new_note.save();

    Ok(user.unwrap())
    // } else {
    //     Err("The specified user is not a friend.".to_string())
    // }
}

#[update]
pub fn cancel_friend_request(user_principal: String) -> Result<User, String> {
    let user = User::get_user_from_text_principal(&user_principal);
    let friends = Friend::get_list(caller());
    let mut f: Friend = Friend::new(caller().to_string(), user_principal.clone());
    if let Some(_index) = friends.iter().position(|request| request == &f) {
        Friend::cancel_friend_request(&f);
        let f: Friend = Friend::new(caller().to_string(), user_principal.clone());


        //------------ Get the id of the notification with receiver caller() and sender user ------------\\
        let note = websocket::get_friend_request_note(caller(), user.clone().unwrap().principal());
        if let Some(notification) = note {
            notification.delete();
        } else {
            let note = websocket::get_friend_request_note(user.clone().unwrap().principal(), caller());
            if let Some(notification) = note {
                notification.delete();
                // rais error if id is not found
            }
        }
        Ok(user.unwrap())
    } else {
        Err("No friend request found from the specified user.".to_string())
    }
}


#[update]
pub fn reject_friend_request(user_principal: String) -> Result<User, String> {
    let user = User::get_user_from_text_principal(&caller().to_string());
    let friends = Friend::get_list(caller());
    let mut f: Friend = Friend::new(user_principal.clone(), caller().to_string());

    if let Some(_index) = friends.iter().position(|request| request == &f) {
        Friend::cancel_friend_request(&f);

        //------------ Get the id of the notification with receiver caller() and sender user ------------\\
        let note = websocket::get_friend_request_note(caller(), user.clone().unwrap().principal());
        if let Some(notification) = note {
            notification.delete();
        } else {
            let note = websocket::get_friend_request_note(user.clone().unwrap().principal(), caller());
            if let Some(notification) = note {
                notification.delete();
                // rais error if id is not found
            }
        }
        Ok(user.unwrap())
    } else {
        Err("No friend request found from the specified user.".to_string())
    }
}

