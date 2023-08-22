use ic_cdk::{api::call::ManualReply, caller, export::{
    candid::{CandidType, Deserialize},
    Principal,
}};
use crate::{Contract, WALLETS_STORE};

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

#[derive(Eq, PartialOrd, PartialEq, Clone, Debug, Default, CandidType, Deserialize)]
pub struct Exchange {
    pub from: String,
    pub to: String,
    pub amount: u64,
    pub date: String,
    pub _type: ExchangeType,
}

#[derive(Eq, PartialOrd, PartialEq, Clone, Debug, Default, CandidType, Deserialize)]
pub struct Wallet {
    pub owner: String,
    pub balance: u64,
    pub exchanges: Vec<Exchange>,
}

impl Wallet {
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
                    balance: 0,
                    exchanges: vec![],
                };

                store.insert(principal, new_wallet.clone());
                new_wallet
            }
        })
    }

    pub fn deposit(&mut self, amount: u64, from: String, _type: ExchangeType) -> Result<(), String> {
        // let now = std::time::SystemTime::now();
        let now = "".to_string();
        WALLETS_STORE.with(|store| {
            let mut store = store.borrow_mut();
            if let Some(wallet) = store.get_mut(&self.owner.parse().unwrap()) {
                wallet.balance += amount;
                let exchange = Exchange {
                    from,
                    to: self.owner.clone(),
                    amount,
                    date: now,
                    _type,
                };
                wallet.exchanges.push(exchange);
            }
        });
        Ok(())
    }

    pub fn withdraw(&mut self, amount: u64, to: String, _type: ExchangeType) -> Result<(), String> {
        // let now = std::time::SystemTime::now();
        let now = "".to_string();
        if self.balance >= amount {
            WALLETS_STORE.with(|store| {
                let mut store = store.borrow_mut();
                if let Some(wallet) = store.get_mut(&self.owner.parse().unwrap()) {
                    wallet.balance -= amount;
                    let exchange = Exchange {
                        from: self.owner.clone(),
                        to,
                        amount,
                        date: now,
                        _type,
                    };
                    wallet.exchanges.push(exchange);
                }
            });
            Ok(())
        } else {
            Err(String::from("Insufficient balance"))
        }
    }
}

