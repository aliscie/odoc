use std::collections::HashMap;
use std::fs::File;
use std::time::{SystemTime, UNIX_EPOCH};

use candid::{CandidType, Deserialize};

use crate::{USER_FILES};
use std::sync::atomic::{AtomicU64, Ordering};

static COUNTER: AtomicU64 = AtomicU64::new(0);

// #[derive(Debug, Serialize, Deserialize)]
#[derive(Clone, Debug, Deserialize, CandidType)]
pub struct FileNode {
    pub id: u64,
    pub parent: Option<u64>,
    pub name: String,
    pub content: u64,
    #[serde(default)]
    pub children: Vec<u64>,
}

impl FileNode {
    pub fn new(name: String, parent: Option<u64>) -> Self {
        let id = COUNTER.fetch_add(1, Ordering::Relaxed);
        let file = FileNode {
            id,
            parent,
            name: name.clone(),
            content: 0,
            children: Vec::new(),
        };

        USER_FILES.with(|files_store| {
            let principal_id = ic_cdk::api::caller();

            let mut user_files = files_store.borrow_mut();
            // Check if the user principal is already in the file store
            let user_files_map = user_files.entry(principal_id.clone()).or_insert_with(HashMap::new);

            user_files_map.insert(id, file.clone());

            if let Some(parent_id) = parent {
                if let Some(parent_file) = user_files_map.get_mut(&parent_id) {
                    parent_file.children.push(id);
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


    pub fn get_file(file_id: u64) -> Self {
        USER_FILES.with(|files_store| {
            let principal_id = ic_cdk::api::caller();

            let user_files = files_store.borrow();
            let user_files_map = user_files.get(&principal_id).unwrap();

            user_files_map.get(&file_id).unwrap().clone()
        })
    }

    pub fn get_all_files() -> Option<HashMap<u64, FileNode>> {
        USER_FILES.with(|files_store| {
            let principal_id = ic_cdk::api::caller();

            let user_files = files_store.borrow();
            let user_files_map = user_files.get(&principal_id)?;

            let all_files: HashMap<u64, FileNode> = user_files_map.clone();
            Some(all_files)
        })
    }
    pub fn delete_file(file_id: u64) -> Option<FileNode> {
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
            if let Some(parent_id) = deleted_file.parent {
                if let Some(parent_file) = user_files_map.get_mut(&parent_id) {
                    parent_file.children.retain(|&child_id| child_id != file_id);
                }
            }

            Some(deleted_file)
        })
    }

    fn delete_children_recursive(file_id: &u64, files_map: &mut HashMap<u64, FileNode>) {
        if let Some(file) = files_map.remove(file_id) {
            for child_id in file.children {
                FileNode::delete_children_recursive(&child_id, files_map);
            }
        }
    }
    pub fn move_file(file_id: u64, new_parent: Option<u64>) -> Option<()> {
        USER_FILES.with(|files_store| {
            let principal_id = ic_cdk::api::caller();

            let mut user_files = files_store.borrow_mut();
            let user_files_map = user_files.get_mut(&principal_id)?;

            if let Some(file) = user_files_map.clone().get_mut(&file_id) {
                let old_parent = file.parent;

                // Remove the file ID from its old parent's children list
                if let Some(old_parent_id) = old_parent {
                    if let Some(old_parent_file) = user_files_map.get_mut(&old_parent_id) {
                        old_parent_file.children.retain(|&child_id| child_id != file_id);
                    }
                }

                // Update the file's parent
                file.parent = new_parent;

                // Add the file ID to its new parent's children list
                if let Some(new_parent_id) = new_parent {
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

    pub fn rename_file(file_id: u64, new_name: String) -> bool {
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
