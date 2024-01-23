use candid::Principal;
use ic_cdk_macros::update;


use crate::user::{RegisterUser, User};
use crate::user_history::{Rating, UserHistory};

#[update]
fn rate_user(user: Principal, rating: Rating) -> Result<(), String> {
    let mut user = UserHistory::get(user);
    user.rate(rating)?;
    user.calc_total_rate();
    Ok(())
}