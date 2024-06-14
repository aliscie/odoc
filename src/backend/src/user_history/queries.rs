use candid::{Deserialize, Principal};
use candid::CandidType;
use ic_cdk_macros::query;

use crate::{PROFILE_STORE, Wallet};
use crate::discover::UserFE;
use crate::user::User;
use crate::user_history::{ActionRating, Rating, UserHistory};

#[derive(CandidType)]
pub struct UserProfile {
    pub id: Principal,
    pub name: String,
    pub photo: Vec<u8>,
    pub description: String,
    pub users_interacted: f64,
    pub rates_by_others: Vec<Rating>,
    pub rates_by_actions: Vec<ActionRating>,
    pub actions_rate: f64,
    pub users_rate: f64,
    pub balance: f64,
    pub debts: Vec<String>,
    pub total_debt: f64,
    pub spent: f64,
    pub received: f64,

}


#[query]
fn get_user_profile(user_id: Principal) -> Result<UserProfile, String> {
    let user: Option<User> = PROFILE_STORE.with(|profile_store| {
        profile_store
            .borrow()
            .get(&user_id)
            .cloned()
    });
    let mut user_profile = UserHistory::get(user_id);
    let wallet = Wallet::get(user_id);
    if let Some(user) = user {
        Ok(UserProfile {
            id: Principal::from_text(&user.id).unwrap(),
            name: user.name,
            photo: user.photo,
            description: user.description,
            users_interacted: user_profile.users_interacted.len() as f64,
            rates_by_others: user_profile.rates_by_others,
            rates_by_actions: user_profile.rates_by_actions,
            actions_rate: user_profile.actions_rate,
            users_rate: user_profile.users_rate,
            balance: wallet.balance,
            debts: wallet.debts.keys().cloned().collect(),
            total_debt: wallet.total_debt,
            spent: wallet.spent,
            received: wallet.received,
        })
    } else {
        Err("User not found".to_string())
    }
}

// #[query]
// fn get_payment_cancellations(user: Principal, from: f64, to: f64) -> Vec<PaymentContract> {
//     PaymentContract::get_canceled_payments(user, from as u64, to as u64)
// }