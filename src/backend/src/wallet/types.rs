use std::collections::HashMap;
use crate::{WALLETS_STORE};
use crate::user_history::UserHistory;
use candid::{CandidType, Decode, Deserialize, Encode, Principal};

use ic_stable_structures::{
    storable::Bound, DefaultMemoryImpl, StableBTreeMap, Storable,
};
use std::{borrow::Cow, cell::RefCell};


#[derive(Eq, PartialOrd, PartialEq, Clone, Debug, CandidType, Deserialize)]
pub enum ExchangeType {
    Deposit,
    Withdraw,
    LocalReceive,
    LocalSend,
}

impl Default for ExchangeType {
    fn default() -> Self {
        ExchangeType::Deposit
    }
}

#[derive(PartialOrd, PartialEq, Clone, Debug, Default, CandidType, Deserialize)]
pub struct Exchange {
    pub from: String,
    pub to: String,
    pub amount: f64,
    pub _type: ExchangeType,
    pub date_created: f64,
}


#[derive(PartialEq, Clone, Debug, Default, CandidType, Deserialize)]
pub struct Wallet {
    pub owner: String,
    pub balance: f64,
    pub debts: HashMap<String, f64>,
    // debts are promises ( unreleased payments )
    pub total_debt: f64,
    // pub total_spent: f64,
    pub exchanges: Vec<Exchange>,
    pub received: f64,
    pub spent: f64,
    // pub exchanges: Vec<CPayment>,
}




// impl Storable for Wallet {
//     fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
//         Cow::Owned(Encode!(self).unwrap())
//     }
//
//     fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
//         Decode!(bytes.as_ref(), Self).unwrap()
//     }
//
//     const BOUND: Bound = Bound::Bounded {
//         max_size: 200000,
//         is_fixed_size: false,
//     };
// }

impl Wallet {
    pub fn check_dept(&self, amount: f64) -> Result<(), String> {
        if self.balance.clone() < self.total_debt + amount.clone() {
            return Err(String::from("Insufficient balance"));
        }
        Ok(())
    }
    pub fn add_dept(mut self, amount: f64, id: String) -> Result<(), String> {
        if self.balance.clone()  < self.total_debt + amount.clone() {
            return Err(String::from("Insufficient balance"));
        }
        self.debts.insert(id, amount);
        let wallet = self.calc_dept();
        wallet.save();
        Ok(())
    }

    pub fn remove_dept(mut self, id: String) -> Result<(), String> {
        if !self.debts.contains_key(&id) {
            return Err(String::from("Debt not found"));
        }
        self.debts.remove(&id);
        let wallet = self.calc_dept();
        wallet.save();
        Ok(())
    }

    pub fn calc_dept(&mut self) -> &mut Self {
        let mut total_debt = 0.0;
        for (key, value) in self.debts.iter() {
            total_debt += value;
        }
        self.total_debt = total_debt;
        self
    }

    pub fn save(&self) {
        WALLETS_STORE.with(|store| {
            let mut store = store.borrow_mut();
            store.insert(self.owner.parse().unwrap(), self.clone());
        })
    }

    pub fn get(principal: Principal) -> Wallet {
        WALLETS_STORE.with(|store| {
            let mut store = store.borrow_mut();
            if let Some(wallet) = store.get(&principal.to_string()) {
                // User already has a wallet, return the existing one
                wallet.clone()
            } else {
                // User does not have a wallet, create a new one
                let new_wallet = Wallet {
                    owner: principal.to_string(),
                    balance: 0.0,
                    debts: Default::default(),
                    total_debt: 0.0,
                    exchanges: vec![],
                    received: 0.0,
                    spent: 0.0,
                };

                store.insert(principal.to_string(), new_wallet.clone());
                new_wallet
            }
        })
    }

    pub fn deposit(&mut self, amount: f64, from: String, _type: ExchangeType) -> Result<Self, String> {
        let new_exchange = Exchange {
            from: from.clone(),
            to: self.owner.clone(),
            amount,
            _type,
            date_created: ic_cdk::api::time() as f64,
        };
        self.exchanges.push(new_exchange);
        self.balance += amount.clone();


        // handle profile
        if from != "ExternalWallet" {
            let mut user_profile = UserHistory::get(self.owner.parse().unwrap());
            user_profile.users_interacted.insert(from.clone());
            user_profile.clone().save();
            self.received += amount.clone();
        }
        self.save();
        Ok(self.clone())
    }

    pub fn withdraw(&mut self, amount: f64, to: String, _type: ExchangeType) -> Result<(), String> {
        if self.balance >= amount {
            let new_exchange = Exchange {
                from: self.owner.clone(),
                to: to.clone(),
                amount,
                _type,
                date_created: ic_cdk::api::time() as f64,
            };

            self.exchanges.push(new_exchange);
            self.balance -= amount.clone();
            if to != "ExternalWallet" {
                let mut user_profile = UserHistory::get(self.owner.parse().unwrap());
                user_profile.users_interacted.insert(to.clone());
                user_profile.clone().save();
                self.spent += amount.clone();
            }

            self.save();

            Ok(())
        } else {
            Err(String::from("Insufficient balance"))
        }
    }
}

