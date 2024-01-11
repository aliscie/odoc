use ic_cdk::caller;
use ic_cdk_macros::update;


use crate::files::FileNode;
use crate::files_content::{ContentNode};
use crate::ShareFile;
use crate::storage_schema::FileId;


#[update]
fn create_new_file(name: String, parent: Option<FileId>) -> FileNode {
    let file = FileNode::new(name.clone(), parent);
    file
}

#[update]
fn move_file(id: String, parent: Option<FileId>) -> Result<(), ()> {
    let _res = FileNode::move_file(id, parent);
    Ok(())
}


#[update]
fn delete_file(id: FileId) -> Option<FileNode> {
    let file = FileNode::get(&id);
    if let Some(file) = file {
        if file.author != caller().to_string() {
            let share_file = ShareFile::delete(&id);
            return Some(file);
        }
        ContentNode::delete_file_contents(id.clone());
        file.delete();
        Some(file)
    } else {
        None
    }
}


#[update]
fn rename_file(id: FileId, name: String) -> bool {
    FileNode::rename_file(id, name)
}
