use ic_cdk::caller;
use ic_cdk_macros::update;
use std::collections::HashMap;

use crate::files::{FileNode, FileNodeVector};
use crate::storage_schema::{ContentTree, FileId};
use crate::{ShareFile, ShareFilePermission, SHARED_USER_FILES};
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
    let ShareFileInput {
        id,
        owner,
        permission,
        users_permissions,
    } = new_share_file.clone();

    // Get and update the original file
    let mut file = FileNode::get(&id).ok_or("No such file with this id.")?;
    file.share_id = Some(id.clone());

    // Set the default permission for the file
    file.permission = ShareFilePermission::CanView;  // Set default to CanView

    // Add the specific permissions for users
    file.users_permissions = users_permissions;

    // If the caller is not the owner, add them to users_permissions
    let caller = caller();
    if caller != owner {
        file.users_permissions.insert(caller, permission.clone());
    }

    file.save()?;

    let shared_file = ShareFile {
        id: id.clone(),
        owner,
    };

    shared_file.save()
}

