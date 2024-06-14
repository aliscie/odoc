use std::collections::HashMap;

use std::sync::atomic::{AtomicU64, Ordering};


use candid::{CandidType, Deserialize, Principal};
use ic_cdk::{caller, print};


use crate::{FILE_CONTENTS, ShareFile, USER_FILES};
use crate::files::FileNode;

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
    pub language: String,
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
        let mut res: HashMap<FileId, ContentTree> = FILE_CONTENTS.with(|file_contents| {
            let file_contents = file_contents.borrow();
            if let Some(file_map) = file_contents.get(&caller()) {
                file_map.clone()
            } else {
                HashMap::new()
            }
        });

        // add content from shared files
        let shared_files: Vec<ShareFile> = ShareFile::get_shared();
        for file in shared_files {
            let file_node: Result<(FileNode, ContentTree), String> = ShareFile::get_file(&file.id);
            if let Ok((file_node, content)) = file_node {
                res.insert(file.id.clone(), content);
            } else {
                let err = file_node.unwrap_err();
                print(
                    format!(
                        "Error getting file {} from shared files: {}",
                        file.id, err
                    )
                        .as_str(),
                );
            }
        }

        res
    }


    pub fn new(file_id: FileId, content_parent_id: Option<ContentId>, node_type: String, text: String, data: Option<ContentData>) -> Option<ContentNode> {
        let caller_principal = ic_cdk::api::caller();

        // Check if file with file_id exists
        let file_exists = USER_FILES.with(|files| {
            let files = files.borrow();
            files.get(&caller_principal)
                .and_then(|user_files_vec| user_files_vec.iter().find(|f| f.id == file_id))
                .is_some()
        });

        if !file_exists {
            return None;
        }

        // Proceed with creating the new node as before...
        let content_id: ContentId = COUNTER.fetch_add(1, Ordering::Relaxed).to_string();
        let mut new_node = ContentNode {
            id: content_id, // Now directly using the new content ID
            parent: content_parent_id,
            _type: node_type,
            text,
            language: "".to_string(),
            data,
            children: Vec::new(),
        };

        FILE_CONTENTS.with(|contents| {
            let mut content_tree = contents.borrow_mut();
            let file_contents = content_tree.entry(caller_principal).or_insert_with(HashMap::new);
            let file_content_tree = file_contents.entry(file_id).or_insert_with(Vec::new);

            file_content_tree.push(new_node.clone());

            // If there's a parent ID, add this node to the parent's children list
            if let Some(parent_id) = &new_node.parent {
                if let Some(parent_node) = file_content_tree.iter_mut().find(|node| &node.id == parent_id) {
                    parent_node.children.push(new_node.id.clone());
                }
            }
        });

        Some(new_node)
    }


    //TODO The order comes incorrect after saving.
    pub fn update_file_contents(file_id: FileId, content_nodes: ContentTree) {
        FILE_CONTENTS.with(|file_contents| {
            let mut contents = file_contents.borrow_mut();
            let file_contents_map = contents.entry(caller()).or_insert_with(HashMap::new);
            file_contents_map.insert(file_id, content_nodes);
        });
    }

    pub fn delete_file_contents(file_id: FileId) {
        FILE_CONTENTS.with(|file_contents| {
            let mut contents = file_contents.borrow_mut();

            if let Some(file_contents_map) = contents.get_mut(&caller()) {
                file_contents_map.remove(&file_id.clone());
            }
        });
    }
    pub fn delete_file_content(file_id: FileId) {
        FILE_CONTENTS.with(|file_contents| {
            let mut contents = file_contents.borrow_mut();
            if let Some(file_contents_map) = contents.get_mut(&caller()) {
                file_contents_map.remove(&file_id);
            }
        });
    }
}
