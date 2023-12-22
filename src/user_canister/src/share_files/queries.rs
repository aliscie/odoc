use ic_cdk_macros::query;
use crate::files::FileNode;

use crate::{SHARED_USER_FILES, ShareFile};
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
fn get_shared_files() -> Result<Vec<(FileNode, ContentTree)>, String> {
    SHARED_USER_FILES.with(|files| {
        let files = files.borrow();
        let files: Vec<(FileNode, ContentTree)> = files
            .iter()
            .map(|(_, share)| {
                let res: Result<(FileNode, ContentTree), String> = ShareFile::get_file(&share.id);
                if let Ok(res) = res {
                    res
                } else {
                    (FileNode::new("NowAllowed".to_string(), None), ContentTree::default())
                }
            })
            .collect();
        Ok(files)
    })
}


#[query]
fn get_share_file(share_id: String) -> Result<ShareFile, String> {
    ShareFile::get(&share_id)
}

