use std::collections::HashMap;

use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

#[derive(CandidType, Default, Serialize, Deserialize)]
pub struct Owners(pub HashMap<Principal, bool>);

impl Owners {
    pub fn add_owner(&mut self, owner: Principal) {
        self.0.insert(owner, true);
    }

    pub fn remove_owner(&mut self, owner: Principal) {
        self.0.remove(&owner);
    }

    pub fn is_owner(&self, owner: Principal) -> bool {
        self.0.contains_key(&owner)
    }

    pub fn get_owners(&self) -> Vec<Principal> {
        self.0.keys().cloned().collect()
    }
}
