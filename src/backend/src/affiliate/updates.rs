use std::borrow::Cow;
use std::collections::HashSet;

use candid::{CandidType, Decode, Deserialize, Encode, Principal};
use ic_cdk::caller;
use ic_cdk_macros::*;
use ic_cdk_macros::*;
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap, Storable, storable::Bound};
use serde::Serialize;

use crate::AFFILIATE;
use crate::affiliate::{Affiliate, ReferredUser};
// Import user history related types and traits
use crate::discover::time_diff;
use crate::user_history::UserHistory;
use crate::websocket::Notification;

// Only have this one update function as the public API
#[update]
pub fn get_affiliate_data(id: String) -> Result<Affiliate, String> {
    let mut affiliate = get_or_create_affiliate(&id)?;
    check_and_update_users(&mut affiliate)?;
    Ok(affiliate)
}

// All helper functions are private to this module
fn get_or_create_affiliate(id: &String) -> Result<Affiliate, String> {
    let affiliate = Affiliate::get(id);
    if affiliate.is_none() {
        let new_affiliate = Affiliate::register_affiliate(id.clone());
        return Ok(new_affiliate);
    }
    return Ok(affiliate.unwrap());
}

fn check_and_update_users(affiliate: &mut Affiliate) -> Result<(), String> {
    let mut total_new_payments = 0.0;
    let mut updates_needed = false;

    for user in &mut affiliate.users {
        if let Ok(user_principal) = Principal::from_text(&user.id) {
            if let Some(payment) = process_user(&user_principal, user) {
                total_new_payments += payment;
                updates_needed = true;
            }
        }
    }

    if total_new_payments > 0.0 {
        affiliate.add_payment(total_new_payments);
    }

    if updates_needed {
        affiliate.update_trusted_users()?;
        affiliate.save()
    }

    Ok(())
}

fn process_user(principal: &Principal, user: &mut ReferredUser) -> Option<f64> {
    let user_history = UserHistory::get(*principal);
    user.trust_score = user_history.actions_rate;

    if user_history.actions_rate >= 3.0 {
        let mut should_pay = false;

        if !user.verified {
            user.verified = true;
            should_pay = true;
        }

        if !user.payment_processed {
            user.payment_processed = true;
            should_pay = true;
            return Some(Affiliate::TRUSTED_USER_REWARD);
        }
    }
    None
}

pub fn add_new_referral(affiliate_id: String, user_id: String) -> Result<(), String> {
    let caller_id = caller().to_text();
    let mut affiliate = Affiliate::get(&affiliate_id).ok_or("affiliate_id not found")?;
    if affiliate.users.iter().any(|user| user.id == user_id) {
        return Err("User already referred".to_string());
    }
    affiliate.add_referral_with_trust();
    Ok(())
}
