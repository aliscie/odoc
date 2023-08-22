use std::collections::HashMap;
use candid::candid_method;
use ic_cdk_macros::query;

use crate::USER_FILES;
use crate::files::FileNode;
use crate::storage_schema::FileId;
use crate::user::User;

#[query]
#[candid_method(query)]
fn get_all_files() -> Option<HashMap<FileId, FileNode>> {
    // let principal_id = ic_cdk::api::caller();
    FileNode::get_all_files()
}


#[query]
#[candid_method(query)]
fn get_file(file_id: FileId) -> Option<FileNode> {
    // let principal_id = ic_cdk::api::caller();
    FileNode::get_file(file_id)
}
