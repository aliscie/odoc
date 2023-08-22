use std::collections::HashMap;

use candid::candid_method;
use ic_cdk_macros::query;

use crate::files_content::ContentNode;
use crate::storage_schema::{ContentTree, FileId};

#[query]
#[candid_method(query)]
fn get_file_content(file_id: u64) -> Option<ContentTree> {
    let content = ContentNode::get_file_content(file_id);
    // if content.unwrap().is_private && caller() != FileNode::get(file_id).auther {
    //     return None;
    // }
    content
}

#[query]
#[candid_method(query)]
fn get_all_files_content() -> HashMap<FileId, ContentTree> {
    ContentNode::get_all_files_content()
}
