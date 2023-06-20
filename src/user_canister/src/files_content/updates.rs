use std::collections::HashMap;

use candid::candid_method;
use ic_cdk_macros::update;
use crate::FILE_CONTENTS;

use crate::files::FileNode;
use crate::files_content::ContentNode;
use crate::storage_schema::{ContentTree, FileId};

#[update]
#[candid_method(update)]
fn content_updates(file_id: u64, content_parent_id: Option<u64>, new_text: String) -> Result<String, String> {
    if FileNode::get_file(file_id).is_none() {
        return Err("No such file with this id.".to_string());
    }
    let parent_id: u64 = match content_parent_id {
        Some(id) => id,
        None => ContentNode::new(file_id, None, String::from(""), String::from(""), None).unwrap().id
    };
    let updated_content = ContentNode::new(file_id, Some(parent_id), String::from(""), new_text, None);
    Ok(format!("Content created successfully. Content ID: {}", updated_content.unwrap().id))
}


#[update]
#[candid_method(update)]
fn multi_files_content_updates(updates: Vec<HashMap<FileId, ContentTree>>) -> Result<String, String> {
    // Iterate over each update
    for update in updates {
        // Iterate over each file and its corresponding content tree in the update
        for (file_id, content_tree) in update {
            // Update the file contents
            ContentNode::update_file_contents(file_id, content_tree);
        }
    }
    Ok("Files content updated successfully".to_string())
}



