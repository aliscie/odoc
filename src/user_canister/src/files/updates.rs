use std::fs::File;

use candid::candid_method;
use ic_cdk_macros::update;

use crate::{USER_FILES};
use crate::files::FileNode;
use crate::files_content::{ContentData, ContentNode};
use crate::storage_schema::FileId;
use crate::tables::Table;
use crate::user::{RegisterUser, User};

#[update]
#[candid_method(update)]
fn create_new_file(name: String, parent: Option<FileId>) -> FileNode {
    let file = FileNode::new(name.clone(), parent);
    file
}


#[update]
#[candid_method(update)]
fn delete_file(id: FileId) -> Option<FileNode> {
    ContentNode::delete_file_contents(id.clone());
    FileNode::delete_file(id)
}


#[update]
#[candid_method(update)]
fn rename_file(id: FileId, name: String) -> bool {
    FileNode::rename_file(id, name)
}
