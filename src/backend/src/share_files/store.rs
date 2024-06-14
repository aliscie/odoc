use std::cell::RefCell;
use std::collections::{BTreeMap, HashMap};

use crate::ShareFile;

pub type ShareId = String;
pub type FilesShareStore = BTreeMap<ShareId, ShareFile>;

thread_local! {
    static FILES_SHARE_STORE: RefCell<FilesShareStore> = RefCell::default();
}
