use std::collections::HashMap;

use std::sync::atomic::{AtomicU64, Ordering};


use candid::{CandidType, Deserialize, Principal};
use ic_cdk::caller;

use crate::{ShareFile, ShareFilePermission, USER_FILES};

use crate::storage_schema::{FileId};

pub static COUNTER: AtomicU64 = AtomicU64::new(0);

// #[derive(Debug, Serialize, Deserialize)]
#[derive(Clone, Debug, Deserialize, CandidType)]
pub struct FileNode {
    pub id: FileId,
    pub parent: Option<FileId>,
    pub name: String,
    #[serde(default)]
    pub children: Vec<FileId>,
    pub share_id: Option<String>,
    pub author: String,
}

impl FileNode {
    pub fn new(name: String, parent: Option<FileId>) -> Self {
        let id: FileId = COUNTER.fetch_add(1, Ordering::Relaxed).to_string();
        let file = FileNode {
            id: id.clone(),
            parent: parent.clone(),
            name: name.clone(),
            children: Vec::new(),
            share_id: None,
            author: caller().to_string(),
        };

        USER_FILES.with(|files_store| {
            let principal_id = ic_cdk::api::caller();

            let mut user_files = files_store.borrow_mut();
            // Check if the user principal is already in the file store
            let user_files_map = user_files.entry(principal_id.clone()).or_insert_with(HashMap::new);

            user_files_map.insert(id.clone(), file.clone());

            if let Some(parent_id) = parent.clone() {
                if let Some(parent_file) = user_files_map.get_mut(&parent_id) {
                    parent_file.children.push(id.clone());
                }
            }
        });
        file
    }

    // pub fn get_file_mut<'a>(file_id: u64) -> Option<&'a mut FileNode> {
    //     USER_FILES.with(|files_store| {
    //         let principal_id = ic_cdk::api::caller();
    //
    //         let mut user_files = files_store.borrow_mut();
    //         let user_files_map = user_files.get_mut(&principal_id)?;
    //
    //         user_files_map.get_mut(&file_id)
    //     })
    // }


    pub fn save(&self) -> Result<Self, String> {
        if caller().to_string() != self.author {
            if let Some(share_id) = self.share_id.clone() {
                let res = ShareFile::get(&share_id)?;
                let can_update = res.check_permission(ShareFilePermission::CanUpdate);
                if !can_update {
                    return Err("You don't have permission to update this file".to_string());
                };
            } else {
                return Err("No such file to share.".to_string());
            }
        }
        USER_FILES.with(|files_store| {
            // let principal_id = ic_cdk::api::caller();

            let mut user_files = files_store.borrow_mut();
            // Check if the user principal is already in the file store
            let author: Principal = Principal::from_text(self.clone().author).unwrap();
            let user_files_map = user_files.entry(author).or_default();

            user_files_map.insert(self.id.clone(), self.clone());

            if let Some(parent_id) = self.parent.clone() {
                if let Some(parent_file) = user_files_map.get_mut(&parent_id) {
                    parent_file.children.push(self.id.clone());
                }
            }
        });
        Ok(self.clone())
    }


    pub fn get_file(file_id: &FileId) -> Option<Self> {
        USER_FILES.with(|files_store| {
            let principal_id = ic_cdk::api::caller();

            let user_files = files_store.borrow();
            let user_files_map = user_files.get(&principal_id)?;
            // let user_files_map = user_files.get(&principal_id).unwrap();
            user_files_map.get(file_id).cloned()
        })
    }
    pub fn get_all_files() -> Option<HashMap<FileId, FileNode>> {
        USER_FILES.with(|files_store| {
            let principal_id = ic_cdk::api::caller();

            let user_files = files_store.borrow();
            let user_files_map = user_files.get(&principal_id)?;

            let all_files: HashMap<FileId, FileNode> = user_files_map.clone();
            Some(all_files)
        })
    }
    pub fn delete_file(file_id: FileId) -> Option<FileNode> {
        USER_FILES.with(|files_store| {
            let principal_id = ic_cdk::api::caller();

            let mut user_files = files_store.borrow_mut();
            let user_files_map = user_files.get_mut(&principal_id)?;

            let deleted_file = user_files_map.remove(&file_id)?;

            // Recursively delete children files
            for child in deleted_file.children.clone() {
                FileNode::delete_children_recursive(&child, user_files_map);
            }

            // Remove the file ID from its parent's children list
            if let Some(parent_id) = deleted_file.parent.clone() {
                if let Some(parent_file) = user_files_map.get_mut(&parent_id) {
                    parent_file.children.retain(|child_id| child_id.clone() != file_id);
                }
            }

            Some(deleted_file.clone())
        })
    }

    fn delete_children_recursive(file_id: &FileId, files_map: &mut HashMap<FileId, FileNode>) {
        if let Some(file) = files_map.remove(file_id) {
            for child_id in file.children {
                FileNode::delete_children_recursive(&child_id, files_map);
            }
        }
    }
    pub fn move_file(file_id: FileId, new_parent: Option<FileId>) -> Option<()> {
        USER_FILES.with(|files_store| {
            let principal_id = ic_cdk::api::caller();

            let mut user_files = files_store.borrow_mut();
            let user_files_map = user_files.get_mut(&principal_id)?;

            if let Some(file) = user_files_map.clone().get_mut(&file_id) {
                let old_parent = file.clone().parent;

                // Remove the file ID from its old parent's children list
                if let Some(old_parent_id) = old_parent {
                    if let Some(old_parent_file) = user_files_map.get_mut(&old_parent_id) {
                        old_parent_file.children.retain(|child_id| *child_id != *file_id);
                    }
                }

                // Update the file's parent
                file.parent = new_parent.clone();

                // Add the file ID to its new parent's children list
                if let Some(new_parent_id) = new_parent.clone() {
                    if let Some(new_parent_file) = user_files_map.get_mut(&new_parent_id) {
                        new_parent_file.children.push(file_id);
                    }
                }

                Some(())
            } else {
                None
            }
        })
    }

    pub fn rename_file(file_id: FileId, new_name: String) -> bool {
        USER_FILES.with(|files_store| {
            let principal_id = ic_cdk::api::caller();

            let mut user_files = files_store.borrow_mut();
            let user_files_map = user_files.get_mut(&principal_id).unwrap();

            if let Some(file) = user_files_map.get_mut(&file_id) {
                file.name = new_name;
                true
            } else {
                false
            }
        })
    }
}
