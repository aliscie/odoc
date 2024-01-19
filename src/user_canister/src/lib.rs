// use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
// use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use std::cell::RefCell;

// type Memory = VirtualMemory<DefaultMemoryImpl>;

use std::collections::HashMap;
use candid::Principal;

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

// use ic_stable_structures::{
//     memory_manager::{MemoryId, MemoryManager, VirtualMemory},
//     BTreeMap,
//     DefaultMemoryImpl,
//     StableBTreeMap,
// };


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
mod chat;

use chat::*;
use init::*;
use std::sync::atomic::AtomicU64;
use timer::*;

thread_local! {


    // static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
    //     RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));
    //
    //
    // static PROFILE_STORE: RefCell<ProfileStore> = RefCell::new(
    //     StableBTreeMap::init(
    //         MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))),
    //     )
    // );

    static PROFILE_STORE: RefCell<ProfileStore> = RefCell::default();

    // static ID_STORE: RefCell<IdStore> = RefCell::default();
    static USER_FILES: RefCell<FilesStore> = RefCell::default();
    static SHARED_USER_FILES: RefCell<SharedUserFiles> = RefCell::default();
    static FILE_CONTENTS: RefCell<FileContentsStore> = RefCell::default();
    static FRIENDS_STORE: RefCell<FriendsStore> = RefCell::default();
    static CONTRACTS_STORE: RefCell<ContractStore> = RefCell::default();
    static FILES_SHARE_STORE: RefCell<FilesShareStore> = RefCell::default();
    static WALLETS_STORE: RefCell<WalletStore> = RefCell::default();
    static NOTIFICATIONS: RefCell<UserNotifications> = RefCell::default();
    static POSTS: RefCell<PostsStore> = RefCell::default();

    static CHATS: RefCell<ChatsStore> = RefCell::default();
    static MY_CHATS: RefCell<MyChatsStore> = RefCell::default();


}
pub static COUNTER: AtomicU64 = AtomicU64::new(0);

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