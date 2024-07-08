use ic_cdk_macros::update;



use crate::user::{RegisterUser, User};

#[update]
fn register(profile: RegisterUser) -> Result<User, String> {
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
    Ok(user)
}


#[update]
fn update_user_profile(updates: RegisterUser) -> Result<User, String> {
    if User::is_anonymous() {
        return Err("Anonymous users are not allowed to register.".to_string());
    }

    let user = User::update_profile(updates.clone());
    Ok(user)
}