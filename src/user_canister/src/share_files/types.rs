use std::collections::HashMap;
use candid::Principal;
use ic_cdk::{caller};
use crate::{FILE_CONTENTS, FILES_SHARE_STORE, USER_FILES};
use crate::files::FileNode;

use candid::{CandidType, Deserialize};
use crate::storage_schema::{ContentTree, FileId};


#[derive(PartialEq, Clone, Debug, Deserialize, CandidType)]
pub enum ShareFilePermission {
    None,
    CanUpdate,
    CanView,
    CanComment,
}

impl ShareFilePermission {
    pub fn check(&self, permission: ShareFilePermission) -> bool {
        match (self, permission) {
            (ShareFilePermission::None, _) => false,
            (ShareFilePermission::CanUpdate, _) => true,
            (ShareFilePermission::CanComment, ShareFilePermission::CanComment) => true,
            (ShareFilePermission::CanComment, ShareFilePermission::CanView) => true,
            (ShareFilePermission::CanView, ShareFilePermission::CanView) => true,
            _ => false,
        }
    }
}

#[derive(PartialEq, Clone, Debug, Deserialize, CandidType)]
pub struct ShareFile {
    pub id: String,
    pub file: FileId,
    pub owner: Principal,
    pub permission: ShareFilePermission,
    pub users_permissions: HashMap<Principal, ShareFilePermission>,
    // TODO later consider sharing children of file
    //  children
    //  contracts
}

impl ShareFile {
    // pub fn new(file_id: FileId, share_id: String) -> Result<String, String> {
    //     let file = FileNode::get_file(&file_id).ok_or("No such file with this id.")?;
    //
    //     let share_file = ShareFile {
    //         id: share_id.clone(),
    //         file: file.id,
    //         owner: caller(),
    //         permission: ShareFilePermission::CanUpdate,
    //         users_permissions: Default::default(),
    //     };
    //
    //     let _shared_file = FILES_SHARE_STORE.with(|files_share_store| {
    //         let mut files_share_store = files_share_store.borrow_mut();
    //         if let Some(share_file) = files_share_store.get(&share_id) {
    //             Some(share_file.clone())
    //         } else {
    //             let share_id = share_id.clone();
    //             files_share_store.insert(share_id, share_file.clone());
    //             Some(share_file)
    //         }
    //     });
    //
    //     let new_file = FileNode {
    //         id: file_id.clone(),
    //         parent: file.parent.clone(),
    //         name: file.name.clone(),
    //         children: file.children.clone(),
    //         share_id: Some(share_id.clone()),
    //         author: file.author,
    //     };
    //     new_file.save()?;
    //
    //     Ok(share_id)
    // }
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

    pub fn check_permission(&self, permission: ShareFilePermission) -> bool {
        if self.permission.check(permission.clone()) {
            return true;
        }

        // check if caller has permissions
        if let Some(user_permission) = self.users_permissions.get(&caller()) {
            return user_permission.check(permission);
        }

        false
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

    pub fn get_file(share_id: &String) -> Result<(FileNode, ContentTree), String> {
        let shared_file: ShareFile = FILES_SHARE_STORE.with(|files_share_store| {
            let files_share_store = files_share_store.borrow();
            files_share_store.get(share_id).cloned()
        }).ok_or("No such share id.")?;

        let can_view = shared_file.check_permission(ShareFilePermission::CanView);
        if !can_view {
            return Err("No permission to view this file.".to_string());
        }


        let file = USER_FILES.with(|files_store| {
            let user_files = files_store.borrow();
            let user_files_map = user_files.get(&shared_file.owner)?;
            user_files_map.get(&shared_file.file).cloned()
        }).ok_or("No such file.")?;

        let content_tree = FILE_CONTENTS.with(|file_contents| {
            let file_contents = file_contents.borrow();

            if let Some(file_map) = file_contents.get(&shared_file.owner) {
                file_map.get(&shared_file.file).cloned()
            } else {
                None
            }
        }).ok_or("No such file.")?;

        Ok((file, content_tree))
    }
}