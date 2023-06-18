use std::fs::File;

use candid::candid_method;
use ic_cdk_macros::update;

use crate::{USER_FILES};
use crate::files::FileNode;
use crate::files_content::{ContentData, ContentNode};
use crate::tables::Table;
use crate::user::{RegisterUser, User};

#[update]
#[candid_method(update)]
fn create_new_file(name: String, parent: Option<u64>) -> FileNode {
    let file = FileNode::new(name.clone(), parent);

    let content_node = ContentNode::new(file.id, None, String::from(""), String::from(""), None);
    let child_content_node = ContentNode::new(file.id, Some(content_node.clone().unwrap().id), String::from("h1"), String::from("child is here."), None);

    USER_FILES.with(|files_store| {
        let principal_id = ic_cdk::api::caller();

        let mut user_files = files_store.borrow_mut();
        let user_files_map = user_files.get_mut(&principal_id).unwrap();

        // Update the content ID of the file
        if let Some(file) = user_files_map.get_mut(&file.id) {
            file.content = content_node.unwrap().id;
        }
    });

    file
}


#[update]
#[candid_method(update)]
fn delete_file(id: u64) -> Option<FileNode> {
    FileNode::delete_file(id)
}


#[update]
#[candid_method(update)]
fn rename_file(id: u64, name: String) -> bool {
    FileNode::rename_file(id, name)
}
