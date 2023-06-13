use candid::candid_method;
use ic_cdk_macros::query;

use crate::USER_FILES;
use crate::files::FileNode;
use crate::user::User;

#[query]
#[candid_method(query)]
fn get_all_files() -> Option<Vec<FileNode>> {
    let principal_id = ic_cdk::api::caller();
    FileNode::get_all_files()
}
