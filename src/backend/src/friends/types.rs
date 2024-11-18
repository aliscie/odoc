use candid::{CandidType, Deserialize, Principal};
use ic_cdk::caller;

use crate::user::User;
use crate::FRIENDS_STORE;

use candid::{Decode, Encode};
use ic_stable_structures::storable::Bound;
use ic_stable_structures::Storable;
use serde::Serialize;
use std::borrow::Cow;
use std::ptr::read_unaligned;

#[derive(Eq, PartialOrd, PartialEq, Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct Friend {
    pub id: String,
    pub sender: User,
    pub receiver: User,
    pub confirmed: bool,
}

impl Storable for Friend {
    fn to_bytes(&self) -> Cow<[u8]> {
        if let Ok(bytes) = Encode!(self) {
            return Cow::Owned(bytes);
        }
        Cow::Borrowed(&[])
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        if let Ok(friend) = Decode!(bytes.as_ref(), Self) {
            return friend;
        }
        Friend {
            id: "".to_string(),
            sender: User::default(),
            receiver: User::default(),
            confirmed: false,
        }
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: 999999,
        is_fixed_size: false,
    };
}

impl Friend {
    pub fn new(sender: String, receiver: String) -> Self {
        Self {
            id: sender.clone() + &receiver.clone(),
            sender: User::get_user_from_text_principal(&sender).unwrap(),
            receiver: User::get_user_from_text_principal(&receiver).unwrap(),
            confirmed: false,
        }
    }
    pub fn get(id: &String) -> Option<Self> {
        FRIENDS_STORE.with(|friends_store| {
            let store = friends_store.borrow();
            store.get(id)
        })
    }
    pub fn delete(&self) {
        FRIENDS_STORE.with(|friends_store| {
            let mut store = friends_store.borrow_mut();
            store.remove(&self.id);
        });
    }

    pub fn get_list(user: Principal) -> Vec<Friend> {
        let mut list = vec![];
        FRIENDS_STORE.with(|friends_store| {
            let store = friends_store.borrow();
            for (key, value) in store.iter() {
                if key.contains(&user.to_text()) {
                    list.push(value.clone());
                }
            }
        });
        list
    }

    pub fn pure_save(&self) {
        FRIENDS_STORE.with(|friends_store| {
            let mut store = friends_store.borrow_mut();
            store.insert(self.id.clone(), self.clone());
        });
    }
}
