use std::collections::HashMap;
use candid::types::principal::PrincipalError;


use ic_cdk_macros::query;
use candid::{CandidType, Deserialize, Principal};
use crate::{PaymentContract, PROFILE_STORE};
use crate::discover::UserFE;
use crate::user::User;
use crate::user_history::{ActionRating, Rating, UserHistory};


// TODO
#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct RatingFE {
    pub id: String,
    pub rating: f64,
    pub comment: String,
    pub user: UserFE,
    // user_id==the user who did the rating
    pub date: f64,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct UserHistoryFE {
    pub id: Principal,
    // payment bad marks
    pub total_payments_cancellation: f64,
    pub latest_payments_cancellation: Vec<PaymentContract>,

    // payments good mark
    pub spent: f64,
    pub users_interactions: f64,
    pub transactions_sent: f64,
    pub transactions_received: f64,

    // shares bad marks
    pub shares_changes_rejects: f64,

    // shares good marks
    pub shares_changes_accepts: f64,
    pub received_shares_payments: f64,

    // custom contracts good mark
    // custom contracts bad marks


    pub shares_change_request: f64,

    // only the shares between at least two people that got approved by both
    pub rates_by_others: Vec<RatingFE>,
    pub rates_by_actions: Vec<ActionRating>,
    pub total_rate: f64,
    // CUSTOm contract field will be calculated later
}


impl From<UserHistory> for UserHistoryFE {
    fn from(original: UserHistory) -> Self {
        let rates_by_others: Vec<RatingFE> = original.rates_by_others.iter().map(|r| {
            RatingFE {
                id: r.id.clone(),
                rating: r.rating,
                comment: r.comment.clone(),
                user: UserFE::from(r.user_id),
                date: r.date as f64,
            }
        }).collect();

        Self {
            id: original.id,
            total_payments_cancellation: original.total_payments_cancellation,
            latest_payments_cancellation: original.latest_payments_cancellation,
            spent: original.spent,
            users_interactions: original.users_interactions,
            transactions_sent: original.transactions_sent,
            transactions_received: original.transactions_received,
            shares_changes_rejects: original.shares_changes_rejects,
            shares_changes_accepts: original.shares_changes_accepts,
            received_shares_payments: original.received_shares_payments,
            shares_change_request: original.shares_change_request,
            rates_by_others,
            rates_by_actions: original.rates_by_actions,
            total_rate: original.total_rate,
        }
    }
}

#[query]
fn get_user_profile(user_id: Principal) -> Result<(User, UserHistoryFE), String> {
    let user: Option<User> = PROFILE_STORE.with(|profile_store| {
        profile_store
            .borrow()
            .get(&user_id)
            .cloned()
    });
    let mut user_profile = UserHistory::get(user_id);
    let total_canceled_payments = PaymentContract::get_canceled_payments(user_id, 0, 99999999).len() as f64;
    let latest_canceled_payments = PaymentContract::get_latest_canceled_payments(user_id, 0, 50);
    user_profile.latest_payments_cancellation = latest_canceled_payments;
    user_profile.total_payments_cancellation = total_canceled_payments;
    return Ok((user.unwrap(), UserHistoryFE::from(user_profile)));
}

#[query]
fn get_payment_cancellations(user: Principal, from: f64, to: f64) -> Vec<PaymentContract> {
    PaymentContract::get_canceled_payments(user, from as u64, to as u64)
}