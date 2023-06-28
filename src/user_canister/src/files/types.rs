use std::collections::HashMap;
use std::fs::File;
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};

use candid::{CandidType, Deserialize};

use crate::USER_FILES;
use crate::files_content::ContentNode;
use crate::storage_schema::{ContentId, FileId};

pub static COUNTER: AtomicU64 = AtomicU64::new(0);

// #[derive(Debug, Serialize, Deserialize)]
#[derive(Clone, Debug, Deserialize, CandidType)]
pub struct FileNode {
    pub id: FileId,
    pub parent: Option<FileId>,
    pub name: String,
    pub content: ContentId,
    #[serde(default)]
    pub children: Vec<FileId>,
}

impl FileNode {
    pub fn new(name: String, parent: Option<FileId>) -> Self {
        let id: FileId = COUNTER.fetch_add(1, Ordering::Relaxed).to_string();
        let file = FileNode {
            id: id.clone(),
            parent: parent.clone(),
            name: name.clone(),
            content: 0.to_string(),
            children: Vec::new(),
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

    pub fn update_or_create(file_id: FileId, name: String, parent: Option<FileId>) -> Self {
        USER_FILES.with(
            |files_store| {
                let principal_id = ic_cdk::api::caller();

                let mut user_files = files_store.borrow_mut();
                // Check if the user principal is already in the file store
                let user_files_map = user_files.entry(principal_id.clone()).or_insert_with(HashMap::new);

                if let Some(file) = user_files_map.get_mut(&file_id) {
                    file.name = name.clone();
                    file.parent = parent.clone();
                    return file.clone();
                }

                let file = FileNode {
                    id: file_id.clone(),
                    parent: parent.clone(),
                    name: name.clone(),
                    content: 0.to_string(),
                    children: Vec::new(),
                };

                user_files_map.insert(file_id.clone(), file.clone());

                if let Some(parent_id) = parent.clone() {
                    if let Some(parent_file) = user_files_map.get_mut(&parent_id) {
                        parent_file.children.push(file_id.clone());
                    }
                }
                file
            }
        )
    }
    pub fn get_file(file_id: FileId) -> Option<Self> {
        USER_FILES.with(|files_store| {
            let principal_id = ic_cdk::api::caller();

            let user_files = files_store.borrow();
            let user_files_map = user_files.get(&principal_id)?;
            // let user_files_map = user_files.get(&principal_id).unwrap();
            user_files_map.get(&file_id).cloned()
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
