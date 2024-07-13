use std::sync::atomic::Ordering;

use candid::{CandidType, Deserialize, Principal};
use ic_cdk::caller;
use serde::Serialize;

use crate::{CHATS, MY_CHATS};
use crate::COUNTER;
use crate::storage_schema::MyChatsStore;
use crate::websocket::{NoteContent, Notification};

#[derive(Clone, Debug, Deserialize, CandidType)]
pub struct Chat {
    pub id: String,
    pub name: String,
    // this used only for groups
    pub admins: Vec<Principal>,
    // for private chats both users are admonish and members will be empty
    pub members: Vec<Principal>,
    // this used only for groups
    pub messages: Vec<Message>,
    pub creator: Principal,
    pub workspace: String, // TODO We may not need this field
}

#[derive(Eq, PartialEq, Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct Message {
    pub id: String,
    pub sender: Principal,
    pub chat_id: String,
    pub message: String,
    pub date: u64,
    pub seen_by: Vec<Principal>,
}

impl Chat {
    pub fn new(user: Principal, id: String) -> Self {
        CHATS.with(|store| {
            let mut chats = store.borrow_mut();
            let chat = Chat {
                id,
                workspace: "".to_string(),
                name: "private_chat".to_string(),
                admins: vec![user],
                members: vec![],
                messages: vec![],
                creator: caller(),
            };
            chats.push(chat.clone());
            chat
        })
    }

    pub fn get(id: &str) -> Option<Self> {
        CHATS.with(|store| {
            let chats = store.borrow();
            chats.iter().find(|c| c.id == id).cloned()
        })
    }

    pub fn get_by_user(user: Principal) -> Option<Self> {
        CHATS.with(|store| {
            let chats = store.borrow();
            // both caller and user are in admins
            chats.iter().find(|c| c.admins.contains(&user) & c.admins.contains(&caller())).cloned()
        })
    }

    pub fn save(&self) -> Self {
        CHATS.with(|store| {
            let mut chats = store.borrow_mut();
            // push the new chat if chat.id not exists in chats
            let chat = chats.iter_mut().find(|c| c.id == self.id);
            if chat.is_none() {
                chats.push(self.clone());
            } else {
                let mut chat = chat.unwrap();
                chat.name = self.name.clone();
                chat.admins = self.admins.clone();
                chat.members = self.members.clone();
                chat.messages = self.messages.clone();
                chat.creator = self.creator.clone();
            }
            self.clone()
        })
    }

    // pub fn send_message(&self, message: Message) -> Self {
    //     CHATS.with(|store| {
    //         let mut chats = store.borrow_mut();
    //         let mut chat = chats.iter_mut().find(|c| c.id == self.id).unwrap();
    //         chat.messages.push(message);
    //         chat.clone()
    //     })
    // }

    pub fn get_chats() -> Vec<Chat> {
        CHATS.with(|store| {
            let chats = store.borrow();
            chats.clone()
        })
    }

    pub fn get_my_chats() -> Vec<Chat> {
        CHATS.with(|store| {
            let my_chats_ids = MY_CHATS.with(|my_chats_store| {
                my_chats_store.borrow().get(&caller()).unwrap_or(&vec![]).clone()
            });

            let chats = store.borrow();
            my_chats_ids
                .iter()
                .filter_map(|id| chats.iter().find(|c| c.id == *id).cloned())
                .collect()
        })
    }

    pub fn add_to_my_chats(&self, user: Principal) {
        MY_CHATS.with(|store| {
            let mut my_chats = store.borrow_mut();
            // get user or insert empty vec
            let mut my_chats_store = my_chats.entry(user).or_default().clone();
            if !my_chats_store.contains(&self.id) {
                my_chats_store.push(self.id.clone());
                my_chats.insert(user, my_chats_store);
            }
        })
    }
    pub fn remove_from_my_chats(&self, user: Principal) {
        MY_CHATS.with(|store| {
            let mut my_chats = store.borrow_mut();
            // get user or insert empty vec
            let mut my_chats_store = my_chats.entry(user).or_default().clone();
            if my_chats_store.contains(&self.id) {
                my_chats_store.retain(|id| id != &self.id);
                my_chats.insert(user, my_chats_store);
            }
        });
        let content = NoteContent::RemovedFromChat(self.id.clone());
        let new_notification = Notification {
            id: self.id.clone(),
            sender: caller(),
            receiver: user,
            content,
            is_seen: false,
            time: ic_cdk::api::time() as f64,
        };
        new_notification.save();
    }

    pub fn get_notifications() -> Vec<Message> {
        // TODO order by message.date
        let mut messages = vec![];
        let my_chats = Chat::get_my_chats();
        for chat in my_chats {
            if let Some(message) = chat.messages.last() {
                messages.push(message.clone());
            }
        };
        messages
    }
}


