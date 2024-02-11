use std::collections::HashSet;
use std::time::Duration;

use candid::{CandidType, Deserialize, Principal};
use ic_cdk::caller;

use crate::{CPayment, PaymentStatus, PROFILE_HISOTYR, SharePayment, SharesContract, Wallet};
use crate::discover::time_diff;
use crate::PROFILE_STORE;

// export::{
//     candid::{CandidType, Deserialize},
//     Principal,
// }

#[derive(PartialOrd, PartialEq, Clone, Debug, CandidType, Deserialize)]
enum ActionType {
    Payment(CPayment),
    Share(SharePayment),
}

#[derive(PartialOrd, PartialEq, Clone, Debug, CandidType, Deserialize)]
pub struct Rating {
    pub id: String,
    pub rating: f64,
    pub comment: String,
    pub user_id: Principal,
    // user_id==the user who did the rating
    pub date: f64,
}

#[derive(PartialOrd, PartialEq, Clone, Debug, CandidType, Deserialize)]
pub struct ActionRating {
    pub id: String,
    pub rating: f64,
    pub spent: f64,
    pub received: f64,
    pub promises: f64,
    pub received_promises: f64,
    // for now I am not calculating this.
    pub action_type: ActionType,
    pub date: f64,
}

// Function to calculate percentage
fn calculate_percentage(value: f64, total: f64) -> f64 {
    if total > 0.0 {
        value / total
    } else {
        0.0 as f64
    }
}


// This is to help others evaulaute wather to trust you.
#[derive(PartialEq, Clone, Debug, CandidType, Deserialize)]
pub struct UserHistory {
    pub id: Principal,
    // payment bad marks

    pub users_interacted: HashSet<String>,
    // only the shares between at least two people that got approved by both
    pub rates_by_others: Vec<Rating>,
    pub rates_by_actions: Vec<ActionRating>,
    pub actions_rate: f64,
    pub users_rate: f64,
    // CUSTOm contract field will be calculated later
}

impl UserHistory {
    pub fn new(id: Principal) -> Self {
        let new_profile_history = UserHistory {
            id,
            users_interacted: HashSet::new(),
            rates_by_others: vec![],
            rates_by_actions: vec![],
            actions_rate: 0.0,
            users_rate: 0.0,
        };
        PROFILE_HISOTYR.with(|h| {
            h.borrow_mut().insert(id, new_profile_history.clone());
        });
        new_profile_history
    }

    // pub fn get_cancellations(&self) -> Vec<ActionRating> {
    //     self.rates_by_actions.iter().filter(|r| {
    //         if let ActionType::Payment(payment) = &r.action_type {
    //             payment.status == PaymentStatus::Canceled
    //         } else {
    //             false
    //         }
    //     }).cloned().collect()
    // }

    pub fn get_promises(&self) -> Vec<ActionRating> {
        self.rates_by_actions.iter().filter(|r| {
            if let ActionType::Payment(payment) = &r.action_type {
                payment.status != PaymentStatus::Released || payment.status != PaymentStatus::None && payment.status != PaymentStatus::ConfirmedCancellation
            } else {
                false
            }
        }).cloned().collect()
    }

    pub fn get_objections(&self) -> Vec<ActionRating> {
        let mut unique_receivers: HashSet<Principal> = HashSet::new();

        self.rates_by_actions.iter()
            .filter(|r| {
                if let ActionType::Payment(payment) = &r.action_type {
                    if let PaymentStatus::Objected(_) = payment.status {
                        let is_unique = unique_receivers.insert(payment.receiver.clone());
                        is_unique
                    } else {
                        false
                    }
                } else {
                    false
                }
            })
            .cloned()
            .collect()
    }


    pub fn get_promises_value(&self) -> f64 {
        let promises = self.get_promises();
        let promises: Vec<CPayment> = promises.iter().map(|r| {
            if let ActionType::Payment(payment) = &r.action_type {
                payment.clone()
            } else {
                CPayment::default()
            }
        }).collect();
        promises.iter().map(|p| p.amount).sum()
    }


    pub fn get(id: Principal) -> Self {
        let res = PROFILE_HISOTYR.with(|h| {
            h.borrow_mut().get_mut(&id).cloned()
        });
        if let Some(res) = res {
            res
        } else {
            UserHistory::new(id)
        }
    }

    pub fn save(&mut self) {
        PROFILE_HISOTYR.with(|h| {
            h.borrow_mut().insert(self.id.clone(), self.clone());
        });
    }

    pub fn get_your_rating(&self) -> Option<Rating> {
        self.rates_by_others.iter().find(|r| r.user_id == caller()).cloned()
    }

