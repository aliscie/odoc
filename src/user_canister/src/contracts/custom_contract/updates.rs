












// #[update]// fn create_custom_contract(file_name: String) -> Option<ContentNode> {
//     let table = Table {
//         columns: vec![
//             Column {
//                 editable: true,
//                 field: "user".to_string(),
//                 _type: ColumnTypes::Person,
//                 formula: None,
//                 dataValidator: None,
//                 filters: Vec::new(),
//                 permissions: Vec::new(),
//             },
//             Column {
//                 editable: true,
//                 field: "amount".to_string(),
//                 _type: ColumnTypes::Number,
//                 formula: None,
//                 dataValidator: None,
//                 filters: Vec::new(),
//                 permissions: Vec::new(),
//             },
//             Column {
//                 editable: true,
//                 field: "release".to_string(),
//                 _type: ColumnTypes::Category,
//                 formula: None,
//                 dataValidator: None,
//                 filters: Vec::new(),
//                 permissions: Vec::new(),
//             },
//             // Add more columns as needed
//         ],
//         rows: vec![
//             {
//                 let mut row_data = HashMap::new();
//                 row_data.insert("user".to_string(), "John Doe".to_string());
//                 row_data.insert("amount".to_string(), "100".to_string());
//                 row_data.insert("release".to_string(), "Category A".to_string());
//                 // Add more cell data for other columns in the row
//                 row_data
//             },
//             {
//                 let mut row_data = HashMap::new();
//                 row_data.insert("user".to_string(), "Jane Smith".to_string());
//                 row_data.insert("amount".to_string(), "200".to_string());
//                 row_data.insert("release".to_string(), "Category B".to_string());
//                 // Add more cell data for other columns in the row
//                 row_data
//             },
//             // Add more rows as needed
//         ],
//     };
//
//     let content_data = ContentData::Table(table);
//     let new_file = FileNode::new(file_name, None);
//     let content_node = ContentNode::new(
//         new_file.id,
//         None,
//         "table".to_string(),
//         "".to_string(),
//         Some(content_data),
//     );
//     content_node
// }
