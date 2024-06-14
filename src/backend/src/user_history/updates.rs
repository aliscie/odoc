use candid::Principal;
use ic_cdk::caller;
use ic_cdk_macros::update;


use crate::user::{RegisterUser, User};
use crate::user_history::{Rating, UserHistory};

#[update]
fn rate_user(user: Principal, mut rating: Rating) -> Result<(), String> {
    rating.user_id = caller();
    let mut user = UserHistory::get(user);
    let res = user.rate(rating)?;
    user.calc_users_rate();
    user.save();
    Ok(())
}