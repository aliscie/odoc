use crate::chat::{Chat, Message};
use crate::COUNTER;
use candid::Principal;
use ic_cdk::caller;
use ic_cdk_macros::update;
use std::sync::atomic::Ordering;

use crate::user::User;
use crate::websocket::{NoteContent, Notification};
#[update]
fn send_message(user: Option<Principal>, mut message: Message) -> Result<String, String> {
    if User::is_anonymous() {
        return Err("You are anonymous".to_string());
    }

    message.seen_by.push(caller());
    let id = COUNTER.fetch_add(1, Ordering::SeqCst).to_string();
    let mut new_notification = Notification {
        id: id.clone(),
        sender: caller(),
        receiver: caller(),
        content: NoteContent::NewMessage(message.clone()),
        is_seen: false,
        time: ic_cdk::api::time() as f64,
    };

    message.date = ic_cdk::api::time();
    if let Some(mut chat) = Chat::get(&message.chat_id) {
        if !(chat.members.contains(&caller()) || chat.admins.contains(&caller()) || chat.creator == caller()) {
            return Err("You are not a member of this chat.".to_string());
        }
        for member in chat.members.iter().filter(|m| m != &&caller()) {
            new_notification.id = COUNTER.fetch_add(1, Ordering::SeqCst).to_string();
            new_notification.receiver = *member;
            new_notification.send();
        }
        chat.messages.push(message.clone());
        chat.save();
        Ok(message.chat_id)
    } else if let Some(user) = user {
        let mut chat = Chat::new(user, message.chat_id.clone());
        chat.messages.push(message.clone());
        new_notification.receiver = user;
        new_notification.send();
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
        chat.messages = chat
            .messages
            .iter_mut()
            .map(|m| {
                if m.id == message.id {
                    m.seen_by.push(caller());
                }
                m.clone()
            })
            .collect::<Vec<Message>>();
        chat.save();
        return Ok(());
    }
    Err("Chat not found".to_string())
}

#[update]
fn delete_chat(id: String) -> Result<String, String> {
    let chat = Chat::get(&id);
    if let Some(chat) = chat {
        chat.delete()
    } else {
        Err("Chat not found".to_string())
    }
}

#[update]
fn update_chat(mut chat: Chat) -> Result<String, String> {
    // add admins, remove admins, add members, remove members, But you can't update messages
    if User::is_anonymous() {
        return Err("You are anonymous".to_string());
    }
    let old_chat = Chat::get(&chat.id);
    if let Some(mut old_chat) = old_chat {
        if old_chat.creator == caller() {
            chat.creator = caller();
            old_chat.admins = chat.admins.clone();
            old_chat.members = chat.members.clone();
            old_chat.workspaces = chat.workspaces.clone();

            for member in chat.members.clone() {
                old_chat.add_to_my_chats(member);
            }
            for admin in chat.admins.clone() {
                old_chat.add_to_my_chats(admin);
            }

            // get the members/admins that are in old chat but not found in chat
            let removed_members = old_chat
                .members
                .clone()
                .into_iter()
                .filter(|m| !chat.members.contains(m))
                .collect::<Vec<Principal>>();
            let removed_admins = old_chat
                .admins
                .clone()
                .into_iter()
                .filter(|m| !chat.admins.contains(m))
                .collect::<Vec<Principal>>();
            for member in removed_members {
                old_chat.remove_from_my_chats(member);
            }
            for admin in removed_admins {
                old_chat.remove_from_my_chats(admin);
            }

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
fn make_new_chat_room(mut chat: Chat) -> Result<String, String> {
    if User::is_anonymous() {
        return Err("You are anonymous".to_string());
    };
    chat.creator = caller();

    for member in chat.members.clone() {
        chat.add_to_my_chats(member);
    }
    for admin in chat.admins.clone() {
        chat.add_to_my_chats(admin);
    }
    chat.save();
    Ok(chat.id)
}

// reason for blocking
// #[update]
// fn block_user
