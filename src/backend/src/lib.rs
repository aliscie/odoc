use std::cell::RefCell;
use std::collections::HashMap;
use std::sync::atomic::AtomicU64;

use candid::{decode_one, encode_one, Principal};
use evm_rpc_canister_types::{
    BlockTag, EthMainnetService, EthSepoliaService, EvmRpcCanister, GetTransactionCountArgs,
    GetTransactionCountResult, MultiGetTransactionCountResult, RequestResult, RpcService,
};
// use ic_ledger_types::BlockIndex;
use icrc_ledger_types::icrc1::transfer::BlockIndex;
use ic_cdk_macros;
use ic_websocket_cdk::*;
use ic_cdk::api::management_canister::provisional::CanisterId;
use ic_websocket_cdk::*;
use candid::Nat;
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
use contracts::StoredContractVec;

use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};

use ic_stable_structures::{
    storable::Bound, DefaultMemoryImpl, StableBTreeMap, Storable, StableVec,
};

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
use ic_cdk::api::management_canister::bitcoin::{
    BitcoinNetwork, GetUtxosResponse, MillisatoshiPerByte,
};

type Memory = VirtualMemory<DefaultMemoryImpl>;

thread_local! {

    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static PROFILE_STORE: RefCell<StableBTreeMap<String, User, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))),
        )
    );

    static PROFILE_HISTORY: RefCell<StableBTreeMap<String, UserHistory, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1))),
        )
    );

    static FILES_SHARE_STORE: RefCell<StableBTreeMap<String, ShareFile, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(2))),
        )
    );

    static USER_FILES: RefCell<StableBTreeMap<String, FileNodeVector, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(3))),
        )
    );

    // <UserId, SharedFiles>
    static SHARED_USER_FILES: RefCell<StableBTreeMap<String, ShareFileNodeVector, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(4))),
        )
    );

    static FILE_CONTENTS: RefCell<StableBTreeMap<String, ContentNodeVec, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(5))),
        )
    );


    static FRIENDS_STORE: RefCell<StableBTreeMap<String, Friend, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(5))),
        )
    );


    static CONTRACTS_STORE: RefCell<StableBTreeMap<String, StoredContractVec, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(6))),
        )
    );


    static WALLETS_STORE: RefCell<StableBTreeMap<String, Wallet, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(8))),
        )
    );

    static NOTIFICATIONS: RefCell<StableBTreeMap<String, NotificationVec, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(9))),
        )
    );

    static POSTS: RefCell<StableBTreeMap<String, Post, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(10))),
        )
    );

    static CHATS: RefCell<StableBTreeMap<String, Chat, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(11))),
        )
    );

    static MY_CHATS: RefCell<StableBTreeMap<String, ChatsIdVec, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(12))),
        )
    );

    static WORK_SPACES: RefCell<StableBTreeMap<String, WorkSpaceVec, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(13))),
        )
    );
}

pub static COUNTER: AtomicU64 = AtomicU64::new(0);

#[cfg(test)]
mod tests {
    use ic_cdk::caller;
    use crate::friends::Friend;
    use crate::user::User;

    #[test]
    fn test_one() {
        // println!("test_one {}", caller().to_string());
    }
}

fn backend_wasm() -> Vec<u8> {
    let wasm_path = std::env::var_os("backend_WASM").expect("Missing counter wasm file");
    std::fs::read(wasm_path).unwrap()
}

ic_cdk_macros::export_candid!();
