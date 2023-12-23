use std::collections::HashMap;
use ic_cdk::caller;

use ic_cdk_macros::query;
use crate::{FILE_CONTENTS, USER_FILES};


use crate::files_content::ContentNode;
use crate::storage_schema::{ContentTree, FileId};

#[query]
fn get_file_content(file_id: FileId) -> Option<ContentTree> {
    let content = ContentNode::get_file_content(file_id);
    // if content.unwrap().is_private && caller() != FileNode::get(file_id).auther {
    //     return None;
    // }
    content
}

#[query]
fn get_all_files_content() -> HashMap<FileId, ContentTree> {
    ContentNode::get_all_files_content()
}


#[query]
fn search_files_content(search_text: String, case_insensitive: bool) -> HashMap<FileId, ContentTree> {
    // also search in the SHARED_USER_FILES
    FILE_CONTENTS.with(|file_contents| {
        let file_contents = file_contents.borrow();
        if let Some(file_map) = file_contents.get(&caller()) {
            // filter by the file.content.values().content_node.text
            let filtered_files = file_map
                .iter()
                .filter_map(|(file_id, content_tree)| {
                    let filtered_content_tree = content_tree
                        .iter()
                        .filter(|(_, content)| {
                            if case_insensitive {
                                content.text.to_lowercase().contains(&search_text.to_lowercase())
                            } else {
                                content.text.contains(&search_text)
                            }
                        })
                        .map(|(key, value)| (key.clone(), value.clone()))
                        .collect::<ContentTree>();

                    if !filtered_content_tree.is_empty() {
                        Some((file_id.clone(), filtered_content_tree))
                    } else {
                        None
                    }
                })
                .collect::<HashMap<FileId, ContentTree>>();

            filtered_files
        } else {
            HashMap::new()
        }
    })
}


