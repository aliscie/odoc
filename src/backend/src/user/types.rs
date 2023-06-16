use ic_cdk::{
    api::call::ManualReply,
    export::{
        candid::{CandidType, Deserialize},
        Principal,
    },
};
use crate::{ID_STORE, PROFILE_STORE};

#[derive(Clone, Debug, Default, CandidType, Deserialize)]
pub struct User {
    pub name: String,
    pub description: String,
    // pub keywords: Vec<String>,
}

#[derive(Clone, Debug, Default, CandidType, Deserialize)]
pub struct RegisterUser {
    pub name: String,
    pub description: String,
    // pub keywords: Vec<String>,
}

impl User {
    pub fn new(profile: RegisterUser) -> Self {
        let user = User { name: profile.name.clone(), description: profile.description.clone() };
        let principal_id = ic_cdk::api::caller();

        ID_STORE.with(|id_store| {
            id_store
                .borrow_mut()
                .insert(profile.name.clone(), principal_id);
        });
        PROFILE_STORE.with(|profile_store| {
            profile_store.borrow_mut().insert(principal_id, user.clone());
        });

        user
    }
    pub fn user_id() -> Principal {
        ic_cdk::api::id()
    }
    pub fn user_profile() -> Option<Self> {
        let principal_id = ic_cdk::api::caller();
        PROFILE_STORE.with(|profile_store| {
            profile_store
                .borrow()
                .get(&principal_id)
                .cloned()
        })
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
        let user: Option<User> = ID_STORE.with(|id_store| {
            PROFILE_STORE.with(|profile_store| {
                id_store
                    .borrow()
                    .get(&name)
                    .and_then(|id| profile_store.borrow().get(id).cloned())
            })
        });
        user.is_some()
    }
    pub fn user_is_anonymous() -> bool {
        let principal_id = ic_cdk::api::caller();
        principal_id.to_text() == *"2vxsx-fae"
    }
}