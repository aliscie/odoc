use std::sync::atomic::Ordering;
use candid::Principal;
use ic_cdk::caller;
use ic_cdk_macros::update;
use crate::chat::{Chat, Message};
use crate::COUNTER;


use crate::user::User;
use crate::websocket::{NoteContent, Notification};


#[update]
fn send_message(user: Option<Principal>, mut message: Message) -> Result<String, String> {

    // TODO don't create new private
    //  if user is creator and caner() in admins
    //  or if user in admins and caller() is creator
    message.seen_by.push(caller());
    let mut new_notification = Notification {
        id: COUNTER.fetch_add(1, Ordering::SeqCst).to_string(),
        sender: caller(),
        receiver: caller(),
        content: NoteContent::NewMessage(message.clone()),
        is_seen: false,
    };

    if User::is_anonymous() {
        return Err("You are anonymous".to_string());
    }

    // handle chat message
    message.date = ic_cdk::api::time();
    if let Some(mut chat) = Chat::get(&message.chat_id) {

        // permissions
        if !(chat.members.contains(&caller()) || chat.admins.contains(&caller()) || (chat.creator == caller())) {
            return Err("You are not a member of this chat.".to_string());
        }
        if chat.admins[0] != caller() {
            new_notification.receiver = chat.admins[0].clone();
        } else {
            new_notification.receiver = chat.creator.clone();
        }
        new_notification.send();
        chat.messages.push(message.clone());
        // chat.save_to_my_chats();
        chat.save();

        Ok(message.chat_id)
    } else if let Some(user) = user {
        // TODO for group chats
        //     let mut chat = Chat::get_by_user(user);
        //     if chat.is_none() {
        //         chat = Some(Chat::new(user));
        //     }
        let mut chat = Chat::new(user,message.chat_id.clone());
        chat.messages.push(message.clone());
        new_notification.receiver = user;
        new_notification.send();
        // chat.save_to_my_chats();
        chat.save();
        chat.add_to_my_chats(user);
        chat.add_to_my_chats(caller());
        Ok(message.chat_id)
    } else {
        Err("Please provide a user principal or valid chat id.".to_string())
    }
}

#[update]
fn message_is_seen(message: Message) -> Result<(), String> {
    if let Some(mut chat) = Chat::get(&message.chat_id) {
        chat.messages = chat.messages.iter_mut().map(|m| {
            if m.id == message.id {
                m.seen_by.push(caller());
            }
            m.clone()
        }).collect::<Vec<Message>>();
        chat.save();
        return Ok(());
    }
    Err("Chat not found".to_string())
}

#[update]
fn update_chat(chat: Chat) -> Result<String, String> {
    // add admins, remove admins, add members, remove members, But you can't update messages
    if User::is_anonymous() {
        return Err("You are anonymous".to_string());
    }
    let old_chat = Chat::get(&chat.id);
    if let Some(mut old_chat) = old_chat {
        if old_chat.creator == caller() {
            old_chat.admins = chat.admins.clone();
            old_chat.members = chat.members.clone();

            for member in chat.members.clone() {
                old_chat.add_to_my_chats(member);
            };
            for admin in chat.admins.clone() {
                old_chat.add_to_my_chats(admin);
            };

            // get the members/admins that are in old chat but not found in chat
            let removed_members = old_chat.members.clone().into_iter().filter(|m| !chat.members.contains(m)).collect::<Vec<Principal>>();
            let removed_admins = old_chat.admins.clone().into_iter().filter(|m| !chat.admins.contains(m)).collect::<Vec<Principal>>();
            for member in removed_members {
                old_chat.remove_from_my_chats(member);
            };
            for admin in removed_admins {
                old_chat.remove_from_my_chats(admin);
            };

            old_chat.name = chat.name.clone();
            old_chat.save();
            Ok(chat.id)
        } else {
            Err("You are not the creator of this chat.".to_string())
        }
    } else {
        Err("Chat not found.".to_string())
    }
}


#[update]
fn make_new_chat_room(chat: Chat) -> Result<String, String> {
    if User::is_anonymous() {
        return Err("You are anonymous".to_string());
    }
    for member in chat.members.clone() {
        chat.add_to_my_chats(member);
    };
    for admin in chat.admins.clone() {
        chat.add_to_my_chats(admin);
    };
    chat.save();
    Ok(chat.id)
}

// reason for blocking
// #[update]
// fn block_user