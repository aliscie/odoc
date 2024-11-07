use std::borrow::Cow;
use std::cell::{Ref, RefCell};
use std::collections::HashMap;
use std::sync::atomic::Ordering;

use candid::{CandidType, Decode, Deserialize, Encode, Principal};
use ic_cdk::{caller, print};
use ic_stable_structures::{BTreeMap, Storable};
use ic_stable_structures::storable::Bound;

pub use queries::*;
pub use types::*;
pub use updates::*;

use crate::{COUNTER, Memory};
use crate::POSTS;
use crate::storage_schema::ContentTree;
use crate::user::User;

mod queries;
mod updates;
mod types;

#[derive(Clone, Debug, Deserialize, CandidType)]
pub struct Post {
    id: String,
    content_tree: ContentTree,
    tags: Vec<String>,
    creator: String,
    date_created: u64,
    votes_up: Vec<Principal>,
    votes_down: Vec<Principal>,
}


impl Storable for Post {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}


#[derive(Clone, Debug, Deserialize, CandidType)]
pub struct UserFE {
    // FE === FrontEnd
    pub id: String,
    pub name: String,
}

impl UserFE {
    pub fn from(id: Principal) -> Self {
        let user = User::get_user_from_principal(id).unwrap();
        UserFE {
            id: user.id,
            name: user.name,
        }
    }
}

#[derive(Clone, Debug, Deserialize, CandidType)]
pub struct PostUser {
    id: String,
    content_tree: ContentTree,
    tags: Vec<String>,
    creator: UserFE,
    date_created: u64,
    votes_up: Vec<Principal>,
    votes_down: Vec<Principal>,
}

impl Post {
    // Constructor for creating a new Post
    pub fn new() -> Self {
        // Generate a unique ID for the post
        let id = COUNTER.fetch_add(1, Ordering::SeqCst).to_string();

        // Get the current timestamp
        let date_created = ic_cdk::api::time();

        Post {
            id,
            content_tree: Default::default(), // Assuming ContentTree has a default implementation
            tags: Default::default(),         // Assuming Vec<String> has a default implementation
            creator: String::new(),           // Assuming String has a default implementation
            date_created,
            votes_up: vec![],
            votes_down: vec![],
        }
    }

    // Save the post to the thread-local storage
    pub fn save(&self) {
        let id = self.id.to_string();
        POSTS.with(|posts| {
            // TODO insert the posts at the beaning of the hashmap to get the latest post at top
            posts.borrow_mut().insert(id.clone(), self.clone());
        });
    }
    pub fn get_latest_posts() -> Vec<Post> {
        // let mut count = 0;
        POSTS.with(|posts| {
            let posts = posts.borrow();
            let mut posts_today = Vec::new();
            for (_, post) in posts.iter() {
                let date = ic_cdk::api::time();
                let diff = date - post.date_created;
                if post.creator == caller().to_string() && diff < 86400000000 {
                    posts_today.push(post.clone());
                }
            }
            posts_today
        })
    }
    // Get paginated posts
    pub fn get_pagination(start: usize, count: usize) -> Vec<PostUser> {
        POSTS.with(|posts| {
            let posts = posts.borrow();
            let total_posts = posts.len();

            // If start is beyond the total number of posts, return an empty vector
            if start >= total_posts as usize {
                return Vec::new();
            }

            // Calculate the actual count based on the available posts
            let actual_count = usize::min(count, (total_posts - start as u64).try_into().unwrap());

            // for each post get the user User::get_user_from_text_principal(user_principal.clone());
            posts
                .iter()
                .skip((start as u64).try_into().unwrap())
                .take(actual_count)
                .map(|(_, post)| {
                    let user = User::get_user_from_text_principal(&post.creator).unwrap();
                    let creator = UserFE {
                        id: user.id.clone(),
                        name: user.name.clone(),
                    };
                    PostUser {
                        id: post.id.clone(),
                        content_tree: post.content_tree.clone(),
                        tags: post.tags.clone(),
                        creator,
                        date_created: post.date_created,
                        votes_up: post.votes_up.clone(),
                        votes_down: post.votes_down.clone(),
                    }
                })
                .collect()
        })
    }


    pub fn get_filtered(tags: Option<Vec<String>>, creator: Option<String>) -> Vec<PostUser> {
        POSTS.with(|posts| {
            let posts: Ref<BTreeMap<String, Post, Memory>> = posts.borrow();
            let map_posts : HashMap<String, Post> = posts.iter().map(|(k, v)| (k.clone(), v.clone())).collect();
            let mut filtered_posts: Vec<&Post> = map_posts.values().collect();
            if let Some(tags) = tags {
                filtered_posts = filtered_posts
                    .into_iter()
                    .filter(|post| post.tags.iter().any(|tag| tags.contains(tag)))
                    .collect::<Vec<&Post>>();
            }
            if let Some(creator) = creator {
                filtered_posts = filtered_posts
                    .into_iter()
                    .filter(|post| post.creator == creator)
                    .collect::<Vec<&Post>>();
            }
            filtered_posts
                .into_iter()
                .map(|post| {
                    let user = User::get_user_from_text_principal(&post.creator).unwrap();
                    let creator = UserFE {
                        id: user.id.clone(),
                        name: user.name.clone(),
                    };
                    PostUser {
                        id: post.id.clone(),
                        content_tree: post.content_tree.clone(),
                        tags: post.tags.clone(),
                        creator,
                        date_created: post.date_created,
                        votes_up: post.votes_up.clone(),
                        votes_down: post.votes_down.clone(),
                    }
                })
                .collect::<Vec<PostUser>>()
        })
    }

    // Get a post by ID
    pub fn get(id: String) -> Result<Post, String> {
        POSTS.with(|posts| {
            let posts = posts.borrow();
            if let Some(post) = posts.get(&id) {
                Ok(post.clone())
            } else {
                Err("Post not found".to_string())
            }
        })
    }

    // Delete a post by ID
    pub fn delete(id: String) -> Result<(), String> {
        let id_str = id.to_string();
        POSTS.with(|posts| {
            let mut posts = posts.borrow_mut();
            if posts.contains_key(&id_str) {
                posts.remove(&id_str);
                Ok(())
            } else {
                Err("Post not found".to_string())
            }
        })
    }


    // TODO deep search
    // pub fn search_by_content(text: String) -> Vec<Post> {
    //     POSTS.with(|posts| {
    //         let mut result = Vec::new();
    //         let posts = posts.borrow();
    //
    //         posts.values().filter(|post| post.content_tree.values().any(|x| x.contains(&text))).cloned().collect()
    //     })
    // }
}
