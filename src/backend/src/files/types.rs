use crate::storage_schema::{ContentTree, FileId};
use crate::{ShareFile, ShareFilePermission, COUNTER, USER_FILES};
use candid::{CandidType, Decode, Deserialize, Encode, Principal};
use ic_cdk::{caller, print};
use ic_stable_structures::{storable::Bound, DefaultMemoryImpl, StableBTreeMap, Storable};
use std::collections::{HashMap, HashSet};
use std::fs::File;
use std::sync::atomic::{AtomicU64, Ordering};
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
            let user_files = files_vec
                .get(&principal_id.to_text().clone())
                .unwrap_or_else(|| FileNodeVector { files: Vec::new() });

            // Modify the file vector
            let mut user_files = user_files.clone();
            user_files.files.push(file.clone());

            // Insert the modified file vector back into the map
            files_vec.insert(principal_id.to_text(), user_files);
        });

        file
    }

    pub fn check_permission(&self, required_permission: ShareFilePermission) -> bool {
        let caller = caller();

        // Owner always has full permissions
        if caller.to_string() == self.author.to_string() {
            return true;
        }

        // Check user-specific permissions first
        if let Some(user_permission) = self.users_permissions.get(&caller) {
            return user_permission.check(required_permission);
        }

        // Fall back to default file permission
        self.permission.check(required_permission)
    }

    pub fn rearrange_child(
        parent_id: FileId,
        child_id: FileId,
        new_index: usize,
    ) -> Result<(), String> {
        USER_FILES.with(|files_store| {
            let principal_id = ic_cdk::api::caller().to_text();
            let mut store = files_store.borrow_mut();

            // Retrieve the user's file vector
            let mut user_files = store
                .get(&principal_id)
                .unwrap_or_else(|| FileNodeVector { files: Vec::new() });

            // Verify child exists
            if !user_files.files.iter().any(|f| f.id == child_id) {
                return Err("Child file not found".to_string());
            }

            // Check if parent exists
            let parent_exists = user_files.files.iter().any(|f| f.id == parent_id);

            if !parent_exists {
                // If parent doesn't exist, convert to root-level rearrangement
                return FileNode::rearrange_file(child_id, new_index);
            }

            // Verify child is not being moved into its own descendant
            let mut current_id = Some(parent_id.clone());
            while let Some(id) = current_id {
                if id == child_id {
                    return Err("Cannot move a file into its own descendant".to_string());
                }
                current_id = user_files.files.iter()
                    .find(|f| f.id == id)
                    .and_then(|f| f.parent.clone());
            }

            // First pass: Find and update the old parent
            let mut old_parent_id = None;
            for file in user_files.files.iter_mut() {
                if file.children.contains(&child_id) {
                    file.children.retain(|id| id != &child_id);
                    old_parent_id = Some(file.id.clone());
                }
            }

            // Second pass: Update the new parent and child
            let mut new_parent_found = false;
            for file in user_files.files.iter_mut() {
                if file.id == parent_id {
                    // Ensure new_index is within bounds
                    let safe_index = new_index.min(file.children.len());
                    if !file.children.contains(&child_id) {
                        file.children.insert(safe_index, child_id.clone());
                    }
                    new_parent_found = true;
                } else if file.id == child_id {
                    file.parent = Some(parent_id.clone());
                }
            }

            if !new_parent_found {
                return Err("Parent file not found after validation".to_string());
            }

            store.insert(principal_id, user_files);
            Ok(())
        })
    }

    pub fn rearrange_file(file_id: FileId, new_index: usize) -> Result<(), String> {
        USER_FILES.with(|files_store| {
            let principal_id = ic_cdk::api::caller().to_text();
            let mut store = files_store.borrow_mut();

            // Retrieve the user's file vector
            let mut user_files = store
                .get(&principal_id)
                .unwrap_or_else(|| FileNodeVector { files: Vec::new() });

            // Verify file exists and get its current position
            let old_index = user_files.files.iter()
                .position(|f| f.id == file_id)
                .ok_or("File not found".to_string())?;

            // First, update any parent's children list
            let old_parent_id = user_files.files[old_index].parent.clone();
            if let Some(parent_id) = old_parent_id {
                for file in user_files.files.iter_mut() {
                    if file.id == parent_id {
                        file.children.retain(|id| id != &file_id);
                    }
                }
            }

            // Remove the file and reinsert it at the new position
            let mut file_node = user_files.files.remove(old_index);
            file_node.parent = None;  // Set to root level

            // Ensure new_index is within bounds
            let safe_index = new_index.min(user_files.files.len());
            user_files.files.insert(safe_index, file_node);

            store.insert(principal_id, user_files);
            Ok(())
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
            let user_files = user_files_vec
                .get(&author_principal.to_text())
                .unwrap_or_else(|| FileNodeVector { files: Vec::new() });

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
                user_files
                    .files
                    .iter()
                    .find(|file| &file.id == file_id)
                    .cloned()
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
            let user_files = files_store_borrow
                .get(&principal_id.to_text())
                .map(|v| v.clone())
                .unwrap_or_else(|| FileNodeVector { files: Vec::new() });

            // Modify the file vector
            let mut user_files = user_files.clone();

            // First, find the file to be deleted and get its children
            let file_index = user_files.files.iter().position(|f| f.id == file_id)?;
            let file = user_files.files[file_index].clone();
            let children_ids = file.children.clone();

            // Remove parent reference from all children
            for child_id in children_ids {
                if let Some(child) = user_files.files.iter_mut().find(|f| f.id == child_id) {
                    child.parent = None; // Remove the parent reference
                }
            }

            // Remove file from its own parent's children list if it has a parent
            if let Some(parent_id) = &file.parent {
                if let Some(parent) = user_files.files.iter_mut().find(|f| &f.id == parent_id) {
                    parent.children.retain(|id| id != &file_id);
                }
            }

            // Remove the file itself
            let deleted_file = user_files.files.remove(file_index);

            // Update the store with modified file vector
            files_store_borrow.insert(principal_id.to_text(), user_files);

            Some(deleted_file)
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
            let user_files = files_store_borrow
                .get(&principal_id.to_text())
                .map(|v| v.clone())
                .unwrap_or_else(|| FileNodeVector { files: Vec::new() });

            // Modify the file vector
            let mut user_files = user_files.clone();

            // Directly find and modify the file
            if let Some(file) = user_files.files.iter_mut().find(|f| f.id == file_id) {
                let old_parent = file.parent.clone();
                file.parent = new_parent.clone();

                // Process old parent if needed
                if let Some(old_parent_id) = old_parent {
                    user_files
                        .files
                        .iter_mut()
                        .filter(|f| f.id == old_parent_id)
                        .for_each(|parent_file| {
                            parent_file.children.retain(|id| id != &file_id);
                        });
                }

                // Process new parent if needed
                if let Some(new_parent_id) = &new_parent {
                    user_files
                        .files
                        .iter_mut()
                        .filter(|f| &f.id == new_parent_id)
                        .for_each(|parent_file| {
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
