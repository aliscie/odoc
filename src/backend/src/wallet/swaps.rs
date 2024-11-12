use std::collections::HashMap;

use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

#[derive(CandidType, Default, Serialize, Deserialize)]
pub struct Swaps(pub HashMap<Principal, HashMap<Principal, Principal>>); // token0 -> token1 -> pool_canister_id

impl Swaps {
    pub fn add_swap(&mut self, token0: Principal, token1: Principal, pool_canister_id: Principal) {
        self.0
            .entry(token0)
            .or_insert_with(HashMap::new)
            .insert(token1, pool_canister_id);
    }

    pub fn remove_swap(&mut self, token0: &Principal, token1: &Principal) {
        if let Some(token0_swaps) = self.0.get_mut(token0) {
            token0_swaps.remove(token1);
            if token0_swaps.is_empty() {
                self.0.remove(token0);
            }
        }
    }

    pub fn get_swaps(&self) -> Vec<(Principal, Principal)> {
        self.0
            .iter()
            .flat_map(|(token0, token1_swaps)| {
                token1_swaps
                    .iter()
                    .map(move |(token1, _)| (*token0, *token1))
            })
            .collect()
    }

    pub fn get_pool_canister_id(
        &self,
        token0: &Principal,
        token1: &Principal,
    ) -> Option<&Principal> {
        self.0
            .get(token0)
            .and_then(|token0_swaps| token0_swaps.get(token1))
    }

    pub fn exists(&self, token0: &Principal, token1: &Principal) -> bool {
        self.0
            .get(token0)
            .map_or(false, |token0_swaps| token0_swaps.contains_key(token1))
    }
}
