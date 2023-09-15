use std::collections::{BTreeMap, HashMap};

use candid::Principal;

use crate::{ShareFile, StoredContract, Wallet};
use crate::contracts::Contract;
use crate::files::FileNode;
use crate::files_content::ContentNode;
use crate::friends::Friend;
use crate::user::User;

pub type FileId = String;
pub type ContentId = String;
pub type ContentTree = HashMap<ContentId, ContentNode>;
pub type ContractId = String;
pub type ShareContractId = String;
pub type ShareId = String;

// Stores types
pub type IdStore = BTreeMap<String, Principal>;
pub type ProfileStore = BTreeMap<Principal, User>;
pub type FriendsStore = BTreeMap<Principal, Friend>;
pub type FilesStore = BTreeMap<Principal, HashMap<FileId, FileNode>>;
pub type FileContentsStore = BTreeMap<Principal, HashMap<FileId, ContentTree>>;
pub type ContractStore = BTreeMap<Principal, HashMap<ContractId, StoredContract>>;
pub type FilesShareStore = BTreeMap<ShareId, ShareFile>;
pub type WalletStore = BTreeMap<Principal, Wallet>;