    pub fn rate(&mut self, rating: Rating) -> Result<(), String> {
        if caller() == self.id {
            return Err("You can't rate yourself".to_string());
        }
        let profiel = UserHistory::get(caller());

        if profiel.actions_rate < 2.0 {
            return Err("You need to have at least 2 stars rating to be able to rate others".to_string());
        }
        if profiel.users_interacted.len() < 3 {
            return Err("You need to have at least 3 interactions to be able to rate others".to_string());
        }

        if let Some(rating) = self.get_your_rating() {
            self.rates_by_others.retain(|r| r.user_id != caller());
            // return Err("You already rated this user short ago. Please, wait 5 minutes before you can relate them.".to_string());
            // let diff = time_diff(rating.date.clone(), ic_cdk::api::time());
            // if diff < Duration::from_secs(5 * 60) {
            //     return Err("You already rated this user short ago. Please, wait 5 minutes before you can relate them.".to_string());
            // }
        }
        // if self.rates_by_others.iter().any(|r| r.user_id == caller()) {
        //     self.rates_by_others.retain(|r| r.user_id != caller());
        // }
        self.rates_by_others.push(rating);
        Ok(())
    }

    // pub fn calc_spent_and_received(&mut self) -> Self {
    //     let mut unique_users: HashSet<String> = HashSet::new();
    //     let wallet: Wallet = Wallet::get(self.id.clone());
    //     // let mut spent: f64 = 0.0;
    //     // let mut received: f64 = 0.0;
    //     for exchange in &wallet.exchanges {
    //         if let Ok(from) = Principal::from_text(exchange.from.clone()) {
    //             if from == self.id {
    //                 // spent += exchange.amount.clone();
    //                 unique_users.insert(exchange.to.clone());
    //             } else {
    //                 // Note: no need for this cuz let Ok(from) does that already // } else if from != "ExternalWallet".to_string() {
    //                 // received += exchange.amount.clone();
    //                 unique_users.insert(exchange.from.clone());
    //             }
    //         }
    //     }
    //     // self.spent = spent;
    //     // self.received = received;
    //     self.users_interacted = unique_users.len() as f64;
    //     // self.total_debt = wallet.total_debt.clone();
    //     self.clone()
    // }

    pub fn calc_users_rate(&mut self) -> f64 {
        let total_rate_sum: f64 = self.rates_by_others.iter_mut().map(|r| r.rating).sum();
        let len_rate: f64 = self.rates_by_others.len() as f64;
        let mut rate = total_rate_sum / len_rate; // out of 5 stars
        if len_rate < 10.0 {
            rate *= 0.7;
        } else if len_rate < 5.0 {
            rate *= 0.3;
        }
        self.users_rate = rate;
        rate.clone()
    }

    pub fn calc_actions_rate(&mut self) -> f64 {
        let wallet = Wallet::get(self.id.clone());
        let users_interacted = self.users_interacted.clone().len() as f64;
        let spent = wallet.spent.clone() + wallet.received.clone();
        let objections = self.get_objections().len() as f64;
        let mut w = 5.0;

        if users_interacted < 3.0 {
            w = 3.0;
        } else if users_interacted <= 1.0 {
            w = 1.0;
        }

        if objections > 12.0 {
            w = 0.5;
        } else if objections > 6.0 {
            w = 2.0;
        } else if objections >= 3.0 {
            w = 3.0;
        }

        if spent < 100.0 {
            w = 2.5;
        }

        // let debt: f64 = self.get_promises_value();
        let debt: f64 = wallet.total_debt.clone();
        let rate = (debt - spent).abs() / (debt + spent).abs();

        self.actions_rate = rate * w;
        self.actions_rate.clone()
    }


    pub fn payment_action(&mut self, payment: CPayment) {
        let wallet = Wallet::get(self.id.clone());
        self.rates_by_actions.retain(|action| action.id != payment.id);

        let total_promises: f64 = self.get_promises_value();
        let new_rating = ActionRating {
            id: payment.id.clone(),
            rating: self.calc_actions_rate(),
            spent: wallet.spent.clone(),
            received: wallet.received.clone(),
            promises: total_promises,
            received_promises: 0.0,
            action_type: ActionType::Payment(payment.clone()),
            date: ic_cdk::api::time() as f64,
        };
        self.rates_by_actions.push(new_rating);
    }


    pub fn confirm_cancellation(&mut self, payment: CPayment) {
        self.rates_by_actions.retain(|action| action.id != payment.id);
        self.calc_actions_rate();
    }

    // pub fn shares_actions_rate(&mut self) -> f64 {
    //     let payments: Vec<SharePayment> = SharesContract::get_payments(self.id);
    //
    //     // let accepted_percentage = calculate_percentage(total_accepted_amount.clone(), total_rejected_amount + total_accepted_amount.clone());
    //
    //     // Calculate unique users percentage relative to the total number of accepted shares changes
    //     // let total_users_accepted: HashSet<Principal> = shares_changes
    //     //     .iter()
    //     //     .map(|shares_change| shares_change.sender.clone())
    //     //     .collect();
    //     // let users_percentage = calculate_percentage(total_users_accepted.len() as f64, shares_changes.len() as f64);
    //     //
    //     // // Calculate weight based on the number of unique users accepted
    //     // let mut weight = 1.0;
    //     // if total_users_accepted.len() <= 4 {
    //     //     weight = total_users_accepted.len() as f64;
    //     // } else if total_accepted_amount < 25.0 {
    //     //     weight = 0.1;
    //     // } else if total_accepted_amount < 100.0 {
    //     //     weight = total_accepted_amount / 25.0;
    //     // } else {
    //     //     weight = 5.0;
    //     // }
    //     0.0
    // }
}
