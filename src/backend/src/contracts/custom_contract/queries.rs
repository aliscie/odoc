
use ic_cdk::caller;
use std::collections::HashMap;

use crate::{CustomContract, FILE_CONTENTS, USER_FILES};
use ic_cdk_macros::query;

use crate::files_content::ContentNode;
use crate::storage_schema::{ContentTree, FileId};

// #[query]
// fn get_contract(creator:String, id: String) -> Option<CustomContract> {
//
// }
