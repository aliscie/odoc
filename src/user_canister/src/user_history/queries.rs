use candid::{Deserialize, Principal};
use ic_cdk_macros::query;

use crate::{PROFILE_STORE, Wallet};
use crate::discover::UserFE;
use crate::user::User;
use crate::user_history::{Rating, UserHistory};

#[query]
fn get_user_profile(user_id: Principal) -> Result<(User, UserHistory), String> {
    let user: Option<User> = PROFILE_STORE.with(|profile_store| {
        profile_store
            .borrow()
            .get(&user_id)
            .cloned()
    });
    let mut user_profile = UserHistory::get(user_id);
    let wallet = Wallet::get(user_id);
    user_profile.total_debt = wallet.total_debt.clone();
    if let Some(user) = user {
        Ok((user, user_profile))
    } else {
        Err("User not found".to_string())
    }
}

// #[query]
// fn get_payment_cancellations(user: Principal, from: f64, to: f64) -> Vec<PaymentContract> {
//     PaymentContract::get_canceled_payments(user, from as u64, to as u64)
// }