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
    pub name: String,
    // pub date: String, // TODO date created
    #[serde(default)]
    pub children: Vec<u64>,
}

impl FileNode {
    pub fn new(name: String, parent: Option<u64>) -> Self {
        let id = COUNTER.fetch_add(1, Ordering::Relaxed);
        let file = FileNode {
            id,
            name: name.clone(),
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

    pub fn get_all_files() -> Option<Vec<FileNode>> {
        USER_FILES.with(|files_store| {
            let principal_id = ic_cdk::api::caller();

            let user_files = files_store.borrow();
            let user_files_map = user_files.get(&principal_id)?;

            let all_files: Vec<FileNode> = user_files_map.values().cloned().collect();
            Some(all_files)
        })
    }
}