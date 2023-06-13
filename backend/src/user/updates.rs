use ic_cdk_macros::update;
use candid::candid_method;
use crate::{ID_STORE, PROFILE_STORE};
use crate::user::{RegisterUser, User};

#[update]
#[candid_method(update)]
fn register(profile: RegisterUser) -> Result<User, String> {
    if User::user_is_anonymous() {
        return Err("Anonymous users are not allowed to register.".to_string());
    }

    if let Some(user) = User::user_profile() {
        return Ok(user);
    }

    if User::user_name_is_duplicate(profile.name.clone()) {
        return Err("Name already exists please try another name.".to_string());
    }

    User::new(profile.clone());
    Ok(User { name: profile.name, description: profile.description })
}
