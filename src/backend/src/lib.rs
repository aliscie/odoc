// use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
// use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use std::cell::RefCell;
use std::collections::HashMap;
use std::sync::atomic::AtomicU64;

use candid::{decode_one, encode_one, Principal};
// use pocket_ic::{
//     common::rest::{BlobCompression, SubnetConfigSet, SubnetKind},
//     PocketIc, PocketIcBuilder, WasmResult,
// };
use ic_cdk::api::management_canister::provisional::CanisterId;
use ic_websocket_cdk::*;

use chat::*;
pub use contracts::*;
use contracts::*;
use discover::*;
use files::*;
use files_content::*;
use friends::*;
use init::*;
use queries::*;
pub use share_files::*;
use share_files::*;
use storage_schema::*;
use timer::*;
use updates::*;
use user::*;
use user_history::*;
pub use wallet::*;
use websocket::*;


// type Memory = VirtualMemory<DefaultMemoryImpl>;

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
mod user_history;
mod workspaces;
use workspaces::*;

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
    static PROFILE_HISOTYR: RefCell<ProfileHistoryStore> = RefCell::default();
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
    static WORK_SPACES: RefCell<WorkSpacesStore> = RefCell::default();
    // static My_WorkSpaces: RefCell<MyChatsStore> = RefCell::default();
}


pub static COUNTER: AtomicU64 = AtomicU64::new(0);

#[cfg(test)]
mod tests {
    use ic_cdk::caller;

    #[test]
    fn test_one() {
        // println!("test_one {}", caller().to_string());
    }
}

fn backend_wasm() -> Vec<u8> {
    let wasm_path = std::env::var_os("backend_WASM").expect("Missing counter wasm file");
    std::fs::read(wasm_path).unwrap()
}


// fn call_counter_can(ic: &PocketIc, can_id: CanisterId, method: &str) -> WasmResult {
//     ic.update_call(
//         can_id,
//         Principal::anonymous(),
//         method,
//         encode_one(()).unwrap(),
//     )
//         .expect("Failed to call counter canister")
// }

// #[test]
// fn test_counter_canister() {
//     dotenv::dotenv().ok();
//
//     println!("POCKET_IC_BIN: {:?}", std::env::var("POCKET_IC_BIN"));
//
//
//     const INIT_CYCLES: u128 = 2_000_000_000_000;
//
//     let pic = PocketIc::new();
//
//     // Create a canister and charge it with 2T cycles.
//     let can_id = pic.create_canister();
//     pic.add_cycles(can_id, INIT_CYCLES);
//     let backend_wasm = backend_wasm();
//     pic.install_canister(can_id, backend_wasm, vec![], None);
//     // Make some calls to the canister.
//     let args: RegisterUser = RegisterUser {
//         name: Some("AliSci".to_string()),
//         description: None,
//         photo: None,
//     };
//     let res_bytes: WasmResult = pic.update_call(
//         can_id,
//         Principal::anonymous(),
//         "register",
//         encode_one(args.clone()).unwrap(),
//     )
//         .expect("Failed to call counter canister");
//     // let expected = Err("Anonymous users are not allowed to register.".to_string());
//     // assert!(res_bytes == expected);
//     println!("res_bytes: {:?}", res_bytes);
//
// }


ic_cdk_macros::export_candid!();