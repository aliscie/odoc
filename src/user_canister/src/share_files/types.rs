
use candid::Principal;
use ic_cdk::{caller};
use crate::{FILE_CONTENTS, FILES_SHARE_STORE, USER_FILES};
use crate::files::FileNode;

use candid::{CandidType, Deserialize};
use crate::storage_schema::{ContentTree, FileId};

#[derive(Clone, Debug, Deserialize, CandidType)]
pub struct ShareFile {
    pub file: FileId,
    pub owner: Principal,
    // TODO later consider sharing children of file
    //  children
    //  contracts
}

impl ShareFile {
    pub fn new(file_id: FileId, share_id: String) -> Result<String, String> {
        let file = FileNode::get_file(file_id.clone()).ok_or("No such file with this id.")?;

        let share_file = ShareFile {
            file: file.id,
            owner: caller(),
        };

        let _shared_file = FILES_SHARE_STORE.with(|files_share_store| {
            let mut files_share_store = files_share_store.borrow_mut();
            if let Some(share_file) = files_share_store.get(&share_id) {
                Some(share_file.clone())
            } else {
                let share_id = share_id.clone();
                files_share_store.insert(share_id, share_file.clone());
                Some(share_file)
            }
        });

        FileNode::update_or_create(FileNode {
            id: file_id.clone(),
            parent: file.parent.clone(),
            name: file.name.clone(),
            children: file.children.clone(),
            share_id: Some(share_id.clone()),

        });

        Ok(share_id)
    }

    pub fn get_file(share_id: String) -> Result<(FileNode, ContentTree), String> {
        let shared_file = FILES_SHARE_STORE.with(|files_share_store| {
            let files_share_store = files_share_store.borrow();
            if let Some(share_file) = files_share_store.get(&share_id) {
                return Some(share_file.clone());
            }
            return None;
        }).ok_or("No such share id.")?;

        let file = USER_FILES.with(|files_store| {
            let user_files = files_store.borrow();
            let user_files_map = user_files.get(&shared_file.owner)?;
            user_files_map.get(&shared_file.file).cloned()
        }).ok_or("No such file.")?;

        let content_tree = FILE_CONTENTS.with(|file_contents| {
            let file_contents = file_contents.borrow();

            if let Some(file_map) = file_contents.get(&shared_file.owner) {
                if let Some(content_tree) = file_map.get(&shared_file.file) {
                    Some(content_tree.clone())
                } else {
                    None
                }
            } else {
                None
            }
        }).ok_or("No such file.")?;

        Ok((file, content_tree))
    }
}