use crate::files::FileNode;
use crate::{FILES_SHARE_STORE, SHARED_USER_FILES, USER_FILES};
use ic_cdk::caller;

use crate::storage_schema::ContentTree;
use candid::{CandidType, Decode, Deserialize, Encode, Principal};

use crate::files_content::ContentNode;
use ic_stable_structures::storable::Bound;
use ic_stable_structures::Storable;
use std::borrow::Cow;


#[derive(PartialEq, Clone, Debug, Deserialize, CandidType)]
pub struct ShareFile {
    pub id: String,
    pub owner: Principal,
    // TODO later consider sharing children of file
    //  children
    //  contracts
}

#[derive(PartialEq, Clone, Debug, Deserialize, CandidType)]
pub struct ShareFileNodeVector {
    pub share_files: Vec<ShareFile>,
}

impl Storable for ShareFile {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: 999999,
        is_fixed_size: false,
    };
}

impl Storable for ShareFileNodeVector {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: 999999,
        is_fixed_size: false,
    };
}

impl ShareFile {

    pub fn get_shared() -> Vec<ShareFile> {
        SHARED_USER_FILES
            .with(|files_share_store| files_share_store.borrow().get(&caller().to_string()))
            .unwrap_or_else(|| ShareFileNodeVector {
                share_files: vec![],
            })
            .share_files
    }

    pub fn get(share_id: &String) -> Result<Self, String> {
        FILES_SHARE_STORE.with(|files_share_store| {
            let files_share_store = files_share_store.borrow();
            if let Some(share_file) = files_share_store.get(share_id) {
                Ok(share_file.clone())
            } else {
                Err("No such share file.".to_string())
            }
        })
    }

    pub fn save(&self) -> Result<Self, String> {
        if caller().to_string() != self.owner.to_string() {
            return Err("Only owner can make a file public.".to_string());
        };
        FILES_SHARE_STORE.with(|files_share_store| {
            let mut files_share_store = files_share_store.borrow_mut();
            files_share_store.insert(self.id.clone(), self.clone());
            Ok(self.clone())
        })
    }

    pub fn add_to_my_shared(share_id: &String) -> Result<(), String> {
        let share_file = FILES_SHARE_STORE
            .with(|files_share_store| {
                let files_share_store = files_share_store.borrow();
                files_share_store.get(share_id)
            })
            .ok_or("No such share id.")?;

        SHARED_USER_FILES.with(|shared_user_files| {
            let mut shared_user_files = shared_user_files.borrow_mut();
            let mut share_files = vec![];
            if let Some(share_files_vec) = shared_user_files.get(&caller().to_string()) {
                share_files.extend(share_files_vec.share_files.clone());
            }
            if !share_files.iter().any(|f| f.id == share_file.id) {
                share_files.push(share_file.clone());
            }
            shared_user_files.insert(caller().to_string(), ShareFileNodeVector { share_files });
            Ok(())
        })
    }

    pub fn get_file(share_id: &String) -> Result<(FileNode, ContentTree), String> {
        let shared_file: ShareFile = FILES_SHARE_STORE
            .with(|files_share_store| {
                let files_share_store = files_share_store.borrow();
                files_share_store.get(share_id)
            })
            .ok_or("No such share id.")?;

        let file = USER_FILES.with(|files_store| {
            let user_files_vec = files_store.borrow();
            // Assuming user_files_vec is a HashMap<Principal, Vec<FileNode>>
            let user_files_vec = user_files_vec
                .get(&shared_file.owner.to_string())
                .ok_or("Owner not found.")?;
            user_files_vec
                .files
                .iter()
                .find(|f| f.id == shared_file.id.clone())
                .cloned()
                .ok_or("No such file.")
        })?;

        let can_view = file.check_permission(ShareFilePermission::CanView);
        if !can_view {
            return Err("No permission to view this file.".to_string());
        }

        let content_tree =
            ContentNode::get_file_content(shared_file.id).unwrap_or_else(|| ContentTree::new());

        Ok((file, content_tree))
    }
}
