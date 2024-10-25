use ic_cdk_macros::query;

use crate::ShareFile;


#[query]
fn get_share_file(share_id: String) -> Result<ShareFile, String> {
    ShareFile::get(&share_id)
}

