use ic_cdk::{caller};
use candid::{CandidType, Deserialize, Principal};

use crate::{FRIENDS_STORE};
use crate::user::User;

use candid::{Decode, Encode};
use ic_stable_structures::{Storable};
use std::borrow::Cow;
use std::ptr::read_unaligned;
use ic_stable_structures::storable::Bound;

#[derive(Clone, PartialEq, Debug, Default, CandidType, Deserialize)]
pub struct Friend {
    pub sender: User,
    pub receiver: User,
    pub confirmed: bool,
}

#[derive(Clone, PartialEq, Debug, Default, CandidType, Deserialize)]
pub struct FriendVec {
    pub friends: Vec<Friend>,
}


impl Storable for FriendVec {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap_or_else(|e| {
            ic_cdk::trap(&format!("Failed to encode StoredContractVec: {:?}", e));
        }))
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap_or_else(|e| {
            ic_cdk::trap(&format!("Failed to decode StoredContractVec: {:?}", e));
        })
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: 999999,
        is_fixed_size: false,
    };
}




impl Friend {
    pub fn new(sender: String, receiver: String) -> Self {
        Self {
            sender: User::get_user_from_text_principal(&sender).unwrap(),
            receiver: User::get_user_from_text_principal(&receiver).unwrap(),
            confirmed: false,
        }
    }

    pub fn get_list(user: Principal) -> Vec<Friend> {
        let mut list = vec![];
        FRIENDS_STORE.with(|friends_store| {
            let store = friends_store.borrow();
            if let Some(friends) = store.get(&user.to_string()) {
                list = friends.friends.clone();
            }
        });
        list
    }

    // Send a friend request
    pub fn send_friend_request(user: User) -> Result<(), String> {
        // if self.clone().friend_requests.contains(&user.clone()) {
        //     return Err("Friend request already sent.".to_string());
        // }

        // let caller = User::get_user_from_text_principal(caller().to_text()).unwrap();

        FRIENDS_STORE.with(|friends_store| {
            let mut store = friends_store.borrow_mut();
            // check if the user is already a friend
            let friend: Friend = Friend::new(caller().to_text(), user.id.clone());
            let user_id = user.id.parse().unwrap();

            if store.get(&user_id).map_or(false, |friends| friends.friends.contains(&friend)) {
                // if self.friend_requests.contains(&caller) {
                // return Err("User is already a friend.".to_string());
            } else {
                let mut receiver_friends = store.get(&user.id).unwrap_or_default().friends;
                receiver_friends.push(friend.clone());
                store.insert(user_id, FriendVec { friends: receiver_friends });
                let mut caller_friends = store.get(&caller().to_text()).unwrap_or_default().friends;
                caller_friends.push(friend);
                store.insert(caller().to_text(), FriendVec { friends: caller_friends });
            }

            // store.entry(caller()).or_default().friend_requests.push(User::get_user_from_text_principal(user.id).unwrap());
            // self.friend_requests.push(user.clone());
        });

        Ok(())
    }

    // Cancel a friend request
    pub fn cancel_friend_request(f: &Friend) {
        // self.friend_requests.retain(|request| request != &friend);
        FRIENDS_STORE.with(|friends_store| {
            let mut store = friends_store.borrow_mut();
            if let Some(mut friend) = store.get(&f.receiver.id.parse().unwrap()) {
                friend.friends.retain(|request| request != f);
            }
            if let Some(mut friend) = store.get(&f.sender.id.parse().unwrap()) {
                friend.friends.retain(|request| request != f);
            }
        });
    }

    // Accept a friend request
    // pub fn accept_friend_request(&mut self, user: User) {
    //     let caller_principal = caller();
    //     // Remove the user from friend requests
    //     self.friend_requests.retain(|request| request != &user);
    //
    //     // Add the user to friends
    //     self.friends.push(user.clone());
    //
    //     FRIENDS_STORE.with(|friends_store| {
    //         let mut store = friends_store.borrow_mut();
    //         store.entry(caller_principal).or_default().friend_requests.retain(|request| request != &user);
    //         store.entry(caller_principal).or_default().friends.push(user);
    //     });
    // }


    // Unfriend a user
    pub fn unfriend(user: &User) -> Result<(), String> {
        let mut f: Friend = Friend::new(caller().to_text(), user.id.clone());
        f.confirmed = true;
        let mut f2: Friend = Friend::new(user.id.clone(), caller().to_text());
        f2.confirmed = true;
        FRIENDS_STORE.with(|friends_store| {
            let mut store = friends_store.borrow_mut();

            if let Some(mut friend_vec) = store.get(&user.id.parse().unwrap()) {
                friend_vec.friends.retain(|friend| friend != &f && friend != &f2);
            }

            if let Some(mut friend_vec) = store.get(&caller().to_text()) {
                friend_vec.friends.retain(|friend| friend != &f && friend != &f2);
            }
        });

        Ok(())
    }
}

// #[derive(Clone, PartialEq, Debug, Default, CandidType, Deserialize)]
// pub struct FriendSystem {
//     pub friend_requests: Vec<Friend>,
//     pub friends: Vec<Friend>,
// }
