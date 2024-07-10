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
    pub workspace: String, // TODO we may not need this Field
}


impl Storable for FileNode {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: 200000,
        is_fixed_size: false,
    };
}




impl FileNode {
    pub fn new(name: String, parent: Option<FileId>) -> Self {
        // Similar ID generation
        let id: FileId = COUNTER.fetch_add(1, Ordering::Relaxed).to_string();
        let file = FileNode {
            workspace: "".to_string(),
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
            // Ensure there's a vector for the current user
            let user_files = files_vec.entry(caller()).or_insert_with(Vec::new);
            // Add the new file
            user_files.push(file.clone());
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
            let user_files = user_files_vec.entry(principal_id).or_insert_with(Vec::new);

            // Find the parent node
            if let Some(parent_node) = user_files.iter_mut().find(|f| f.id == parent_id) {
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
            let user_files = user_files_vec.entry(principal_id).or_insert_with(Vec::new);

            // Find the position of the file node to be moved
            if let Some(old_index) = user_files.iter().position(|f| f.id == file_id) {
                // Remove the file node from its current position
                let file_node = user_files.remove(old_index);

                // Insert the file node at the new position
                if new_index >= user_files.len() {
                    user_files.push(file_node);
                } else {
                    user_files.insert(new_index, file_node);
                }
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

            // Ensure there's a vector for the current author
            let user_files = user_files_vec.entry(author_principal).or_insert_with(Vec::new);

            // Try to find the file in the vector
            if let Some(position) = user_files.iter().position(|f| f.id == self.id) {
                // If found, replace it
                user_files[position] = self.clone();
            } else {
                // If not found, add it
                user_files.push(self.clone());
            }

            // If the file has a parent, ensure the parent's children list is updated.
            // This is more complex with a vector and may require additional logic
            // to maintain consistency.
            if let Some(parent_id) = &self.parent {
                for file in user_files.iter_mut() {
                    if &file.id == parent_id {
                        if !file.children.contains(&self.id) {
                            file.children.push(self.id.clone());
                        }
                        break; // Assuming unique IDs, can break once found
                    }
                }
            }
        });

        Ok(self.clone())
    }


    pub fn get(file_id: &FileId) -> Option<Self> {
        USER_FILES.with(|files_store| {
            files_store.borrow().get(&caller()).and_then(|files_vec| {
                files_vec.iter().find(|file| &file.id == file_id).cloned()
            })
        })
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

            if let Some(user_files_vec) = files_store.borrow().get(&principal_id) {
                // Directly append user files. Clone each to satisfy ownership rules.
                all_files.extend(user_files_vec.iter().cloned());
            }
        });

        all_files
    }

    pub fn delete_file(file_id: FileId) -> Option<FileNode> {
        USER_FILES.with(|files_store| {
            let principal_id = ic_cdk::api::caller();

            let mut user_files = files_store.borrow_mut();
            let user_files_vec = user_files.get_mut(&principal_id)?;

            // Find the index of the file to be deleted
            if let Some(pos) = user_files_vec.iter().position(|x| x.id == file_id) {
                let deleted_file = user_files_vec.remove(pos); // Remove file by index

                // Optionally, also remove the file from its parent's children list
                // This requires iterating over the vector to find the parent
                if let Some(parent_id) = &deleted_file.parent {
                    for file in user_files_vec.iter_mut() {
                        if file.id == *parent_id {
                            file.children.retain(|id| id != &file_id);
                            break; // Parent found and updated, no need to continue
                        }
                    }
                }

                Some(deleted_file)
            } else {
                None // File not found
            }
        })
    }


    fn delete_children_recursive(file_id: &FileId, files_map: &mut HashMap<FileId, FileNode>) {
        if let Some(file) = files_map.remove(file_id) {
            for child_id in file.children {
                FileNode::delete_children_recursive(&child_id, files_map);
            }
        }
    }

    pub fn move_file(file_id: FileId, new_parent: Option<FileId>) -> Option<()> {
        USER_FILES.with(|files_store| {
            let principal_id = ic_cdk::api::caller();
            let mut files_store_borrow = files_store.borrow_mut();
            let user_files_vec = files_store_borrow.get_mut(&principal_id)?;

            // Directly find and modify the file
            if let Some(file) = user_files_vec.iter_mut().find(|f| f.id == file_id) {
                let old_parent = file.parent.clone();
                file.parent = new_parent.clone();

                // Process old parent if needed
                if let Some(old_parent_id) = old_parent {
                    user_files_vec.iter_mut().filter(|f| f.id == old_parent_id).for_each(|parent_file| {
                        parent_file.children.retain(|id| id != &file_id);
                    });
                }

                // Process new parent if needed
                if let Some(new_parent_id) = &new_parent {
                    user_files_vec.iter_mut().filter(|f| &f.id == new_parent_id).for_each(|parent_file| {
                        if !parent_file.children.contains(&file_id) {
                            parent_file.children.push(file_id.clone());
                        }
                    });
                }
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
