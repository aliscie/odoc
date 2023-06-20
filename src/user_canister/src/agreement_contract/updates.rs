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

#[update]
#[candid_method(update)]
fn create_agreement(file_name: String) -> Option<ContentNode> {
    let table = Table {
        columns: vec![
            Column {
                field: "Column 1".to_string(),
                _type: ColumnTypes::Text,
                formula: None,
                filters: Vec::new(),
                permissions: Vec::new(),
            },
            Column {
                field: "Column 2".to_string(),
                _type: ColumnTypes::Text,
                formula: None,
                filters: Vec::new(),
                permissions: Vec::new(),
            },
            // Add more columns as needed
        ],
        rows: vec![
            {
                let mut row_data = HashMap::new();
                row_data.insert("Column 1".to_string(), "Row 1 Cell 1".to_string());
                row_data.insert("Column 2".to_string(), "Row 1 Cell 2".to_string());
                // Add more cell data for other columns in the row
                row_data
            },
            {
                let mut row_data = HashMap::new();
                row_data.insert("Column 1".to_string(), "Row 2 Cell 1".to_string());
                row_data.insert("Column 2".to_string(), "Row 2 Cell 2".to_string());
                // Add more cell data for other columns in the row
                row_data
            },
            // Add more rows as needed
        ],
    };

    let content_data = ContentData::Table(table);
    let new_file = FileNode::new(file_name, None);
    let content_node = ContentNode::new(new_file.id, None, "table".to_string(), "".to_string(), Some(content_data));
    content_node
}