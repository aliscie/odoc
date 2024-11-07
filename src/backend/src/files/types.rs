use std::collections::{HashMap, HashSet};
use std::sync::atomic::{AtomicU64, Ordering};
use candid::{CandidType, Decode, Deserialize, Encode, Principal};
use ic_cdk::{caller, print};
use crate::{COUNTER, ShareFile, ShareFilePermission, USER_FILES};
use crate::storage_schema::{ContentTree, FileId};
use ic_stable_structures::{
    storable::Bound, DefaultMemoryImpl, StableBTreeMap, Storable,
};
use std::{borrow::Cow, cell::RefCell};

// #[derive(Debug, Serialize, Deserialize)]
#[derive(Clone, Debug, Deserialize, CandidType)]
pub struct FileNode {
    pub id: FileId,
    pub parent: Option<FileId>,
    pub name: String,
    #[serde(default)]
    pub children: Vec<FileId>,
    pub share_id: Option<String>,
    pub author: String,
    pub permission: ShareFilePermission,
    pub users_permissions: HashMap<Principal, ShareFilePermission>,
    pub content_id: Option<String>,
    pub workspaces: Vec<String>, // TODO we may not need this Field
}


#[derive(Clone, Debug, Deserialize, CandidType)]
pub struct FileNodeVector {
    pub files: Vec<FileNode>,
}


impl Storable for FileNode {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}


impl Storable for FileNodeVector {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}


impl FileNode {
    pub fn new(name: String, parent: Option<FileId>) -> Self {
        // Similar ID generation
        let id: FileId = COUNTER.fetch_add(1, Ordering::Relaxed).to_string();
        let file = FileNode {
            workspaces: vec![],
            id: id.clone(),
            parent,
            name,
            children: Vec::new(),
            share_id: None,
            author: caller().to_string(),
            permission: ShareFilePermission::None,
            users_permissions: Default::default(),
            content_id: None,
        };

        // Add to user's file vector
        USER_FILES.with(|files_store| {
            let mut files_vec = files_store.borrow_mut();
            let principal_id = caller();

            // Retrieve the user's file vector
            let user_files = files_vec.get(&principal_id.to_text().clone()).unwrap_or_else(|| FileNodeVector { files: Vec::new() });

            // Modify the file vector
            let mut user_files = user_files.clone();
            user_files.files.push(file.clone());

            // Insert the modified file vector back into the map
            files_vec.insert(principal_id.to_text(), user_files);
        });

        file
    }


    pub fn check_permission(&self, permission: ShareFilePermission) -> bool {
        if self.permission.check(permission.clone()) {
            return true;
        }

        // check if caller has permissions
        if let Some(user_permission) = self.users_permissions.get(&caller()) {
            return user_permission.check(permission);
        }

        false
    }

    pub fn rearrange_child(parent_id: FileId, child_id: FileId, new_index: usize) -> Result<(), String> {
        USER_FILES.with(|files_store| {
            let principal_id = ic_cdk::api::caller();
            let mut user_files_vec = files_store.borrow_mut();

            // Retrieve the user's file vector
            let user_files = user_files_vec.get(&principal_id.to_text()).unwrap_or_else(|| FileNodeVector { files: Vec::new() });

            // Modify the file vector
            let mut user_files = user_files.clone();

            // Find the parent node
            if let Some(parent_node) = user_files.files.iter_mut().find(|f| f.id == parent_id) {
                // Find the position of the child node
                if let Some(old_index) = parent_node.children.iter().position(|id| id == &child_id) {
                    // Remove the child ID from its current position
                    let child_id = parent_node.children.remove(old_index);

                    // Insert the child ID at the new position
                    if new_index >= parent_node.children.len() {
                        parent_node.children.push(child_id);
                    } else {
                        parent_node.children.insert(new_index, child_id);
                    }

                    // Insert the modified file vector back into the map
                    user_files_vec.insert(principal_id.to_text(), user_files);
                    Ok(())
                } else {
                    Err("Child ID not found in parent's children".to_string())
                }
            } else {
                Err("Parent ID not found".to_string())
            }
        })
    }

