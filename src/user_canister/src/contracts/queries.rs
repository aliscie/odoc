use std::collections::HashMap;
use candid::candid_method;
use ic_cdk_macros::query;

use crate::USER_FILES;
use crate::files::FileNode;
use crate::user::User;

// #[query]
// #[candid_method(query)]
// fn x() -> String {
//     "contract".to_string()
// }
