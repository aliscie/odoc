use std::collections::HashSet;
use std::time::Duration;

use candid::{CandidType, Deserialize, Principal};
use ic_cdk::caller;

use crate::{CPayment, PROFILE_HISOTYR, SharePayment, SharesContract, Wallet};
use crate::discover::time_diff;
use crate::PROFILE_STORE;

// export::{
//     candid::{CandidType, Deserialize},
//     Principal,
// }

#[derive(PartialOrd, PartialEq, Clone, Debug, CandidType, Deserialize)]
enum ActionType {
    ReleasePayment,
    CancelPayment,
    RejectShareChange,
    AcceptShareChange,
    PromosPayment(CPayment),
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

    pub total_debt: f64,
    pub total_payments_cancellation: f64,
    pub latest_payments_cancellation: Vec<CPayment>,

    // payments good mark
    pub spent: f64,
    pub received: f64,
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
    pub rates_by_others: Vec<Rating>,
    pub rates_by_actions: Vec<ActionRating>,
    pub total_rate: f64,
    // CUSTOm contract field will be calculated later
}

impl UserHistory {
    pub fn new(id: Principal) -> Self {
        let new_profile_history = UserHistory {
            id,
            total_debt: 0.0,
            total_payments_cancellation: 0.0,
            latest_payments_cancellation: Vec::new(),
            spent: 0.0,
            received: 0.0,
            users_interactions: 0.0,
            transactions_sent: 0.0,
            transactions_received: 0.0,
            received_shares_payments: 0.0,
            shares_change_request: 0.0,
            shares_changes_rejects: 0.0,
            shares_changes_accepts: 0.0,
            rates_by_others: vec![],
            rates_by_actions: vec![],
            total_rate: 0.0,
        };
        PROFILE_HISOTYR.with(|h| {
            h.borrow_mut().insert(id, new_profile_history.clone());
        });
        new_profile_history
    }
    // pub fn get(id: Principal) -> Self {
    //     PROFILE_HISOTYR.with(|h| {
    //         h.borrow_mut().get_mut(&id)
    //     })
    // }
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