    pub fn rearrange_file(file_id: FileId, new_index: usize) -> Result<(), String> {
        USER_FILES.with(|files_store| {
            let principal_id = ic_cdk::api::caller();
            let mut user_files_vec = files_store.borrow_mut();

            // Retrieve the user's file vector
            let user_files = user_files_vec.get(&principal_id.to_text()).unwrap_or_else(|| FileNodeVector { files: Vec::new() });

            // Modify the file vector
            let mut user_files = user_files.clone();

            // Find the position of the file node to be moved
            if let Some(old_index) = user_files.files.iter().position(|f| f.id == file_id) {
                // Remove the file node from its current position
                let file_node = user_files.files.remove(old_index);

                // Insert the file node at the new position
                if new_index >= user_files.files.len() {
                    user_files.files.push(file_node);
                } else {
                    user_files.files.insert(new_index, file_node);
                }

                // Insert the modified file vector back into the map
                user_files_vec.insert(principal_id.to_text(), user_files);
                Ok(())
            } else {
                Err("File ID not found".to_string())
            }
        })
    }


    pub fn save(&self) -> Result<Self, String> {
        if caller().to_string() != self.author {
            let can_update = self.check_permission(ShareFilePermission::CanUpdate);
            if !can_update {
                return Err("You don't have permission to update this file".to_string());
            }
        }

        USER_FILES.with(|files_store| {
            let mut user_files_vec = files_store.borrow_mut();
            let author_principal = Principal::from_text(&self.author).unwrap();

            // Retrieve the user's file vector
            let user_files = user_files_vec.get(&author_principal.to_text()).unwrap_or_else(|| FileNodeVector { files: Vec::new() });

            // Modify the file vector
            let mut user_files = user_files.clone();

            // Try to find the file in the vector
            if let Some(position) = user_files.files.iter().position(|f| f.id == self.id) {
                // If found, replace it
                user_files.files[position] = self.clone();
            } else {
                // If not found, add it
                user_files.files.push(self.clone());
            }

            // If the file has a parent, ensure the parent's children list is updated.
            if let Some(parent_id) = &self.parent {
                for file in user_files.files.iter_mut() {
                    if &file.id == parent_id {
                        if !file.children.contains(&self.id) {
                            file.children.push(self.id.clone());
                        }
                        break; // Assuming unique IDs, can break once found
                    }
                }
            }

            // Insert the modified file vector back into the map
            user_files_vec.insert(author_principal.to_text(), user_files);
        });

        Ok(self.clone())
    }


    pub fn get(file_id: &FileId) -> Option<Self> {
        USER_FILES.with(|files_store| {
            let principal_id = ic_cdk::api::caller();
            let user_files_vec = files_store.borrow().get(&principal_id.to_text());

            user_files_vec.and_then(|user_files| {
                user_files.files.iter().find(|file| &file.id == file_id).cloned()
            })
        })
    }

    pub fn get_page_files(page: f32) -> Vec<FileNode> {
        const FILES_PER_PAGE: usize = 15; // Number of files per page
        let mut all_files: Vec<FileNode> = Vec::new();

        // Access shared files and user-specific files, then add them to all_files.
        let shared_files: Vec<ShareFile> = ShareFile::get_shared();
        for share_file in shared_files {
            if let Ok((file_node, _)) = ShareFile::get_file(&share_file.id) {
                all_files.push(file_node);
            }
        }

        USER_FILES.with(|files_store| {
            let principal_id = ic_cdk::api::caller();
            if let Some(user_files_vec) = files_store.borrow().get(&principal_id.to_text()) {
                all_files.extend(user_files_vec.files.iter().cloned());
            }
        });

        // Calculate the start and end indices for the requested page
        let start_index = (page - 1.0) as usize * FILES_PER_PAGE;
        if start_index >= all_files.len() {
            return vec![]; // Return an empty list if start index is out of range
        }
        let end_index = usize::min(start_index + FILES_PER_PAGE, all_files.len());

        // Return the files for the requested page
        all_files[start_index..end_index].to_vec()
    }


