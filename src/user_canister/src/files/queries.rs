use std::collections::HashMap;
use ic_cdk_macros::query;


use crate::files::FileNode;
use crate::storage_schema::FileId;


#[query]
fn get_all_files() -> Option<HashMap<FileId, FileNode>> {
    // let principal_id = ic_cdk::api::caller();
    FileNode::get_all_files()
}


#[query]
fn get_file(file_id: FileId) -> Option<FileNode> {
    // let principal_id = ic_cdk::api::caller();
    FileNode::get_file(file_id)
}