        if profiel.total_rate < 2.0 {
            return Err("You need to have at least 2 stars rating to be able to rate others".to_string());
        }
        if profiel.users_interactions < 3.0 {
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
    pub fn calc_received(&mut self) -> Self {
        // Create a HashSet to store unique users
        let mut unique_users: HashSet<Principal> = HashSet::new();

        let wallet: Wallet = Wallet::get(self.id.clone());

        for exchange in &wallet.exchanges {
            if let Ok(to) = Principal::from_text(exchange.from.clone()) {
                if to == self.id {
                    unique_users.insert(to);
                    self.received += exchange.amount.clone();
                }
            }
        }

        // Set the number of unique users to self.users_interactions
        self.users_interactions = unique_users.len() as f64;

        self.clone()
    }

    pub fn calc_spent(&mut self) -> Self {
        // Create a HashSet to store unique users
        let mut unique_users: HashSet<Principal> = HashSet::new();

        let wallet: Wallet = Wallet::get(self.id.clone());

        for exchange in &wallet.exchanges {
            if let Ok(to) = Principal::from_text(exchange.to.clone()) {
                if to == self.id {
                    unique_users.insert(to);
                    self.spent += exchange.amount.clone();
                }
            }
        }

        // Set the number of unique users to self.users_interactions
        self.users_interactions = unique_users.len() as f64;

        self.clone()
    }


    pub fn calc_total_rate(&mut self) {
        let total_rate_sum: f64 = self.rates_by_others.iter().map(|r| r.rating as f64).sum();
        let total_actions_rate_sum: f64 = self.rates_by_actions.iter().map(|r| r.rating as f64).sum();

        let others_len = self.rates_by_others.len() as f64;
        let actions_len = self.rates_by_actions.len() as f64;
        let mut user_weight = 0.1;
        let mut action_weight = 0.1;

        let others_rate = if others_len > 0.0 {
            total_rate_sum / others_len as f64
        } else {
            0.0
        };

        let actions_rate = if actions_len > 0.0 {
            total_actions_rate_sum / actions_len as f64
        } else {
            0.0
        };

        if others_len > 10.0 {
            user_weight = 0.5;
        } else {
            user_weight = others_len / 40.0;
        }
        if actions_len > 10.0 {
            action_weight = 0.5;
        } else {
            action_weight = actions_len / 40.0;
        }


        self.total_rate = (others_rate * user_weight) + (actions_rate * action_weight);
    }


    pub fn payment_actions_rate(&mut self) -> f64 {
        // Get released and canceled payments
        // let released_payments: Vec<PaymentContract> = PaymentContract::get_released_payments(self.id);
        // let canceled_payments: Vec<PaymentContract> = PaymentContract::get_canceled_payments(self.id, 0, 9999);

        // Calculate released percentage relative to total amount
        // let total_released_amount: f64 = released_payments.iter().map(|payment| payment.amount as f64).sum();
        // let total_canceled_amount: f64 = canceled_payments.iter().map(|payment| payment.amount as f64).sum();

        // let released_percentage = calculate_percentage(total_released_amount.clone(), total_canceled_amount + total_released_amount.clone());

        // Calculate unique users percentage relative to the total number of released payments
        // let total_users_released: HashSet<Principal> = released_payments
        //     .iter()
        //     .map(|payment| payment.sender.clone())
        //     .collect();
        // let users_percentage = calculate_percentage(total_users_released.len() as f64, released_payments.len() as f64);
        //
        // // Calculate weight based on the number of unique users released
        // let mut weight = 1.0;
        // if total_users_released.len() <= 4 {
        //     weight = total_users_released.len() as f64;
        // } else if total_released_amount < 25.0 {
        //     weight = 0.1;
        // } else if total_released_amount < 100.0 {
        //     weight = total_released_amount / 25.0;
        // } else {
        //     weight = 5.0;
        // }


        // (released_percentage * 0.35) + (users_percentage * 0.15)
        0.0
    }

    pub fn release_payment(&mut self, id: String) {
        let rating = self.payment_actions_rate();
        let new_rating = ActionRating {
            id: id.clone(),
            rating,
            action_type: ActionType::ReleasePayment,
            date: ic_cdk::api::time() as f64,
        };
        self.rates_by_actions.retain(|action| action.id != id);
        self.rates_by_actions.push(new_rating);
        self.calc_total_rate()
    }


    pub fn promise_payment(&mut self, payment: CPayment) {
        let old_action = self.rates_by_actions.iter().find(|action| action.id == payment.id);
        if let Some(action) = old_action {
            if let ActionType::PromosPayment(p) = action.action_type.clone() {
                if p == payment {
                    return;
                }
            }
        }

        let rating = self.payment_actions_rate();
        let new_rating = ActionRating {
            id: payment.id.clone(),
            rating,
            action_type: ActionType::PromosPayment(payment.clone()),
            date: ic_cdk::api::time() as f64,
        };
        self.rates_by_actions.retain(|action| action.id != payment.id);
        self.rates_by_actions.push(new_rating);
        self.calc_total_rate()
    }


    pub fn cancel_payment(&mut self, payment:CPayment) {
        let rating = self.payment_actions_rate();
        let new_rating = ActionRating {
            id: payment.id,
            rating,
            action_type: ActionType::CancelPayment,
            date: ic_cdk::api::time() as f64,
        };
        self.rates_by_actions.push(new_rating);
        self.calc_total_rate()
    }

    pub fn confirm_cancellation(&mut self, payment:CPayment) {
        // let rating = self.payment_actions_rate();
        // let new_rating = ActionRating {
        //     id: payment.id,
        //     rating,
        //     action_type: ActionType::CancelPayment,
        //     date: ic_cdk::api::time() as f64,
        // };
        self.rates_by_actions.retain(|action| action.id != payment.id);
        self.calc_total_rate()
    }

    pub fn shares_actions_rate(&mut self) -> f64 {
        let payments: Vec<SharePayment> = SharesContract::get_payments(self.id);

        // let accepted_percentage = calculate_percentage(total_accepted_amount.clone(), total_rejected_amount + total_accepted_amount.clone());

        // Calculate unique users percentage relative to the total number of accepted shares changes
        // let total_users_accepted: HashSet<Principal> = shares_changes
        //     .iter()
        //     .map(|shares_change| shares_change.sender.clone())
        //     .collect();
        // let users_percentage = calculate_percentage(total_users_accepted.len() as f64, shares_changes.len() as f64);
        //
        // // Calculate weight based on the number of unique users accepted
        // let mut weight = 1.0;
        // if total_users_accepted.len() <= 4 {
        //     weight = total_users_accepted.len() as f64;
        // } else if total_accepted_amount < 25.0 {
        //     weight = 0.1;
        // } else if total_accepted_amount < 100.0 {
        //     weight = total_accepted_amount / 25.0;
        // } else {
        //     weight = 5.0;
        // }
        0.0
    }
}
