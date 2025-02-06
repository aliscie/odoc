use ic_cdk::caller;
use ic_cdk_macros::update;
use crate::affiliate::add_new_referral;
use crate::chat::send_welcome_message;

use crate::user::{RegisterUser, User};

#[update]
fn register(affiliate_id: String, profile: RegisterUser) -> Result<User, String> {
    if User::is_anonymous() {
        return Err("Anonymous users are not allowed to register.".to_string());
    }

    if let Some(user) = User::user_profile() {
        return Ok(user);
    }

    if User::user_name_is_duplicate(profile.clone().name.unwrap().clone()) {
        return Err("Name already exists please try another name.".to_string());
    }

    let user = User::new(profile.clone());
    let _ = add_new_referral(affiliate_id, caller().to_text());
    send_welcome_message();
    Ok(user)
}

#[update]
fn update_user_profile(updates: RegisterUser) -> Result<User, String> {
    if User::is_anonymous() {
        return Err("Anonymous users are not allowed to register.".to_string());
    }


    if User::user_name_is_duplicate(updates.clone().name.unwrap().clone()) {
        return Err("Name already exists please try another name.".to_string());
    }

    let user = User::update_profile(updates.clone());
    Ok(user)
}
