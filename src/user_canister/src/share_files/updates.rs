use ic_cdk::caller;
use ic_cdk_macros::update;

use crate::{SHARED_USER_FILES, ShareFile};

#[update]
fn share_file(new_share_file: ShareFile) -> Result<ShareFile, String> {
    new_share_file.save()
    // ShareFile::new(file_id, share_id)
}


#[update]
fn add_to_my_files(share_file: ShareFile) -> Result<ShareFile, String> {
    if caller().to_string() == share_file.owner.to_string() {
        return Err("You can't add your own file.".to_string());
    }
    SHARED_USER_FILES.with(|files| {
        let mut files = files.borrow_mut();
        files.insert(share_file.id.clone(), share_file.clone());
        Ok(share_file)
    })
}
