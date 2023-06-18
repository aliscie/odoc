use candid::candid_method;
use ic_cdk_macros::update;
use crate::files::FileNode;
use crate::files_content::ContentNode;


#[update]
#[candid_method(update)]
fn content_updates(file_id: u64, content_parent_id: Option<u64>, new_text: String) -> Result<String, String> {
    if FileNode::get_file(file_id).is_none() {
        return Err("No such file with this id.".to_string());
    }
    let parent_id: u64 = match content_parent_id {
        Some(id) => id,
        None => ContentNode::new(file_id, None, String::from(""), String::from(""), None).unwrap().id
    };
    let updated_content = ContentNode::new(file_id, Some(parent_id), String::from(""), new_text, None);
    Ok(format!("Content created successfully. Content ID: {}", updated_content.unwrap().id))
}
