use std::collections::HashMap;

use candid::{Nat, Principal};

#[derive(Default)]
pub struct Merchants(pub HashMap<Principal, HashMap<Principal, Nat>>); // Merchant Principal ID -> Token Canister ID -> Amount

impl Merchants {
    pub fn add_amount(
        &mut self,
        merchant_id: Principal,
        token_canister_id: Principal,
        amount: Nat,
    ) {
        let merchant = self.0.entry(merchant_id).or_insert(HashMap::new());
        let current_amount = merchant
            .entry(token_canister_id)
            .or_insert(Nat::from(0 as u64));
        *current_amount += amount;
    }

    pub fn get_amount(&self, merchant_id: Principal, token_canister_id: Principal) -> Nat {
        self.0
            .get(&merchant_id)
            .and_then(|merchant| merchant.get(&token_canister_id))
            .cloned()
            .unwrap_or(Nat::from(0 as u64))
    }

    pub fn get_merchant_amounts(&self, merchant_id: Principal) -> HashMap<Principal, Nat> {
        self.0.get(&merchant_id).cloned().unwrap_or(HashMap::new())
    }

    pub fn sub_amount(
        &mut self,
        merchant_id: Principal,
        token_canister_id: Principal,
        amount: Nat,
    ) {
        let merchant = self.0.entry(merchant_id).or_insert(HashMap::new());
        let current_amount = merchant
            .entry(token_canister_id)
            .or_insert(Nat::from(0 as u64));
        *current_amount -= amount;
    }
}
