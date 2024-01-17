use candid::Principal;
use ic_cdk::caller;
use ic_cdk_macros::update;
use crate::chat::{Chat, Message};


use crate::user::User;
use crate::websocket::{NoteContent, Notification};


#[update]
fn send_message(user: Option<Principal>, mut message: Message) -> Result<String, String> {
    if User::is_anonymous() {
        return Err("You are anonymous".to_string());
    }
    // handle notifications
    let content = NoteContent::NewMessage(message.id.clone());
    let new_notification = Notification {
        id: message.id.clone(),
        sender: caller(),
        receiver: user.unwrap_or("2vxsx-fae".parse().unwrap()), // todo fix this create custom chat principal for group chats.
        content,
        is_seen: false,
    };

    // handle chat message
    message.date = ic_cdk::api::time() as u64;
    let chat = Chat::get(&message.chat_id);
    if let Some(mut chat) = chat {

        // permissions
        if !(chat.members.contains(&caller()) || chat.admins.contains(&caller()) || (chat.creator == caller())) {
            return Err("You are not a member of this chat.".to_string());
        }


        chat.messages.push(message.clone());
        chat.save();

        new_notification.send_to(
            Principal::from_text(chat.id.clone()).unwrap()
        );
        Ok(message.id)
    } else if let Some(user) = user {
        let mut chat = Chat::get_by_user(user);
        if chat.is_none() {
            chat = Some(Chat::new(user));
        }
        let mut chat = chat.unwrap();
        message.chat_id = chat.id.clone();
        chat.messages.push(message.clone());
        chat.save();
        chat.add_to_my_chats(user);
        chat.add_to_my_chats(caller());
        // new_notification.send_to(
        //     Principal::from_text(chat.id.clone()).unwrap()
        // ); // handle groups chats
        new_notification.send_to(user);
        Ok(message.id)
    } else {
        Err("Please provide a user principal or valid chat id.".to_string())
    }
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