use std::collections::HashMap;
use std::fs::File;

use candid::candid_method;
use ic_cdk_macros::update;

use crate::files::FileNode;
use crate::files_content::{ContentData, ContentNode};
use crate::storage_schema::ContentTree;
use crate::tables::{Column, ColumnTypes, Table};
use crate::user::{RegisterUser, User};
use crate::USER_FILES;

// #[update]
// #[candid_method(update)]
// fn create_accumulative_contract(file_name: String) -> FileNode {
//
// }
