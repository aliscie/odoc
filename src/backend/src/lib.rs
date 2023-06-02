use std::collections::HashMap;
use ic_cdk::export::candid::{Principal};


#[derive(Clone)]
pub struct UserCanisterData {
    name: String,
    email: String,
}

#[derive(Default)]
pub struct Users(pub HashMap<Principal, UserCanisterData>);

impl Users {
    pub fn register_user(&mut self, name: String, email: String) {
        let caller = ic_cdk::caller();
        if let Some(_) = self.0.get(&caller) {
            ic_cdk::trap("User already registered");
        } else {
            let user = UserCanisterData { name, email };
            self.0.insert(caller, user);
        }
    }

    pub fn get_user(&self) -> Option<UserCanisterData> {
        self.0.get(&ic_cdk::caller()).cloned()
    }
}
