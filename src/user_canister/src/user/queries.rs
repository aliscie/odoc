use std::collections::HashMap;
use candid::types::principal::PrincipalError;


use ic_cdk_macros::query;

use crate::{Exchange, PROFILE_STORE};
use crate::user::User;
use candid::{CandidType, Deserialize, Principal};

//
// #[query(name = "getSelf")]
// fn get_self() -> Profile {
//     let id = ic_cdk::api::caller();
//     PROFILE_STORE.with(|profile_store| {
//         profile_store
//             .borrow()
//             .get(&id)
//             .cloned().unwrap_or_default()
//     })
// }
//
//
// #[query]
// fn get(name: String) -> Profile {
//     ID_STORE.with(|id_store| {
//         PROFILE_STORE.with(|profile_store| {
//             id_store
//                 .borrow()
//                 .get(&name)
//                 .and_then(|id| profile_store.borrow().get(id).cloned()).unwrap_or_default()
//         })
//     })
// }

//
// #[query(manual_reply = true)]
// fn search(text: String) -> ManualReply<Option<Profile>> {
//     let text = text.to_lowercase();
//     PROFILE_STORE.with(|profile_store| {
//         for (_, p) in profile_store.borrow().iter() {
//             if p.name.to_lowercase().contains(&text) || p.description.to_lowercase().contains(&text)
//             {
//                 return ManualReply::one(Some(p));
//             }
//
//             // for x in p.keywords.iter() {
//             //     if x.to_lowercase() == text {
//             //         return ManualReply::one(Some(p));
//             //     }
//             // }
//         }
//         ManualReply::one(None::<Profile>)
//     })
// }

// get all users


#[query]
fn get_all_users() -> HashMap<String, User> {
    PROFILE_STORE.with(|profile_store| {
        profile_store
            .borrow()
            .iter()
            .map(|(principal, user)| (principal.clone(), user.clone()))
            .map(|(principal, user)| (principal.to_string(), user))
            .collect()
    })
}



#[derive(Eq, PartialOrd, PartialEq, Clone, Debug, Default, CandidType, Deserialize)]
pub struct UserProfile {
    pub id: String,
    pub name: String,
    pub description: String,
    pub photo: Vec<u8>,
    // pub exchanges: Exchange,
    // pub rate: u64,
    // pub cancellations: u64,
    // pub interactions: u64,
    // pub USDCSpent: u64,
    // pub KYC: KYC,
    // pub USDCReceived: u64,
}

#[query]
fn get_user(usd_id: String) -> Result<UserProfile, String> {
    let user: Result<Principal, PrincipalError> = Principal::from_text(usd_id);

    if user.is_err() {
        return Err("Invalid principal.".to_string());
    };

    let user: Option<User> = PROFILE_STORE.with(|profile_store| {
        profile_store
            .borrow()
            .get(&user.unwrap())
            .cloned()
    });

    if let Some(user) = user {
        return Ok(UserProfile{
            id: user.id.to_string(),
            name: user.name.to_string(),
            description: user.description.to_string(),
            photo: user.photo.clone(),
            // exchanges: user.exchanges.clone(),
            // keywords: user.keywords.clone(),
        });
    }
    Err("User not found.".to_string())
}


