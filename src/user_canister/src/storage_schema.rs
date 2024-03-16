use candid::Principal;

// use std::collections::{BTreeMap, HashMap};
use std::collections::{HashMap};
use std::collections::btree_map::BTreeMap;

use crate::{ShareFile, StoredContract, Wallet};
use crate::chat::{Chat, Message};
use crate::discover::Post;
use crate::files::FileNode;
use crate::files_content::ContentNode;
use crate::friends::FriendSystem;
use crate::user::User;
use crate::user_history::UserHistory;
use crate::websocket::Notification;

// use candid::{CandidType, Decode, Deserialize, Encode};
// use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
// use ic_stable_structures::{
//     storable::Bound, DefaultMemoryImpl, StableBTreeMap, Storable,
// };
//
// use std::{borrow::Cow, cell::RefCell};
//
//
// type Memory = VirtualMemory<DefaultMemoryImpl>;
//
// const MAX_VALUE_SIZE: u32 = 100;
//
//
// impl Storable for User {
//     fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
//         Cow::Owned(Encode!(self).unwrap())
//     }
//
//     fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
//         Decode!(bytes.as_ref(), Self).unwrap()
//     }
//
//     const BOUND: Bound = Bound::Bounded {
//         max_size: MAX_VALUE_SIZE,
//         is_fixed_size: false,
//     };
//
// }
//
// #[derive(Ord, Eq, PartialOrd, PartialEq, Clone, Debug, CandidType, Deserialize)]
// pub struct MyPrincipalWrapper(Principal);
//
// impl Storable for MyPrincipalWrapper {
//   fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
//         Cow::Owned(Encode!(self).unwrap())
//     }
//
//     fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
//         Decode!(bytes.as_ref(), Self).unwrap()
//     }
//
//     const BOUND: Bound = Bound::Bounded {
//         max_size: MAX_VALUE_SIZE,
//         is_fixed_size: false,
//     };
//
// }


//---------- TODO Maybe  no need for FileId, ShareContractId, ShareRequestId,... etc ---------- \\
//            pub type StringId = String;

pub type FileId = String;
pub type PostId = String;
pub type ContentId = String;
pub type ContentTree = Vec<ContentNode>;
pub type ContractId = String;
pub type ShareContractId = String;
pub type ShareRequestId = String;
pub type ShareId = String;

// Stores types
// pub type IdStore = BTreeMap<String, Principal>;
pub type ProfileStore = BTreeMap<Principal, User>;
pub type ProfileHistoryStore = BTreeMap<Principal, UserHistory>;
pub type FriendsStore = BTreeMap<Principal, FriendSystem>;
// pub type FilesStore = BTreeMap<Principal, HashMap<FileId, FileNode>>;
pub type FilesStore = BTreeMap<Principal, Vec<FileNode>>;
pub type FileContentsStore = BTreeMap<Principal, HashMap<FileId, ContentTree>>;
pub type ContractStore = BTreeMap<Principal, HashMap<ContractId, StoredContract>>;
pub type FilesShareStore = BTreeMap<ShareId, ShareFile>;
pub type WalletStore = BTreeMap<Principal, Wallet>;
pub type UserNotifications = BTreeMap<Principal, Vec<Notification>>;
pub type PostsStore = BTreeMap<PostId, Post>;
pub type SharedUserFiles = BTreeMap<Principal, Vec<ShareFile>>;

pub type ChatsStore = Vec<Chat>;
pub type ChatsNotificationStore = BTreeMap<Principal, Vec<Message>>;
pub type MyChatsStore = BTreeMap<Principal, Vec<String>>;