use ic_cdk::{caller};
use candid::{CandidType, Deserialize, Principal};

use crate::{FRIENDS_STORE};
use crate::user::User;


#[derive(Clone, PartialEq, Debug, Default, CandidType, Deserialize)]
pub struct Friend {
    pub sender: User,
    pub receiver: User,
    pub confirmed: bool,
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
        FRIENDS_STORE.with(|friends_store| {
            let store = friends_store.borrow();
            store.get(&user).cloned().unwrap_or(vec![])
        })
    }

    // Send a friend request
    pub fn send_friend_request( user: User) -> Result<(), String> {
        // if self.clone().friend_requests.contains(&user.clone()) {
        //     return Err("Friend request already sent.".to_string());
        // }

        // let caller = User::get_user_from_text_principal(caller().to_text()).unwrap();
        FRIENDS_STORE.with(|friends_store| {
            let mut store = friends_store.borrow_mut();
            // check if the user is already a friend
            let friend: Friend = Friend::new(caller().to_text(), user.id.clone());
            if store.entry(user.id.parse().unwrap()).or_default().contains(&friend) {
                // if self.friend_requests.contains(&caller) {
                // return Err("User is already a friend.".to_string());
            } else {
                store.entry(user.id.parse().unwrap()).or_default().push(friend.clone());
                store.entry(caller()).or_default().push(friend);
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
            if let Some(friend) = store.get_mut(&f.receiver.id.parse().unwrap()) {
                friend.retain(|request| request != f);
            }
            if let Some(friend) = store.get_mut(&f.sender.id.parse().unwrap()) {
                friend.retain(|request| request != f);
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

            if let Some(friend) = store.get_mut(&user.id.parse().unwrap()) {
                friend.retain(|friend| friend != &f && friend != &f2);
            }

            if let Some(friend) = store.get_mut(&caller()) {
                friend.retain(|friend| friend != &f && friend != &f2);
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