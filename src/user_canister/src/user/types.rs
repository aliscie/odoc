use ic_cdk::{caller};
use candid::{CandidType, Deserialize, Principal};

// export::{
//     candid::{CandidType, Deserialize},
//     Principal,
// }

use crate::{PROFILE_STORE};

#[derive(Eq, PartialOrd, PartialEq, Clone, Debug, Default, CandidType, Deserialize)]
pub struct User {
    pub id: String,
    pub name: String,
    pub description: String,
    pub photo: Vec<u8>,
    // pub total_promise: f64,
    //  pub total_balance: f64
    // pub keywords: Vec<String>,
}

#[derive(Clone, Debug, Default, CandidType, Deserialize)]
pub struct RegisterUser {
    pub name: Option<String>,
    pub description: Option<String>,
    pub photo: Option<Vec<u8>>,
    // pub keywords: Vec<String>,
}

impl User {
    pub fn new(profile: RegisterUser) -> Self {
        let user = User { id: caller().to_text(), name: profile.clone().name.unwrap().clone(), description: profile.description.unwrap().clone(), photo: profile.photo.unwrap() };
        let principal_id = ic_cdk::api::caller();

        // ID_STORE.with(|id_store| {
        //     id_store
        //         .borrow_mut()
        //         .insert(profile.name.unwrap().clone(), principal_id);
        // });
        PROFILE_STORE.with(|profile_store| {
            profile_store.borrow_mut().insert(principal_id, user.clone());
        });

        user
    }
    pub fn principal(self: &Self) -> Principal {
        Principal::from_text(self.id.clone()).unwrap()
    }
    // Get a user from their principal
    pub fn get_user_from_text_principal(principal_str: &String) -> Option<User> {
        let principal = Principal::from_text(principal_str).ok()?;
        PROFILE_STORE.with(|profile_store| {
            let store = profile_store.borrow();
            store.get(&principal).cloned()
        })
    }


    pub fn get_user_from_principal(id: Principal) -> Option<User> {
        PROFILE_STORE.with(|profile_store| {
            let store = profile_store.borrow();
            store.get(&id).cloned()
        })
    }


    pub fn user_id() -> Principal {
        ic_cdk::api::id()
    }
    pub fn user_profile() -> Option<Self> {
        let principal_id = ic_cdk::api::caller();

        // if caller is anonymous return None
        if principal_id.to_text() == *"2vxsx-fae" {
            return None;
        }

        // get and if it is not exist then create user profile
        let user: Option<User> = PROFILE_STORE.with(|profile_store| {
            profile_store
                .borrow()
                .get(&principal_id)
                .cloned()
        });
        // if user.is_none() {
        //     let user = User::new(RegisterUser {
        //         name: "Anonymous".to_string(),
        //         description: "Anonymous".to_string(),
        //     });
        //     return Some(user);
        // }
        user
    }

    pub fn update_profile(profile: RegisterUser) -> Self {
        let mut user = User::user_profile().unwrap();
        if let Some(name) = profile.name {
            user.name = name;
        }

        if let Some(description) = profile.description {
            user.description = description;
        }

        if let Some(photo) = profile.photo {
            user.photo = photo;
        }

        PROFILE_STORE.with(|profile_store| {
            profile_store.borrow_mut().insert(caller(), user.clone());
        });
        user
    }

    pub fn user_is_registered() -> bool {
        let principal_id = ic_cdk::api::caller();
        let user: Option<User> = PROFILE_STORE.with(|profile_store| {
            profile_store
                .borrow()
                .get(&principal_id)
                .cloned()
        });
        user.is_some()
    }

    pub fn user_name_is_duplicate(name: String) -> bool {
        PROFILE_STORE.with(|profile_store| {
            profile_store.borrow().values().any(|user| {
                user.id != caller().to_text() && user.name == name
            })
        })
    }
    pub fn is_anonymous() -> bool {
        let principal_id = ic_cdk::api::caller();
        principal_id.to_text() == *"2vxsx-fae"
    }
}