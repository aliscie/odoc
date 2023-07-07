use std::collections::HashMap;

use candid::candid_method;
use ic_cdk::caller;
use ic_cdk_macros::update;
use crate::{CONTRACTS_STORE, FILE_CONTENTS, Payment, StoredContract};

use crate::files::FileNode;
use crate::files_content::ContentNode;
use crate::storage_schema::{ContentId, ContentTree, ContractId, FileId};

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
    delete_contracts: Vec<ContractId>,
) -> Result<String, String> {
    let mut messages = "".to_string();
    // Update file names and parents or create
    for file in files {
        FileNode::update_or_create(file);
    }


    // Update payment contracts
    Payment::update_payment_contracts(contracts)?;

    // Update FILE_CONTENTS
    for update in updates {
        for (file_id, content_tree) in update {
            ContentNode::update_file_contents(file_id, content_tree);
        }
    }
    for contract_id in delete_contracts {
        let message = Payment::delete_for_both(contract_id);
        if let Err(e) = message {
            messages.push_str(&format!("Error deleting contract: {}", e));
        }
    }

    messages.push_str("Updates applied successfully.");
    Ok(messages)
}
