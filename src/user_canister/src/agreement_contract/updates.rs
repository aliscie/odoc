use std::fs::File;

use candid::candid_method;
use ic_cdk_macros::update;

use crate::{USER_FILES};
use crate::files::FileNode;
use crate::user::{RegisterUser, User};

// #[update]
// #[candid_method(update)]
// fn get_all_contracts() -> String {
//     "contract".to_string()
// }