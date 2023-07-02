use std::collections::HashMap;

use candid::candid_method;
use ic_cdk::caller;
use ic_cdk_macros::update;
use crate::{CONTRACTS_STORE, FILE_CONTENTS, Payment, StoredContract};

use crate::files::FileNode;
use crate::files_content::ContentNode;
use crate::storage_schema::{ContentId, ContentTree, FileId};

#[update]
#[candid_method(update)]
fn content_updates(file_id: FileId, content_parent_id: Option<ContentId>, new_text: String) -> Result<String, String> {
    if FileNode::get_file(file_id.clone()).is_none() {
        return Err("No such file with this id.".to_string());
    }
    let parent_id: ContentId = match content_parent_id {
        Some(id) => id,
        None => ContentNode::new(file_id.clone(), None, String::from(""), String::from(""), None).unwrap().id
    };
    let updated_content = ContentNode::new(file_id, Some(parent_id), String::from(""), new_text, None);
    Ok(format!("Content created successfully. Content ID: {}", updated_content.unwrap().id))
}




#[update]
#[candid_method(update)]
fn multi_updates(
    files: Vec<FileNode>,
    updates: Vec<HashMap<FileId, ContentTree>>,
    contracts: Vec<StoredContract>,
) -> Result<String, String> {
    // Update file names and parents
    for file in files {
        let file_id = file.id.clone();
        if let Some(mut updated_file) = FileNode::get_file(file_id.clone()) {
            if let Some(parent_id) = file.parent {
                updated_file.parent = Some(parent_id);
            }
            if !file.name.is_empty() {
                updated_file.name = file.name;
            }
            FileNode::update_or_create(file_id, updated_file.name, updated_file.parent);
        }
    }

    // Update FILE_CONTENTS
    for update in updates {
        for (file_id, content_tree) in update {
            ContentNode::update_file_contents(file_id, content_tree);
        }
    }

    // Update payment contracts
    Payment::update_payment_contracts(contracts)?;

    Ok("Updates applied successfully".to_string())
}
