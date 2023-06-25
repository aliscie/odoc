use std::collections::{BTreeMap, HashMap};

use candid::Principal;

use crate::files::FileNode;
use crate::files_content::ContentNode;
use crate::friends::Friend;
use crate::user::User;

pub type FileId = u64;
pub type ContentId = u64;
pub type ContentTree = HashMap<ContentId, ContentNode>;

// Stores types
pub type IdStore = BTreeMap<String, Principal>;
pub type ProfileStore = BTreeMap<Principal, User>;
pub type FriendsStore = BTreeMap<Principal, Friend>;
pub type FilesStore = BTreeMap<Principal, HashMap<FileId, FileNode>>;
pub type FileContentsStore = BTreeMap<Principal, HashMap<FileId, ContentTree>>;
