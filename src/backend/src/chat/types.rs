use std::borrow::Cow;
use std::sync::atomic::Ordering;

use candid::{CandidType, Decode, Deserialize, Encode, Principal};
use ic_cdk::caller;
use ic_stable_structures::storable::Bound;
use ic_stable_structures::Storable;
use serde::Serialize;

use crate::storage_schema::MyChatsStore;
use crate::websocket::{NoteContent, Notification};
use crate::COUNTER;
use crate::{CHATS, MY_CHATS};

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
    pub workspaces: Vec<String>, // TODO We may not need this field
}

#[derive(Clone, Debug, Deserialize, CandidType, Default)]
pub struct ChatsIdVec {
    pub chats: Vec<String>,
}

impl Storable for ChatsIdVec {
    fn to_bytes(&self) -> Cow<[u8]> {
        if let Ok(bytes) = Encode!(self) {
            return Cow::Owned(bytes);
        }
        Cow::Borrowed(&[])
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

impl Storable for Chat {
    fn to_bytes(&self) -> Cow<[u8]> {
        if let Ok(bytes) = Encode!(self) {
            return Cow::Owned(bytes);
        }
        Cow::Borrowed(&[])
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
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
                workspaces: vec![],
                name: "private_chat".to_string(),
                admins: vec![user],
                members: vec![user],
                messages: vec![],
                creator: caller(),
            };
            chats.insert(chat.id.clone(), chat.clone());
            chat
        })
    }

    pub fn get(id: &str) -> Option<Self> {
        CHATS.with(|store| {
            let chats = store.borrow();
            chats
                .iter()
                .find(|(chat_id, chat)| chat.id == id)
                .map(|(_, chat)| chat.clone())
        })
    }

    pub fn get_by_user(user: Principal) -> Option<Self> {
        CHATS.with(|store| {
            let chats = store.borrow();
            chats
                .iter()
                .find(|(_, chat)| chat.admins.contains(&user) && chat.admins.contains(&caller()))
                .map(|(_, chat)| chat.clone())
        })
    }

    pub fn save(&self) -> Self {
        CHATS.with(|store| {
            let mut chats = store.borrow_mut();
            if let Some(mut chat) = chats.get(&self.id) {
                chat.name = self.name.clone();
                chat.admins = self.admins.clone();
                chat.members = self.members.clone();
                chat.messages = self.messages.clone();
                chat.creator = self.creator.clone();
                chat.workspaces = self.workspaces.clone();
            } else {
                chats.insert(self.id.clone(), self.clone());
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
            chats
                .iter()
                .map(|(_, chat)| chat.clone())
                .collect::<Vec<Chat>>()
        })
    }

    pub fn get_my_chats() -> Vec<Chat> {
        CHATS.with(|store| {
            let my_chats_ids = MY_CHATS.with(|my_chats_store| {
                my_chats_store
                    .borrow()
                    .get(&caller().to_text())
                    .unwrap_or_else(|| ChatsIdVec { chats: vec![] })
                    .clone()
            });

            let chats = store.borrow();
            my_chats_ids
                .chats
                .iter()
                .filter_map(|id| chats.get(id))
                .collect::<Vec<Chat>>()
        })
    }

    pub fn add_to_my_chats(&self, user: Principal) {
        MY_CHATS.with(|store| {
            let mut my_chats = store.borrow_mut();
            // get user or insert empty vec
            let mut my_chats_store = my_chats
                .get(&user.to_string())
                .unwrap_or_else(|| ChatsIdVec { chats: vec![] })
                .clone();
            if !my_chats_store.chats.contains(&self.id) {
                my_chats_store.chats.push(self.id.clone());
                my_chats.insert(user.to_string(), my_chats_store);
            }
        })
    }

    pub fn delete(&self) -> Result<String, String> {
        CHATS.with(|store| {
            let mut chats = store.borrow_mut();
            chats.remove(&self.id);
        });
        Ok("chat deleted".to_string())
    }

    pub fn remove_from_my_chats(&self, user: Principal) {
        MY_CHATS.with(|store| {
            let mut my_chats = store.borrow_mut();
            // get user or insert empty vec
            let mut my_chats_store = my_chats.get(&user.to_string()).unwrap_or_default().clone();
            if my_chats_store.chats.contains(&self.id) {
                my_chats_store.chats.retain(|id| id != &self.id);
                my_chats.insert(user.to_string(), my_chats_store);
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
        }
        messages
    }
}
