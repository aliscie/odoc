use crate::chat::{Chat, Message};
use crate::COUNTER;
use candid::Principal;
use ic_cdk::caller;
use ic_cdk_macros::update;
use std::sync::atomic::Ordering;

use crate::user::User;
use crate::websocket::{NoteContent, Notification};

pub fn send_welcome_message() {
    dotenv::dotenv().ok();
    // let key = std::env::var("ODOC_CEO_ID").expect("ODOC_CEO_ID not found");
    let key = "tgwpc-6xuon-k3a6y-ey7lt-xksjs-qx22h-ikhbt-4yp3a-6stco-rymbe-pqe".to_string();
    let sender = Principal::from_text(key).unwrap();
    let receiver = caller();
    let chat_id = format!("{}-{}", sender.clone(), receiver.clone());
    let message: Message = Message {
        id: ic_cdk::api::time().to_string(),
        chat_id: chat_id.clone(),
        sender: sender.clone(),
        date: ic_cdk::api::time(),
        seen_by: vec![],
        message: "Welcome to Odoc. This is AliSci the founder of odoc. Would you like to share your feedback and wishes? What are the limitation/troubles in your previous workflow as employer/employee? What are bad things in Odoc now you like to improve?".to_string(),
    };
    let mut chat = Chat {
        id: chat_id.clone(),
        workspaces: vec![],
        name: "private_chat".to_string(),
        admins: vec![sender.clone(), receiver.clone()],
        members: vec![sender.clone(), receiver.clone()],
        messages: vec![message.clone()],
        creator: caller(),
    };

    let mut new_notification = Notification {
        id: chat_id,
        sender,
        receiver,
        content: NoteContent::NewMessage(message),
        is_seen: false,
        time: ic_cdk::api::time() as f64,
    };
    new_notification.send();
    chat.save();
    chat.add_to_my_chats(sender.clone());
    chat.add_to_my_chats(receiver.clone());
}

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
    let chat = Chat::get(&message.chat_id);

    match chat {
        Some(mut chat) => {
            if !(chat.members.contains(&caller()) || chat.admins.contains(&caller()) || chat.creator == caller()) {
                return Err("You are not a member of this chat.".to_string());
            }
            for member in chat.members.iter().filter(|m| m != &&caller()) {
                new_notification.receiver = *member;
                new_notification.send();
            }

            chat.messages.push(message.clone());
            chat.save();
            Ok(message.chat_id)
        }
        None => {
            if let Some(user) = user {
                let mut chat = Chat::new(user, message.chat_id.clone());
                chat.messages.push(message.clone());
                new_notification.receiver = user;
                new_notification.send();
                chat.save();
                chat.add_to_my_chats(user);
                chat.add_to_my_chats(caller());
                Ok(message.chat_id + "_New chat is created")
            } else {
                Err("Please provide a user principal or valid chat id.".to_string())
            }
        }
    }
}

#[update]
fn message_is_seen(message: Message) -> Result<(), String> {
    if let Some(mut chat) = Chat::get(&message.chat_id) {
        chat.messages = chat
            .messages
            .iter_mut()
            .map(|m| {
                // if m.id == message.id {
                //     m.seen_by.push(caller());
                // }
                if !m.seen_by.contains(&caller()) {
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