    pub fn get_all_files() -> Vec<FileNode> {
        let mut all_files: Vec<FileNode> = Vec::new();

        // Access shared files and user-specific files, then add them to all_files.
        // Assuming ShareFile::get_shared() gives you shared files relevant to the caller.
        let shared_files: Vec<ShareFile> = ShareFile::get_shared();
        for share_file in shared_files {
            // Assuming ShareFile::get_file returns a Result<(FileNode, ContentTree), String>
            // and you're only interested in FileNode here.
            if let Ok((file_node, _)) = ShareFile::get_file(&share_file.id) {
                all_files.push(file_node);
            }
        }

        // Add user-specific files from USER_FILES
        USER_FILES.with(|files_store| {
            let principal_id = ic_cdk::api::caller();

            if let Some(user_files_vec) = files_store.borrow().get(&principal_id.to_text()) {
                // Directly append user files. Clone each to satisfy ownership rules.
                all_files.extend(user_files_vec.files.iter().cloned());
            }
        });

        all_files
    }

    pub fn delete_file(file_id: FileId) -> Option<FileNode> {
        USER_FILES.with(|files_store| {
            let principal_id = ic_cdk::api::caller();
            let mut files_store_borrow = files_store.borrow_mut();

            // Retrieve the user's file vector
            let user_files = files_store_borrow.get(&principal_id.to_text()).map(|v| v.clone()).unwrap_or_else(|| FileNodeVector { files: Vec::new() });

            // Modify the file vector
            let mut user_files = user_files.clone();

            // Directly find and remove the file
            if let Some(file_index) = user_files.files.iter().position(|f| f.id == file_id) {
                let file = user_files.files.remove(file_index);
                for c in file.children.clone() {
                    if let Some(c_index) = user_files.files.iter().position(|f| f.id == c) {
                        user_files.files.remove(file_index);
                    }
                }


                // Remove the file from its parent's children list
                // if let Some(parent_id) = file.parent.clone() {
                //     user_files.files.iter_mut().filter(|f| f.id == parent_id).for_each(|parent_file| {
                //         parent_file.children.retain(|id| id != &file_id);
                //     });
                // }

                // Remove the file and its children recursively
                // FileNode::delete_children_recursive(&file_id, &mut user_files.files);

                // Insert the modified file vector back into the map
                files_store_borrow.insert(principal_id.to_text(), user_files);

                Some(file)
            } else {
                None
            }
        })
    }


    fn delete_children_recursive(file_id: &FileId, files: &mut Vec<FileNode>) {
        if let Some(pos) = files.iter().position(|f| &f.id == file_id) {
            let file = files.remove(pos);
            for child_id in file.children {
                FileNode::delete_children_recursive(&child_id, files);
            }
        }
    }

    pub fn move_file(file_id: FileId, new_parent: Option<FileId>) -> Option<()> {
        USER_FILES.with(|files_store| {
            let principal_id = ic_cdk::api::caller();
            let mut files_store_borrow = files_store.borrow_mut();

            // Retrieve the user's file vector
            let user_files = files_store_borrow.get(&principal_id.to_text()).map(|v| v.clone()).unwrap_or_else(|| FileNodeVector { files: Vec::new() });

            // Modify the file vector
            let mut user_files = user_files.clone();

            // Directly find and modify the file
            if let Some(file) = user_files.files.iter_mut().find(|f| f.id == file_id) {
                let old_parent = file.parent.clone();
                file.parent = new_parent.clone();

                // Process old parent if needed
                if let Some(old_parent_id) = old_parent {
                    user_files.files.iter_mut().filter(|f| f.id == old_parent_id).for_each(|parent_file| {
                        parent_file.children.retain(|id| id != &file_id);
                    });
                }

                // Process new parent if needed
                if let Some(new_parent_id) = &new_parent {
                    user_files.files.iter_mut().filter(|f| &f.id == new_parent_id).for_each(|parent_file| {
                        if !parent_file.children.contains(&file_id) {
                            parent_file.children.push(file_id.clone());
                        }
                    });
                }

                // Insert the modified file vector back into the map
                files_store_borrow.insert(principal_id.to_text(), user_files);
                Some(())
            } else {
                None
            }
        })
    }


    // pub fn rename_file(file_id: FileId, new_name: String) -> bool {
    //     USER_FILES.with(|files_store| {
    //         let principal_id = ic_cdk::api::caller();
    //
    //         let user_files_vec = files_store.borrow_mut().get_mut(&principal_id).unwrap();
    //
    //         // Find the file by iterating over the vector
    //         if let Some(file) = user_files_vec.iter_mut().find(|f| f.id == file_id) {
    //             // If found, update the file's name
    //             file.name = new_name;
    //             true
    //         } else {
    //             false
    //         }
    //     })
    // }
}
