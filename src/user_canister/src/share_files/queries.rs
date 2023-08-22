use candid::candid_method;
use ic_cdk_macros::update;
use crate::files::FileNode;

use crate::ShareFile;
use crate::storage_schema::ContentTree;

#[update]
#[candid_method(update)]
fn get_shared_file(share_id: String) -> Result<(FileNode, ContentTree), String> {
    ShareFile::get_file(share_id)
}
