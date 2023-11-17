// create greeting query
use std::cell::RefCell;
use std::collections::{BTreeMap, HashMap};

use ic_cdk::{api::call::ManualReply, caller, export::{
    candid::{CandidType, Deserialize},
    Principal,
}};
use ic_cdk::export::candid::{
    candid_method, check_prog, export_service, IDLProg, TypeEnv,
};

type ProfileStore = BTreeMap<Principal, Principal>;

thread_local! {
    static USER_CANISTERS_STORE: RefCell<ProfileStore> = RefCell::default();
}



#[ic_cdk::query]
fn get_user_canister() -> Result<String, String> {
    USER_CANISTERS_STORE.with(|store| {
        let store = store.borrow();
        match store.get(&caller()) {
            Some(canister_id) => Ok(canister_id.to_text()),
            None => Err("User does not have a canister".to_string()),
        }
    })
}



#[ic_cdk::update]
fn create_canister() -> Result<String, String> {

    // if caller().to_text() == "2vxsx-fae" {
    //     return Err("Anonymous users cannot create canisters".to_string());
    // }

    // create dummy canister_id
    let canister_id = Principal::from_text("rrkah-fqaaa-aaaaa-aaaaq-cai").unwrap();
    USER_CANISTERS_STORE.with(|store| {
        let mut store = store.borrow_mut();
        match store.get(&caller()) {
            Some(_) => Err("User already has a canister".to_string()),
            None => {
                // let canister_id = ic_cdk::api::call::create_canister();
                store.insert(caller(), canister_id);
                Ok(canister_id.to_text())
            }
        }
    })
}

#[cfg(test)]
mod tests {
    use std::borrow::Cow;
    use std::env;
    use std::fs::{create_dir_all, write};
    use std::path::PathBuf;

    use ic_cdk::{api, update};
    use ic_cdk::export::candid::{
        candid_method, CandidType, check_prog, Deserialize, export_service, IDLProg, TypeEnv,
    };

    use super::*;

    #[test]
    fn save_candid_2() {
        #[ic_cdk_macros::query(name = "__get_candid_interface_tmp_hack")]
        fn export_candid() -> String {
            export_service!();
            __export_service()
        }

        let dir: PathBuf = env::current_dir().unwrap();
        let canister_name: Cow<str> = dir.file_name().unwrap().to_string_lossy();

        match create_dir_all(&dir) {
            Ok(_) => println!("Successfully created directory"),
            Err(e) => println!("Failed to create directory: {}", e),
        }

        let res = write(dir.join(format!("{:?}.did", canister_name).replace("\"", "")), export_candid());
        println!("-------- Wrote to {:?}", dir);
        println!("-------- res {:?}", canister_name);
    }
}
