use std::collections::HashMap;
use ic_cdk::caller;
use ic_cdk_macros::update;

use crate::{SHARED_USER_FILES, ShareFile, ShareFilePermission};
use crate::files::FileNode;
use crate::storage_schema::{ContentTree, FileId};
use candid::{CandidType, Deserialize, Principal};


#[update]
fn get_shared_file(share_id: String) -> Result<(FileNode, ContentTree), String> {
    // let file = FileNode::get(&share.file).ok_or("No such file with this id.")?;
    // let content_tree = ContentTree::get_content_tree(&share.file).ok_or("No such file with this id.")?;
    // Ok((file, content_tree))
    ShareFile::add_to_my_shared(&share_id)?;
    ShareFile::get_file(&share_id)
}


#[derive(PartialEq, Clone, Debug, Deserialize, CandidType)]
pub struct ShareFileInput {
    pub id: String,
    pub owner: Principal,
    pub permission: ShareFilePermission,
    pub users_permissions: HashMap<Principal, ShareFilePermission>,
}


#[update]
fn share_file(new_share_file: ShareFileInput) -> Result<ShareFile, String> {
    let ShareFileInput { id, owner, permission, users_permissions } = new_share_file.clone();
    let mut file = FileNode::get(&new_share_file.id).ok_or("No such file with this id.")?;
    file.permission = permission.clone();
    file.users_permissions = users_permissions.clone();
    file.save();

    let shared_file: ShareFile = {
        ShareFile {
            id: id.clone(),
            // file: id,
            owner,
        }
    };

    shared_file.save()
}