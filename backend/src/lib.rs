use candid::candid_method;
use ic_cdk::export::candid;
use ic_cdk_macros::*;

mod user {
    #[query]
    fn get() -> String {
        "Hello, world!".to_string()
    }
}


static mut COUNTER: Option<candid::Nat> = None;

#[init]
fn init() {
    unsafe {
        COUNTER = Some(candid::Nat::from(0));
    }
}

#[update]
fn increment() {
    unsafe {
        COUNTER.as_mut().unwrap().0 += 1u64;
    }
}

#[candid_method(update)]
#[query]
fn get() -> candid::Nat {
    unsafe { COUNTER.as_mut().unwrap().clone() }
}
#[candid_method(update)]
#[update]
fn set(input: candid::Nat) {
    unsafe {
        COUNTER.as_mut().unwrap().0 = input.0;
    }
}


#[cfg(test)]
mod tests {
    use std::borrow::Cow;
    use std::fs::{create_dir_all, write};
    use std::path::PathBuf;
    use ic_cdk::{api, update};
    use std::env;
    use std::path::Path;

    use ic_cdk::api::management_canister::main::CanisterSettings;
    use ic_cdk::export::candid::{Principal};


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