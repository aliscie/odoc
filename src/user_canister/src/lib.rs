use std::cell::RefCell;
use std::collections::HashMap;

use ic_websocket_cdk::*;

pub use contracts::*;
use contracts::*;
use discover::*;
use files::*;
use files_content::*;
use friends::*;
use queries::*;
pub use share_files::*;
use share_files::*;
use storage_schema::*;
use updates::*;
use user::*;
pub use wallet::*;
use websocket::*;

// use ic_cdk::candid::{
//     candid_method, check_prog, export_service, IDLProg, TypeEnv,};


mod user;
mod media;
mod files;
mod files_content;
mod contracts;

mod storage_schema;
mod tables;
mod queries;
mod updates;
mod friends;
mod share_files;
mod wallet;
// mod timer;
mod websocket;
mod discover;
mod timer;
mod init;

use init::*;
use timer::*;

thread_local! {
    static PROFILE_STORE: RefCell<ProfileStore> = RefCell::default();
    static ID_STORE: RefCell<IdStore> = RefCell::default();
    static USER_FILES: RefCell<FilesStore> = RefCell::default();
    static SHARED_USER_FILES: RefCell<SharedUserFiles> = RefCell::default();
    static FILE_CONTENTS: RefCell<FileContentsStore> = RefCell::default();
    static FRIENDS_STORE: RefCell<FriendsStore> = RefCell::default();
    static CONTRACTS_STORE: RefCell<ContractStore> = RefCell::default();
    static FILES_SHARE_STORE: RefCell<FilesShareStore> = RefCell::default();
    static WALLETS_STORE: RefCell<WalletStore> = RefCell::default();
    static NOTIFICATIONS: RefCell<UserNotifications> = RefCell::default();
    static POSTS: RefCell<PostsStore> = RefCell::default();
}

#[cfg(test)]
mod tests {
    // use std::borrow::Cow;
    // use std::collections::HashMap;
    // use std::env;
    // use std::fs::{create_dir_all, write};
    // use std::path::PathBuf;
    //
    // use candid::Principal;
    // use candid::{
    //     candid_method, CandidType, Deserialize,
    //     // IDLProg,
    //     TypeEnv,
    // };
    // use ic_cdk::{api, update};
    // use ic_websocket_cdk::{CanisterWsCloseArguments, CanisterWsCloseResult, CanisterWsGetMessagesArguments, CanisterWsGetMessagesResult, CanisterWsMessageArguments, CanisterWsMessageResult, CanisterWsOpenArguments, CanisterWsOpenResult, ClientPrincipal, WsHandlers, WsInitParams};
    // use serde::de::Unexpected::Str;
    // use crate::files::FileNode;
    // use crate::queries::InitialData;
    // use crate::user::{RegisterUser, User};
    //
    use super::*;

    #[test]
    fn save_candid_2() {
        // println!("-------- Wrote to {:?}", dir);
        // println!("-------- res {:?}", canister_name);
    }
}

ic_cdk_macros::export_candid!();