use crate::files::FileNode;
use crate::storage_schema::{ContentId, ContentTree, FileId};
use crate::tables::Table;
use crate::{ShareFile, FILE_CONTENTS, USER_FILES};
use candid::{CandidType, Decode, Deserialize, Encode, Principal};
use ic_cdk::{caller, print};
use ic_stable_structures::Storable;
use std::collections::HashMap;
use std::sync::atomic::{AtomicU64, Ordering};
// use candid::{Decode, Encode};
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
    pub contents: HashMap<FileId, ContentTree>,
}

impl Storable for ContentNodeVec {
    fn to_bytes(&self) -> Cow<[u8]> {
        match Encode!(self) {
            Ok(bytes) => Cow::Owned(bytes),
            Err(e) => {
                // Log the error
                panic!("{}",format!("Error encoding ContentNodeVec: {}", e));
                // Return empty content as fallback
                Cow::Owned(Encode!(&ContentNodeVec {
                    contents: HashMap::new(),
                }).unwrap_or_else(|_| Vec::new()))
            }
        }
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap_or_else(|_| {
            // Try to decode with old format
            #[derive(CandidType, Deserialize)]
            struct OldContentNodeVec {
                pub contents: HashMap<FileId, Vec<OldContentNode>>,
            }

            match Decode!(bytes.as_ref(), OldContentNodeVec) {
                Ok(old_vec) => {
                    ContentNodeVec {
                        contents: old_vec.contents.into_iter()
                            .map(|(file_id, old_nodes)| {
                                let new_nodes = old_nodes.into_iter()
                                    .map(|old| {
                                        let mut new = ContentNode {
                                            formats: Vec::new(),
                                            id: old.id,
                                            parent: old.parent,
                                            _type: old._type,
                                            value: old.value,
                                            text: old.text,
                                            language: old.language,
                                            indent: old.indent,
                                            data: old.data,
                                            listStyleType: old.listStyleType,
                                            listStart: old.listStart,
                                            children: old.children,
                                        };
                                        new
                                    })
                                    .collect();
                                (file_id, new_nodes)
                            })
                            .collect()
                    }
                }
                Err(e) => {
                    ic_cdk::print(format!("Failed to decode both formats: {}", e));
                    ContentNodeVec {
                        contents: HashMap::new(),
                    }
                }
            }
        })
    }

    const BOUND: Bound = Bound::Unbounded;
}

impl ContentNode {
    pub fn get_file_content(file_id: FileId) -> Option<ContentTree> {
        FILE_CONTENTS.with(|file_contents| {
            let file_contents = file_contents.borrow();
            file_contents.get(&file_id).map(|content_node_vec| {
                content_node_vec
                    .contents
                    .get(&file_id)
                    .cloned()
                    .unwrap_or_else(Vec::new)
            })
        })
    }

    pub fn get_all_files_content() -> HashMap<FileId, ContentTree> {
        let mut res: HashMap<FileId, ContentTree> = FILE_CONTENTS.with(|file_contents| {
            let file_contents = file_contents.borrow();
            file_contents
                .iter()
                .map(|(file_id, content_node_vec)| {
                    (
                        file_id.clone(),
                        content_node_vec
                            .contents
                            .values()
                            .cloned()
                            .flatten()
                            .collect(),
                    )
                })
                .collect()
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
                    format!("Error getting file {} from shared files: {}", file.id, err).as_str(),
                );
            }
        }

        res
    }

    pub fn get_page_files_content(page: f32) -> HashMap<FileId, ContentTree> {
        const FILES_PER_PAGE: usize = 15; // Number of files per page
        let mut all_files: Vec<(FileId, ContentTree)> = Vec::new();

        // Access user-specific files
        FILE_CONTENTS.with(|file_contents| {
            let file_contents = file_contents.borrow();
            let collected_files: Vec<(FileId, ContentTree)> = file_contents
                .iter()
                .flat_map(|(file_id, content_node_vec)| {
                    content_node_vec
                        .contents
                        .iter()
                        .map(move |(_, content_tree)| (file_id.clone(), content_tree.clone()))
                        .collect::<Vec<(FileId, ContentTree)>>()
                })
                .collect();
            all_files.extend(collected_files);
        });
        // Access shared files
        let shared_files: Vec<ShareFile> = ShareFile::get_shared();
        for file in shared_files {
            if let Ok((file_node, content)) = ShareFile::get_file(&file.id) {
                all_files.push((file.id.clone(), content));
            } else {
                let err = ShareFile::get_file(&file.id).unwrap_err();
                print(
                    format!("Error getting file {} from shared files: {}", file.id, err).as_str(),
                );
            }
        }

        // Calculate the start and end indices for the requested page
        let start_index = (page - 1.0) as usize * FILES_PER_PAGE;
        if start_index >= all_files.len() {
            return HashMap::new(); // Return an empty list if start index is out of range
        }
        let end_index = usize::min(start_index + FILES_PER_PAGE, all_files.len());

        // Return the files for the requested page
        all_files[start_index..end_index]
            .iter()
            .cloned()
            .collect::<HashMap<FileId, ContentTree>>()
    }

    pub fn update_file_contents(file_id: FileId, content_nodes: ContentTree) {
        FILE_CONTENTS.with(|file_contents| {
            let mut contents = file_contents.borrow_mut();
            let mut content_map = HashMap::new();
            content_map.insert(file_id.clone(), content_nodes);
            contents.insert(
                file_id,
                ContentNodeVec {
                    contents: content_map,
                },
            );
        });
    }

    pub fn delete_file_contents(file_id: FileId) {
        FILE_CONTENTS.with(|file_contents| {
            let mut contents = file_contents.borrow_mut();
            contents.remove(&file_id);
        });
    }

    pub fn delete_file_content(file_id: FileId) {
        FILE_CONTENTS.with(|file_contents| {
            let mut contents = file_contents.borrow_mut();
            contents.remove(&file_id);
        });
    }
}
