use candid::Principal;
use ic_cdk::{caller};
use crate::{FILE_CONTENTS, FILES_SHARE_STORE, USER_FILES, SHARED_USER_FILES};
use crate::files::FileNode;

use candid::{CandidType, Deserialize};
use crate::storage_schema::{ContentTree};


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
    pub owner: Principal,
    // TODO later consider sharing children of file
    //  children
    //  contracts
}

impl ShareFile {
    // pub fn new(file_id: FileId, share_id: String) -> Result<String, String> {
    //     let file = FileNode::get(&file_id).ok_or("No such file with this id.")?;
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

    pub fn get_shared() -> Vec<ShareFile> {
        SHARED_USER_FILES.with(|files_share_store| {
            files_share_store.borrow().get(&caller()).cloned().unwrap_or_default()
        })
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
        let share_file = FILES_SHARE_STORE.with(|files_share_store| {
            let files_share_store = files_share_store.borrow();
            files_share_store.get(share_id).cloned()
        }).ok_or("No such share id.")?;


        SHARED_USER_FILES.with(|shared_user_files| {
            let mut shared_user_files = shared_user_files.borrow_mut();
            // get or insert caller()
            let share_files = shared_user_files.entry(caller()).or_insert_with(Vec::new);
            share_files.push(share_file);
            Ok(())
            // if let Some(share_files) = shared_user_files.get_mut(&caller()) {
            //     // Assuming you want to insert the share file into the current user's shared files
            //     share_files.push(share_file);
            //     Ok(())
            // } else {
            //     Err("No such user.".to_string())
            // }
        })
    }


    pub fn get_file(share_id: &String) -> Result<(FileNode, ContentTree), String> {
        let shared_file: ShareFile = FILES_SHARE_STORE.with(|files_share_store| {
            let files_share_store = files_share_store.borrow();
            files_share_store.get(share_id).cloned()
        }).ok_or("No such share id.")?;


        let file = USER_FILES.with(|files_store| {
            let user_files = files_store.borrow();
            let user_files_map = user_files.get(&shared_file.owner)?;
            user_files_map.get(&shared_file.id).cloned()
        }).ok_or("No such file.")?;

        let can_view = file.check_permission(ShareFilePermission::CanView);
        if !can_view {
            return Err("No permission to view this file.".to_string());
        }

        let content_tree = FILE_CONTENTS.with(|file_contents| {
            let file_contents = file_contents.borrow();

            if let Some(file_map) = file_contents.get(&shared_file.owner) {
                file_map.get(&shared_file.id).cloned()
            } else {
                None
            }
        }).ok_or("No such file.")?;

        Ok((file, content_tree))
    }
}