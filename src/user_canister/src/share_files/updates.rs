
use ic_cdk_macros::update;

use crate::ShareFile;

#[update]
fn share_file(file_id: String, share_id: String) -> Result<String, String> {
    ShareFile::new(file_id, share_id)
}
