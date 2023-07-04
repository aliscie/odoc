use std::collections::HashMap;
use std::fs::File;
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};

use candid::{CandidType, Deserialize};
use ic_cdk::caller;

use crate::{FILE_CONTENTS, USER_FILES};
use crate::contracts::Contract;
use crate::storage_schema::{ContentId, ContentTree, FileId};
use crate::tables::Table;

static COUNTER: AtomicU64 = AtomicU64::new(0);

#[derive(Clone, Debug, Deserialize, CandidType)]
pub enum ContentData {
    Table(Table),
    Image(Vec<u64>),
    Comment(String),
    // You can have like videos and other data.
}

#[derive(Clone, Debug, Deserialize, CandidType)]
pub struct ContentNode {
    pub id: ContentId,
    pub parent: Option<ContentId>,
    pub _type: String,
    pub text: String,
    pub data: Option<ContentData>,
    #[serde(default)]
    pub children: Vec<ContentId>,
}

impl ContentNode {
    pub fn get_file_content(file_id: FileId) -> Option<ContentTree> {
        FILE_CONTENTS.with(|file_contents| {
            let file_contents = file_contents.borrow();

            if let Some(file_map) = file_contents.get(&ic_cdk::api::caller()) {
                if let Some(content_tree) = file_map.get(&file_id) {
                    Some(content_tree.clone())
                } else {
                    None
                }
            } else {
                None
            }
        })
    }


    pub fn get_all_files_content() -> HashMap<FileId, ContentTree> {
        FILE_CONTENTS.with(|file_contents| {
            let file_contents = file_contents.borrow();
            let caller_principal = ic_cdk::api::caller();

            if let Some(file_map) = file_contents.get(&caller_principal) {
                file_map.clone()
            } else {
                HashMap::new()
            }
        })
    }



    pub fn new(file_id: FileId, content_parent_id: Option<ContentId>, node_type: String, text: String, data: Option<ContentData>) -> Option<ContentNode> {
        let caller_principal = ic_cdk::api::caller();
        let mut new_node = ContentNode {
            id: 0.to_string(), // The actual ID will be assigned later
            parent: content_parent_id.clone(),
            _type: node_type, // Set the appropriate type
            text,
            data, // Set the appropriate data
            children: Vec::new(),
        };

        // check if file with file_id exists
        let file = USER_FILES.with(|files| {
            let files = files.borrow();
            if let Some(file) = files.get(&caller_principal) {
                if let Some(file) = file.get(&file_id) {
                    Some(file.clone())
                } else {
                    None
                }
            } else {
                None
            }
        });

        if file.is_none() {
            return None;
        }
        FILE_CONTENTS.with(|contents| {
            let mut content_tree = contents.borrow_mut();
            let file_contents = content_tree.entry(caller_principal).or_insert_with(HashMap::new);
            let file_content_tree = file_contents.entry(file_id).or_insert_with(ContentTree::new);

            let content_id: ContentId = COUNTER.fetch_add(1, Ordering::Relaxed).to_string();
            new_node.id = content_id.clone();

            file_content_tree.insert(content_id.clone(), new_node.clone());

            if let Some(parent_id) = content_parent_id {
                if let Some(parent_node) = file_content_tree.get_mut(&parent_id) {
                    parent_node.children.push(content_id.clone());
                }
            }
        });

        Some(new_node)
    }

    pub fn update_file_contents(file_id: FileId, content_nodes: ContentTree) {
        FILE_CONTENTS.with(|file_contents| {
            let mut contents = file_contents.borrow_mut();

            let caller_principal = ic_cdk::api::caller();
            let file_contents_map = contents.entry(caller_principal).or_insert_with(HashMap::new);
            let file_content_tree: &mut ContentTree = file_contents_map.entry(file_id).or_insert_with(ContentTree::new);
            file_content_tree.extend(content_nodes);

            // for content_node in content_nodes {
            //     if let Some(existing_node) = file_content_tree.get_mut(&content_node.id) {
            //         *existing_node = content_node;
            //     } else {
            //         file_content_tree.insert(content_node.id, content_node);
            //     }
            // }
        });
    }

    pub fn delete_file_contents(file_id: FileId) {
        FILE_CONTENTS.with(|file_contents| {
            let mut contents = file_contents.borrow_mut();

            let caller_principal = ic_cdk::api::caller();
            if let Some(file_contents_map) = contents.get_mut(&caller_principal) {
                file_contents_map.remove(&file_id.clone());
            }
        });
    }
    pub fn delete_file_content(file_id: FileId) {
        FILE_CONTENTS.with(|file_contents| {
            let mut contents = file_contents.borrow_mut();
            let caller_principal = ic_cdk::api::caller();
            if let Some(file_contents_map) = contents.get_mut(&caller_principal) {
                file_contents_map.remove(&file_id);
            }
        });
    }
}
