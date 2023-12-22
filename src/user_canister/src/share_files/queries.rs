use ic_cdk_macros::query;
use crate::files::FileNode;

use crate::ShareFile;
use crate::storage_schema::ContentTree;

// TODO Note here should be only queries not updates.
#[query]
fn get_shared_file(share_id: String) -> Result<(FileNode, ContentTree), String> {
    // let file = FileNode::get(&share.file).ok_or("No such file with this id.")?;
    // let content_tree = ContentTree::get_content_tree(&share.file).ok_or("No such file with this id.")?;
    // Ok((file, content_tree))
    ShareFile::get_file(&share_id)
}

#[query]
fn get_share_file(share_id: String) -> Result<ShareFile, String> {
    ShareFile::get(&share_id)
}

