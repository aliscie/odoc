use std::collections::HashMap;
use candid::{CandidType, Deserialize, Principal};
use crate::{WALLETS_STORE};
use crate::user_history::UserHistory;

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
    pub exchanges: Vec<Exchange>,
}

impl Wallet {

    pub fn add_debt(mut self, amount: f64, id: String) -> Result<(), String> {
        if self.balance >= self.total_debt + amount {
            let debt = self.debts.entry(id).or_insert(0.0);
            let wallet = self.calc_dept();
            wallet.save();
            Ok(())
        } else {
            Err(String::from("Insufficient balance"))
        }
    }

    pub fn remove_debt(mut self, id: String) -> Result<(), String> {
        if let Some(debt) = self.debts.get(&id) {
            let debt = debt.clone();
            self.debts.remove(&id);
            let wallet = self.calc_dept();
            wallet.save();
            Ok(())
        } else {
            Err(String::from("Debt not found"))
        }
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
            if let Some(wallet) = store.get(&principal) {
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
                };

                store.insert(principal, new_wallet.clone());
                new_wallet
            }
        })
    }

    pub fn deposit(&mut self, amount: f64, from: String, _type: ExchangeType) -> Result<(), String> {
        let new_exchange = Exchange {
            from: from.clone(),
            to: self.owner.clone(),
            amount,
            _type,
            date_created: ic_cdk::api::time() as f64,
        };
        self.exchanges.push(new_exchange);
        self.save();

        // handle profile
        let mut user_profile = UserHistory::get(self.owner.parse().unwrap());
        let user_profile = user_profile.calc_spent();
        user_profile.clone().save();
        Ok(())
    }

    pub fn withdraw(&mut self, amount: f64, to: String, _type: ExchangeType) -> Result<(), String> {
        // let now = std::time::SystemTime::now();
        let new_exchange = Exchange {
            from: self.owner.clone(),
            to: to.clone(),
            amount,
            _type,
            date_created: ic_cdk::api::time() as f64,
        };

        if self.balance >= amount {
            self.exchanges.push(new_exchange);
            self.save();

            // handle profile
            let mut user_profile = UserHistory::get(self.owner.parse().unwrap());
            let user_profile = user_profile.calc_received();
            user_profile.clone().save();
            Ok(())
        } else {
            Err(String::from("Insufficient balance"))
        }
    }
}

