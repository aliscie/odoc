
use ic_cdk_macros::update;

use crate::ShareFile;

#[update]
fn share_file(new_share_file: ShareFile) -> Result<ShareFile, String> {
    new_share_file.save()
    // ShareFile::new(file_id, share_id)
}
