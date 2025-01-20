use std::borrow::Cow;
use std::collections::HashSet;
use candid::{CandidType, Decode, Deserialize, Encode, Principal};
use ic_cdk::caller;
use ic_cdk_macros::*;
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap, Storable, storable::Bound};
use serde::Serialize;

// Import user history related types and traits
use crate::discover::time_diff;
use crate::websocket::Notification;
// use crate::{CPayment, PaymentStatus, Wallet, PROFILE_HISTORY, AFFILIATE};
// use crate::wallet::{CPayment};

use crate::user_history::UserHistory;
use crate::AFFILIATE;

#[derive(PartialOrd, PartialEq, Clone, Debug, Default, Serialize, CandidType, Deserialize)]
pub struct ReferralPayments {
    pub amount: f64,
    pub date_created: f64,
}

#[derive(PartialOrd, PartialEq, Clone, Debug, Default, Serialize, CandidType, Deserialize)]
pub struct ReferredUser {
    pub id: String,
    pub verified: bool,
    pub payment_processed: bool,
    // Track if affiliate payment has been processed
    pub trust_score: f64,        // Store the user's trust score
}

#[derive(PartialOrd, PartialEq, Clone, Debug, Default, Serialize, CandidType, Deserialize)]
pub struct AffiliateStats {
    pub total_referrals: u64,
    pub total_earnings: f64,
    pub trusted_users: u64,
}

#[derive(PartialOrd, PartialEq, Clone, Debug, Default, Serialize, CandidType, Deserialize)]
pub struct Affiliate {
    pub id: String,
    pub users: Vec<ReferredUser>,
    pub earnings: Vec<ReferralPayments>,
    pub stats: AffiliateStats,
}


impl Storable for Affiliate {
    fn to_bytes(&self) -> Cow<[u8]> {
        if let Ok(bytes) = Encode!(self) {
            return Cow::Owned(bytes);
        }
        Cow::Borrowed(&[])
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}


impl Affiliate {
    // Define the reward amount for each trusted user
    pub const TRUSTED_USER_REWARD: f64 = 10.0;
    // Adjust this value as needed
    pub fn get(id: &String) -> Option<Self> {
        AFFILIATE.with(|store| {
            let mut store = store.borrow_mut();
            store.get(id)
        })
    }
    pub fn save(&self) {
        AFFILIATE.with(|store| {
            let mut store = store.borrow_mut();
            store.insert(self.id.clone(), self.clone());
        });
    }


    // Register a new affiliate
    pub fn register_affiliate(id: String) -> Self {
        let caller_id = caller().to_text();

        let affiliate = Affiliate {
            id: caller_id.clone(),
            users: Vec::new(),
            earnings: Vec::new(),
            stats: AffiliateStats {
                total_referrals: 0,
                total_earnings: 0.0,
                trusted_users: 0,
            },
        };

        // Save only once at the end
        affiliate.save();
        affiliate
    }


    // Calculate and update the number of trusted users, process payments for newly trusted users
    pub fn update_trusted_users(&mut self) -> Result<(), String> {
        let mut trusted_count = 0;
        let mut total_new_payments = 0.0;

        for referred_user in &mut self.users {
            if let Ok(user_principal) = Principal::from_text(&referred_user.id) {
                let user_history = UserHistory::get(user_principal);
                referred_user.trust_score = user_history.actions_rate;

                if user_history.actions_rate >= 3.0 {
                    trusted_count += 1;
                    if !referred_user.payment_processed {
                        total_new_payments += Self::TRUSTED_USER_REWARD;
                        referred_user.payment_processed = true;
                    }
                }
            }
        }

        self.stats.trusted_users = trusted_count;

        if total_new_payments > 0.0 {
            self.add_payment_internal(total_new_payments);
        }

        Ok(())
    }


    // Internal version without storage updates
    fn add_payment_internal(&mut self, amount: f64) {
        let payment = ReferralPayments {
            amount,
            date_created: ic_cdk::api::time() as f64 / 1_000_000_000.0,
        };
        self.earnings.push(payment);
        self.stats.total_earnings += amount;
    }

    // Public version with storage update
    pub fn add_payment(&mut self, amount: f64) {
        self.add_payment_internal(amount);
        self.save();
    }

    pub fn add_referral_with_trust(&mut self) {
        let caller_principal = caller();
        let new_referral = ReferredUser {
            id: caller_principal.to_text(),
            verified: false,
            payment_processed: false,
            trust_score: 0.0,
        };

        self.users.push(new_referral);
        self.stats.total_referrals += 1;

        // Update state first
        self.update_trusted_users().unwrap_or_else(|e| ic_cdk::trap(&e));

        // Save only once at the end
        self.save();
    }
    // Add a new referral with trust calculation

    // Calculate total earnings
    pub fn total_earnings(&self) -> f64 {
        self.earnings.iter().map(|payment| payment.amount).sum()
    }

    // Get number of referrals
    pub fn referral_count(&self) -> usize {
        self.users.len()
    }
}
