use std::collections::HashMap;
use crate::{CPayment, PaymentStatus, WALLETS_STORE};
use crate::user_history::UserHistory;
use candid::{CandidType, Decode, Deserialize, Encode, Principal};
use ethers_core::abi::ethereum_types::H160;
use ic_stable_structures::{
    storable::Bound, DefaultMemoryImpl, StableBTreeMap, Storable,
};
use std::{borrow::Cow, cell::RefCell};
use ic_cdk::caller;
use serde_bytes::ByteBuf;
use serde::Serialize;

pub const MAX_SYMBOL_LENGTH: usize = 20;

#[derive(CandidType, Serialize, Deserialize, Clone, Eq, PartialEq, Debug)]
pub struct UserToken {
    pub contract_address: String,
    pub chain_id: u64,
    pub symbol: Option<String>,
    pub decimals: Option<u8>,
    pub version: Option<u64>,
    pub enabled: Option<bool>,
}


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

impl Storable for Wallet {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}



impl Wallet {
    pub fn check_dept(&self, amount: f64) -> Result<(), String> {
        if self.balance.clone() < self.total_debt + amount.clone() {
            return Err(String::from("Insufficient balance"));
        }
        Ok(())
    }
    pub fn add_dept(mut self, amount: f64, id: String) -> Result<(), String> {
        if self.balance.clone() < self.total_debt + amount.clone() {
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

    // pub fn internal_transaction(&mut self, amount: f64, receiver: String, _type: ExchangeType)->Result<(), String>{
    //     let payment = CPayment {
    //         contract_id: "none".to_string(),
    //         id: "".to_string(),
    //         amount: 0.0,
    //         sender: caller(),
    //         receiver: Principal::from_text(receiver).unwrap(),
    //         date_created: 0.0,
    //         date_released: 0.0,
    //         status: PaymentStatus::Released,
    //         cells: vec![],
    //     };
    //
    //     if self.balance >= amount {
    //         let new_exchange = Exchange {
    //             from: self.owner.clone(),
    //             to: receiver.clone(),
    //             amount,
    //             _type,
    //             date_created: ic_cdk::api::time() as f64,
    //         };
    //
    //         self.exchanges.push(new_exchange);
    //         self.balance -= amount.clone();
    //
    //         self.save();
    //
    //         Ok(())
    //     } else {
    //         Err(String::from("Insufficient balance"))
    //     }
    //
    //     payment.pay()
    //
    //
    // }

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

pub fn parse_eth_address(address: &str) -> [u8; 20] {
    match address.parse() {
        Ok(H160(addr)) => addr,
        Err(err) => ic_cdk::trap(&format!(
            "failed to parse contract address {address}: {err}",
        )),
    }
}

pub fn assert_token_symbol_length(token: &UserToken) -> Result<(), String> {
    if let Some(symbol) = token.symbol.as_ref() {
        if symbol.len() > MAX_SYMBOL_LENGTH {
            return Err(format!(
                "Token symbol should not exceed {MAX_SYMBOL_LENGTH} bytes",
            ));
        }
    }

    Ok(())
}

// pub fn get_ecdsa_key_name() -> String {
//     #[allow(clippy::option_env_unwrap)]
//     let dfx_network = option_env!("DFX_NETWORK").unwrap();
//     match dfx_network {
//         "local" => "dfx_test_key".to_string(),
//         "ic" => "key_1".to_string(),
//         _ => panic!("Unsupported network."),
//     }
// }
//
// pub // The derivation path determines the Ethereum address generated
// // by the signer.
// fn create_derivation_path(principal: &Principal) -> Vec<Vec<u8>> {
//     const SCHEMA_V1: u8 = 1;
//     [
//         ByteBuf::from(vec![SCHEMA_V1]),
//         ByteBuf::from(principal.as_slice().to_vec()),
//     ]
//     .iter()
//     .map(|x| x.to_vec())
//     .collect()
// }

// #[init]
// pub fn init(maybe_init: Option<InitArg>) {
//     if let Some(init_arg) = maybe_init {
//         init_state(init_arg)
//     }
// }


