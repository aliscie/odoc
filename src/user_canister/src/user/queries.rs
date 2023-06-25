use std::collections::HashMap;

use candid::{candid_method, Principal};
use ic_cdk::api::call::ManualReply;
use ic_cdk_macros::query;

use crate::{ID_STORE, PROFILE_STORE};
use crate::user::User;

// #[candid_method(query)]
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
// #[candid_method(query)]
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

// #[candid_method(query)]
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

#[candid_method(query)]
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
