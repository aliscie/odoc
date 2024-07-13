use std::collections::HashMap;

use ic_cdk::caller;
use ic_cdk_macros::update;
use candid::{CandidType, Deserialize, Principal};

use crate::{SharesContract, StoredContract};
use crate::files::FileNode;
use crate::files_content::ContentNode;
use crate::storage_schema::{ContentId, ContentTree, ContractId, FileId};

#[update]
fn content_updates(file_id: FileId, content_parent_id: Option<ContentId>, new_text: String) -> Result<String, String> {
    if FileNode::get(&file_id).is_none() {
        return Err("No such file with this id.".to_string());
    }
    let parent_id: ContentId = match content_parent_id {
        Some(id) => id,
        None => ContentNode::new(file_id.clone(), None, String::from(""), String::from(""), None).unwrap().id
    };
    let updated_content = ContentNode::new(file_id, Some(parent_id), String::from(""), new_text, None);
    Ok(format!("Content created successfully. Content ID: {}", updated_content.unwrap().id))
}

// #[update]
// fn save_one_file(
//     file: FileNode,
//     content_tree: HashMap<FileId, ContentTree>,
//     contracts: Vec<StoredContract>,
// ) -> Result<(), String> {
//     // check permissions
//     if caller().to_string() != file.author {
//         if let Some(share_id) = file.share_id {
//             let share_file = ShareFile::get_file(share_id);
//         };
//     }
//     Ok(())
// }
#[derive(Clone, Debug, Deserialize, CandidType)]
pub struct FileIndexing {
    pub id: FileId,
    pub new_index: usize,
    pub parent: Option<FileId>,
}

#[update]
fn multi_updates(
    files: Vec<FileNode>,
    content_trees: Vec<HashMap<FileId, ContentTree>>,
    contracts: Vec<StoredContract>,
    delete_contracts: Vec<ContractId>,
    files_indexing: Vec<FileIndexing>,
) -> Result<String, String> {
    let mut messages = "".to_string();
    // Update file names and parents or create
    for file in files.clone() {
        file.save()?;
    }
    for indexing in files_indexing {
        if let Some(parent) = indexing.parent {
            let _ = FileNode::rearrange_child(parent, indexing.id, indexing.new_index);
        } else {
            let _ = FileNode::rearrange_file(indexing.id, indexing.new_index);
        }
    }
    // let ids: Vec<String> = files.iter().map(|file_node| file_node.id.clone()).collect();

    // TODO handle files reordering more effectinetly
    //  this request sending too much data to the backend
    // let _ = FileNode::save_file_nodes(files);

    for contract in contracts.clone() {
        if let StoredContract::SharesContract(share_contract) = contract.clone() {
            share_contract.save()?;
        }
        if let StoredContract::CustomContract(mut custom_contract) = contract {
            let res = custom_contract.save();
            if let Err(errors) = res {
                for err in errors {
                    let formatted_err = format!("Error: {} ", err.message);
                    messages.push_str(&formatted_err);
                }
            }
        }
    }


    // Update FILE_CONTENTS
    for update in content_trees {
        for (file_id, content_tree) in update {
            ContentNode::update_file_contents(file_id, content_tree);
        }
    };

    for contract_id in delete_contracts {
        // let contract = ...;
        // contract.delete();
    }

    messages.push_str("Updates applied successfully.");
    Ok(messages)
}
