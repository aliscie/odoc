use std::cell::RefCell;
use std::collections::HashMap;
use std::sync::atomic::AtomicU64;

use candid::{decode_one, encode_one, Principal};
use evm_rpc_canister_types::{
    BlockTag, EthMainnetService, EthSepoliaService, EvmRpcCanister, GetTransactionCountArgs,
    GetTransactionCountResult, MultiGetTransactionCountResult, RequestResult, RpcService,
};
// use ic_ledger_types::BlockIndex;
use candid::Nat;
use chat::*;
use contracts::StoredContractVec;
pub use contracts::*;
use contracts::*;
use discover::*;
use files::*;
use files_content::*;
use friends::*;
use ic_cdk::api::management_canister::provisional::CanisterId;
use ic_cdk_macros;
use ic_websocket_cdk::*;
use ic_websocket_cdk::*;
use icrc_ledger_types::icrc1::transfer::BlockIndex;
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

use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};

use ic_stable_structures::{
    storable::Bound, DefaultMemoryImpl, StableBTreeMap, StableVec, Storable,
};

mod contracts;
mod files;
mod files_content;
mod media;
mod user;

mod friends;
mod queries;
mod share_files;
mod storage_schema;
mod tables;
mod updates;
mod wallet;
// mod timer;
mod chat;
mod discover;
mod init;
mod timer;
mod user_history;
mod websocket;
mod workspaces;
mod affiliate;

use affiliate::*;
use crate::ckusdc_index_types::*;
use ic_cdk::api::management_canister::bitcoin::{
    BitcoinNetwork, GetUtxosResponse, MillisatoshiPerByte,
};
use icrc_ledger_types::icrc1::account::Account;
use workspaces::*;
use crate::LogLevel::Debug;

type Memory = VirtualMemory<DefaultMemoryImpl>;
// pub type ConfigCell = StableCell<Option<Candid<Config>>, VMem>;

// pub struct State {
//     config: ConfigCell,
//     /// Initially intended for ERC20 tokens only, this field stores the list of tokens set by the users.
//     user_token: UserTokenMap,
//     /// Introduced to support a broader range of user-defined custom tokens, beyond just ERC20.
//     /// Future updates may include migrating existing ERC20 tokens to this more flexible structure.
//     custom_token: CustomTokenMap,
//     user_profile: UserProfileMap,
//     user_profile_updated: UserProfileUpdatedMap,
//     migration: Option<Migration>,
// }

thread_local! {

    // TODO simplify state
    //     static STATE: RefCell<State> = RefCell::new(
    //         MEMORY_MANAGER.with(|mm| State {
    //             profiles: ConfigCell::init(mm.borrow().get(CONFIG_MEMORY_ID), None).expect("config cell initialization should succeed"),
    //             // user_token: UserTokenMap::init(mm.borrow().get(USER_TOKEN_MEMORY_ID)),
    //             // custom_token: CustomTokenMap::init(mm.borrow().get(USER_CUSTOM_TOKEN_MEMORY_ID)),
    //             // // Use `UserProfileModel` to access and manage access to these states
    //             // user_profile: UserProfileMap::init(mm.borrow().get(USER_PROFILE_MEMORY_ID)),
    //             // user_profile_updated: UserProfileUpdatedMap::init(mm.borrow().get(USER_PROFILE_UPDATED_MEMORY_ID)),
    //             // migration: None,
    //         })
    //     );

    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static CK_USDC_STATE: RefCell<CkUsdcState> = RefCell::default();

    // static CK_USDC_STATE: RefCell<CkUsdcState> = RefCell::new(
    //     StableBTreeMap::init(
    //         MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))),
    //     )
    // );

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



    // static FRIENDS_STORE: RefCell<StableBTreeMap<String, Friend, Memory>> = RefCell::new(
    //     StableBTreeMap::init(
    //         MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(5))),
    //     )
    // );

    static FRIENDS_STORE: RefCell<StableBTreeMap<String, Friend, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(15))),
        )
    );


    static CONTRACTS_STORE: RefCell<StableBTreeMap<String, StoredContractVec, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(6))),
        )
    );

    static FILE_CONTENTS: RefCell<StableBTreeMap<String, ContentNodeVec, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(7))),
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



    static AFFILIATE: RefCell<StableBTreeMap<String, Affiliate, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(13))),
        )
    );

    static WORK_SPACES: RefCell<StableBTreeMap<String, WorkSpaceVec, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(14))),
        )
    );
}

pub static COUNTER: AtomicU64 = AtomicU64::new(0);



#[cfg(test)]
mod tests {
    use crate::friends::Friend;
    use crate::user::User;
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

ic_cdk_macros::export_candid!();
