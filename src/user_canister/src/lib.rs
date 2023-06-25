use std::cell::RefCell;
use std::collections::{BTreeMap, HashMap};

use ic_cdk::{
    api::call::ManualReply,
    export::{
        candid::{CandidType, Deserialize},
        Principal,
    },
};
use ic_cdk::export::candid::{
    candid_method, check_prog, export_service, IDLProg, TypeEnv,
};
use ic_cdk_macros::*;

use files::*;
use files::FileNode;
use friends::*;
use queries::*;
use storage_schema::*;
use updates::*;
use user::*;
use user::*;

use crate::files_content::ContentNode;
use crate::user::User;

mod user;
mod media;
mod files;
mod files_content;
mod agreement_contract;
mod storage_schema;
mod tables;
mod queries;
mod updates;
mod friends;

thread_local! {
    static PROFILE_STORE: RefCell<ProfileStore> = RefCell::default();
    static ID_STORE: RefCell<IdStore> = RefCell::default();
    static USER_FILES: RefCell<FilesStore> = RefCell::default();
    static FILE_CONTENTS: RefCell<FileContentsStore> = RefCell::default();
    static FRIENDS_STORE: RefCell<FriendsStore> = RefCell::default();
}

#[cfg(test)]
mod tests {
    use std::borrow::Cow;
    use std::env;
    use std::fs::{create_dir_all, write};
    use std::path::PathBuf;

    use candid::Principal;
    use ic_cdk::{api, update};
    use ic_cdk::export::candid::{
        candid_method, CandidType, check_prog, Deserialize, export_service, IDLProg, TypeEnv,
    };
    use serde::de::Unexpected::Str;

    use super::*;

// #[test]
    // fn test_create() {
    //     // Create a mock caller instance
    //     let mock_caller = MockCaller;
    //
    //     // Set the mock caller as the current caller
    //     ic_cdk::api::set_caller(Box::new(mock_caller));
    //
    //     let file = FileNode::new(String::from("hi"), None);
    //     println!("----------------new file id is  {:#?}", "file.id");
    // }

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
