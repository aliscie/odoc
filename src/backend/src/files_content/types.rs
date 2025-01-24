use crate::files::FileNode;
use crate::storage_schema::{ContentId, ContentTree, FileId};
use crate::tables::Table;
use crate::{ShareFile, FILE_CONTENTS, USER_FILES};
use candid::{CandidType, Decode, Deserialize, Encode, Principal};
use ic_cdk::{caller, print};
use ic_stable_structures::Storable;
use std::collections::HashMap;
use std::sync::atomic::{AtomicU64, Ordering};
use ic_stable_structures::storable::Bound;
use std::borrow::Cow;

static COUNTER: AtomicU64 = AtomicU64::new(0);

#[derive(Clone, Debug, Deserialize, CandidType)]
pub enum ContentData {
    Table(Table),
    Image(Vec<u64>),
    Comment(String),
    // You can have like videos and other data.
}


#[derive(Clone, Debug, Deserialize, CandidType)]
pub struct OldContentNode {
    pub id: ContentId,
    pub parent: Option<ContentId>,
    pub _type: String,
    pub value: String,
    pub text: String,
    pub language: String,
    pub indent: u64,
    pub data: Option<ContentData>,
    pub listStyleType: String,
    pub listStart: u64,
    #[serde(default)]
    pub children: Vec<ContentId>,
}

#[derive(Clone, Debug, Deserialize, CandidType)]
pub struct ContentNode {
    pub formats: Vec<String>,
    pub id: ContentId,
    pub parent: Option<ContentId>,
    pub _type: String,
    pub value: String,
    pub text: String,
    pub language: String,
    pub indent: u64,
    pub data: Option<ContentData>,
    pub listStyleType: String,
    pub listStart: u64,
    #[serde(default)]
    pub children: Vec<ContentId>,
}

#[derive(Clone, Debug, Deserialize, CandidType)]
pub struct ContentNodeVec {
    pub files: HashMap<FileId, ContentTree>,
}

impl Storable for ContentNodeVec {
    fn to_bytes(&self) -> Cow<[u8]> {
        match Encode!(self) {
            Ok(bytes) => Cow::Owned(bytes),
            Err(e) => {
                print(format!("Error encoding ContentNodeVec: {}", e));
                panic!("Failed to encode ContentNodeVec");
            }
        }
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        match Decode!(bytes.as_ref(), Self) {
            Ok(data) => data,
            Err(_) => Self {
                files: HashMap::new(),
            }
        }
    }

    const BOUND: Bound = Bound::Unbounded;
}

impl ContentNode {
    pub fn get_file_content(user_id: String, file_id: FileId) -> Option<ContentTree> {
        FILE_CONTENTS.with(|file_contents| {
            let file_contents = file_contents.borrow();
            file_contents.get(&user_id)
                .and_then(|content_node_vec| {
                    content_node_vec.files.get(&file_id).cloned()
                })
        })
    }

    pub fn get_all_files_content() -> HashMap<FileId, ContentTree> {
        let current_user = caller().to_string();
        let mut res: HashMap<FileId, ContentTree> = FILE_CONTENTS.with(|file_contents| {
            let file_contents = file_contents.borrow();
            file_contents.get(&current_user)
                .map(|content_node_vec| content_node_vec.files.clone())
                .unwrap_or_default()
        });

        // Add shared files
        let shared_files: Vec<ShareFile> = ShareFile::get_shared();
        for file in shared_files {
            if let Ok((_, content)) = ShareFile::get_file(&file.id) {
                res.insert(file.id.clone(), content);
            } else {
                let err = ShareFile::get_file(&file.id).unwrap_err();
                print(format!("Error getting file {} from shared files: {}", file.id, err));
            }
        }

        res
    }

    pub fn get_page_files_content(page: f32) -> HashMap<FileId, ContentTree> {
        const FILES_PER_PAGE: usize = 15;
        let current_user = caller().to_string();
        let mut all_files: Vec<(FileId, ContentTree)> = Vec::new();

        // Get user's files
        FILE_CONTENTS.with(|file_contents| {
            let file_contents = file_contents.borrow();
            if let Some(content_node_vec) = file_contents.get(&current_user) {
                all_files.extend(
                    content_node_vec.files.iter()
                        .map(|(file_id, content)| (file_id.clone(), content.clone()))
                );
            }
        });

        // Add shared files
        let shared_files: Vec<ShareFile> = ShareFile::get_shared();
        for file in shared_files {
            if let Ok((_, content)) = ShareFile::get_file(&file.id) {
                all_files.push((file.id.clone(), content));
            } else {
                let err = ShareFile::get_file(&file.id).unwrap_err();
                print(format!("Error getting file {} from shared files: {}", file.id, err));
            }
        }

        let start_index = (page - 1.0) as usize * FILES_PER_PAGE;
        if start_index >= all_files.len() {
            return HashMap::new();
        }
        let end_index = usize::min(start_index + FILES_PER_PAGE, all_files.len());

        all_files[start_index..end_index]
            .iter()
            .cloned()
            .collect()
    }

    pub fn update_file_contents(file_id: FileId, content_nodes: ContentTree) {
        let current_user = caller().to_string();
        FILE_CONTENTS.with(|file_contents| {
            let mut contents = file_contents.borrow_mut();
            // Get existing content or create new one without cloning
            let mut new_content = ContentNodeVec {
                files: HashMap::new()
            };

            // If user exists, copy their existing files
            if let Some(existing_content) = contents.get(&current_user) {
                for (existing_file_id, existing_nodes) in &existing_content.files {
                    if existing_file_id != &file_id {
                        new_content.files.insert(existing_file_id.clone(), existing_nodes.clone());
                    }
                }
            }

            // Add/update the new content
            new_content.files.insert(file_id, content_nodes);

            // Insert the new content into stable storage
            let _ = contents.insert(current_user, new_content);
        });
    }
    pub fn delete_file_contents(file_id: FileId) {
        let current_user = caller().to_string();
        FILE_CONTENTS.with(|file_contents| {
            let mut contents = file_contents.borrow_mut();
            if let Some(mut content_node_vec) = contents.get(&current_user) {
                content_node_vec.files.remove(&file_id);
            }
        });
    }

    pub fn delete_file_content(file_id: FileId) {
        let current_user = caller().to_string();
        FILE_CONTENTS.with(|file_contents| {
            let mut contents = file_contents.borrow_mut();
            if let Some(mut content_node_vec) = contents.get(&current_user) {
                content_node_vec.files.remove(&file_id);
            }
        });
    }
}
