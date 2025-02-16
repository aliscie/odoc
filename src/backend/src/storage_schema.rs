use candid::Principal;

// use std::collections::{BTreeMap, HashMap};
use std::collections::btree_map::BTreeMap;
use std::collections::HashMap;

use crate::chat::{Chat, Message};
use crate::discover::Post;
use crate::files::FileNode;
use crate::files_content::ContentNode;
use crate::friends::Friend;
use crate::{ShareFile, StoredContract, Wallet};
// use crate::friends::FriendSystem;
use crate::user::User;
use crate::user_history::UserHistory;
use crate::websocket::Notification;
use crate::workspaces::types::WorkSpace;

use candid::{CandidType, Decode, Deserialize, Encode};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{storable::Bound, DefaultMemoryImpl, StableBTreeMap, Storable};

use std::{borrow::Cow, cell::RefCell};

type Memory = VirtualMemory<DefaultMemoryImpl>;

impl Storable for User {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }


    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap_or_else(|_| {
            // Try to decode with old format
            #[derive(CandidType, Deserialize)]
            struct OldUser {
                id: String,
                name: String,
                description: String,
                photo: Vec<u8>,
            }

            match Decode!(bytes.as_ref(), OldUser) {
                Ok(old_user) => User {
                    id: old_user.id,
                    name: old_user.name,
                    email: String::new(), // Default value for new field
                    description: old_user.description,
                    photo: old_user.photo,
                },
                Err(_) => {
                    let mut new_user = User::default();
                    new_user.name = "NoneName".to_string();
                    new_user.id = "NoneID".to_string();
                    return new_user
                } // Use default if both formats fail
            }
        })
    }
    const BOUND: Bound = Bound::Bounded {
        max_size: 999999,
        is_fixed_size: false,
    };
}

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
pub type UserId = String;

// Stores types
// pub type IdStore = BTreeMap<String, Principal>;
// pub type ProfileStore = BTreeMap<Principal, User>;
pub type ProfileHistoryStore = BTreeMap<String, UserHistory>;
pub type FriendsStore = BTreeMap<Principal, Vec<Friend>>;
// pub type FilesStore = BTreeMap<Principal, HashMap<FileId, FileNode>>;
pub type FilesStore = BTreeMap<Principal, Vec<FileNode>>;
pub type FileContentsStore = BTreeMap<Principal, HashMap<FileId, ContentTree>>;
pub type ContractStore = BTreeMap<Principal, HashMap<ContractId, StoredContract>>;
// pub type FilesShareStore = BTreeMap<ShareId, ShareFile>;
pub type WalletStore = BTreeMap<String, Wallet>;
pub type UserNotifications = BTreeMap<Principal, Vec<Notification>>;
pub type PostsStore = BTreeMap<PostId, Post>;
pub type SharedUserFiles = BTreeMap<Principal, Vec<ShareFile>>;

pub type ChatsStore = Vec<Chat>;
pub type ChatsNotificationStore = BTreeMap<Principal, Vec<Message>>;
pub type MyChatsStore = BTreeMap<Principal, Vec<String>>;
pub type WorkSpacesStore = Vec<WorkSpace>;
