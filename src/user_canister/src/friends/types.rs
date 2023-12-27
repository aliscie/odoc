use ic_cdk::{caller};
use candid::{CandidType, Deserialize, Principal};

use crate::{FRIENDS_STORE};
use crate::user::User;

#[derive(Clone, Debug, Default, CandidType, Deserialize)]
pub struct Friend {
    pub friend_requests: Vec<User>,
    pub friends: Vec<User>,
}

//
impl Friend {
    // Get friends of the current caller
    pub fn get_friends_of_caller() -> Option<Friend> {
        FRIENDS_STORE.with(|friends_store| {
            let store = friends_store.borrow();
            return store.get(&caller()).cloned();
        })
    }

    pub fn get_friends_of_user(user: Principal) -> Option<Friend> {
        FRIENDS_STORE.with(|friends_store| {
            let store = friends_store.borrow();
            return store.get(&user).cloned();
        })
    }

    // Send a friend request
    pub fn send_friend_request(&mut self, user: User) -> Result<(), String> {
        if self.clone().friend_requests.contains(&user.clone()) {
            return Err("Friend request already sent.".to_string());
        }

        FRIENDS_STORE.with(|friends_store| {
            let mut store = friends_store.borrow_mut();
            store.entry(user.id.parse().unwrap()).or_default().friend_requests.push(User::get_user_from_text_principal(caller().to_text()).unwrap());
            store.entry(caller()).or_default().friend_requests.push(User::get_user_from_text_principal(user.id).unwrap());
            // self.friend_requests.push(user.clone());
        });
        Ok(())
    }

    // Cancel a friend request
    pub fn cancel_friend_request(&mut self, user: &User) {
        self.friend_requests.retain(|request| request != user);
        FRIENDS_STORE.with(|friends_store| {
            let mut store = friends_store.borrow_mut();
            if let Some(friend) = store.get_mut(&caller()) {
                friend.friend_requests.retain(|request| request != user);
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
    pub fn unfriend(&mut self, user: &User) {
        FRIENDS_STORE.with(|friends_store| {
            let mut store = friends_store.borrow_mut();
            if let Some(friend) = store.get_mut(&caller()) {
                friend.friends.retain(|friend| friend != user);
            };
            // also retain for self.friends
            if let Some(friend) = store.get_mut(&user.id.parse().unwrap()) {
                friend.friends.retain(|friend| friend != &User::get_user_from_principal(caller()).unwrap());
            };
        });
    }
}
