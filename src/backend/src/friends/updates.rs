use std::fmt::format;
use std::sync::atomic::Ordering;

use candid::Principal;
use ic_cdk::{call, caller, println};
use ic_cdk_macros::update;

use crate::friends::Friend;
use crate::user::User;
use crate::websocket::{FriendRequestNotification, NoteContent, Notification};
use crate::COUNTER;
use crate::{websocket, FRIENDS_STORE};

#[update]
pub fn send_friend_request(user_principal: String) -> Result<User, String> {
    let id = caller().to_string() + &user_principal.clone();
    if Friend::get(&id).is_some() {
        return Err("Friend request already sent or user is already a friend.".to_string());
    };
    let new_friend: Friend = Friend {
        id,
        sender: User::get_user_from_text_principal(&caller().to_string()).unwrap(),
        receiver: User::get_user_from_text_principal(&user_principal).unwrap(),
        confirmed: false,
    };
    new_friend.pure_save();
    websocket::notify_friend_request(new_friend.clone());
    Ok(User::get_user_from_text_principal(&user_principal).unwrap())
}

// id sender_left + receiver_right
#[update]
pub fn accept_friend_request(user_principal: String) -> Result<User, String> {
    let sender = User::get_user_from_text_principal(&user_principal);
    if sender.is_none() {
        return Err("User not found".to_string());
    }
    let sender = sender.unwrap();
    let id = user_principal.clone() + &caller().to_string();
    let id2 = format!("{}{}", caller().to_string(), user_principal.clone());
    let friend = Friend {
        id: user_principal.clone() + &caller().to_string(),
        sender,
        receiver: User::get_user_from_text_principal(&caller().to_string()).unwrap(),
        confirmed: true,
    };
    friend.pure_save();
    let note_content = NoteContent::AcceptFriendRequest;
    let new_note = Notification::new(
        id2,
        Principal::from_text(user_principal.clone()).unwrap(),
        note_content,
    );
    new_note.save();
    let note = Notification::get(id);
    if let Some(mut notification) = note {
        notification.is_seen = true;
        notification.save();
    }
    return Ok(User::get_user_from_text_principal(&user_principal).unwrap());
}

#[update]
pub fn unfriend(user_principal: String) -> Result<User, String> {
    let id1 = caller().to_string() + &user_principal.clone();
    let id2 = user_principal.clone() + &caller().to_string();
    let friend = Friend::get(&id1).unwrap_or_else(|| Friend::get(&id2).unwrap());
    friend.delete();
    let receiver = Principal::from_text(user_principal.clone()).unwrap();
    let new_note = Notification {
        // id: caller().to_string() + &user.clone().unwrap().id + "Unfriend",
        id: friend.id,
        content: NoteContent::Unfriend,
        sender: caller(),
        receiver: receiver.clone(),
        is_seen: false,
        time: ic_cdk::api::time() as f64,
    };
    new_note.save();

    Ok(User::get_user_from_text_principal(&user_principal).unwrap())
}

// sender_left + receiver_right
#[update]
pub fn cancel_friend_request(user_principal: String) -> Result<User, String> {
    let id = format!("{}{}", caller().to_string(), user_principal.clone());
    let id2 = user_principal.clone() + &caller().to_string();
    let friend = Friend::get(&id).unwrap();
    friend.delete();
    let receiver = Principal::from_text(user_principal.clone()).unwrap();
    let note = Notification::get(id2.clone());
    if let Some(mut notification) = note {
        notification.is_seen = true;
        notification.save();
    }

    let new_note = Notification {
        id: id.clone(),
        content: NoteContent::FriendRequest(FriendRequestNotification { friend }),
        sender: caller(),
        receiver,
        is_seen: false,
        time: ic_cdk::api::time() as f64,
    };
    new_note.save();

    Ok(User::get_user_from_text_principal(&user_principal).unwrap())
}

#[update]
pub fn reject_friend_request(user_principal: String) -> Result<User, String> {
    let id = user_principal.clone() + &caller().to_string();
    let friend = Friend::get(&id).unwrap();
    friend.delete();
    let receiver = Principal::from_text(user_principal.clone()).unwrap();
    let new_note = Notification {
        // id: caller().to_string() + &user.clone().unwrap().id + "Unfriend",
        id,
        content: NoteContent::FriendRequest(FriendRequestNotification { friend }),
        sender: caller(),
        receiver: receiver.clone(),
        is_seen: false,
        time: ic_cdk::api::time() as f64,
    };
    new_note.save();

    Ok(User::get_user_from_text_principal(&user_principal).unwrap())
}
