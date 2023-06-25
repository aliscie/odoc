use std::collections::HashMap;

use candid::candid_method;
use ic_cdk::{
    api::call::ManualReply,
    export::{
        candid::{CandidType, Deserialize},
        Principal,
    },
};
use ic_cdk_macros::query;

use crate::{FRIENDS_STORE, ID_STORE, PROFILE_STORE};
use crate::files::FileNode;
use crate::files_content::ContentNode;
use crate::friends::Friend;
use crate::storage_schema::{ContentId, ContentTree, FileId, FriendsStore};
use crate::user::User;

#[derive(Clone, Debug, Default, CandidType, Deserialize)]
pub struct InitialData {
    Profile: User,
    FilesContents: Option<HashMap<FileId, ContentTree>>,
    Files: Option<HashMap<ContentId, FileNode>>,
    Friends: Option<Friend>,
    DiscoverUsers: HashMap<String, User>,
}

#[query]
#[candid_method(query)]
fn get_initial_data() -> Result<InitialData, String> {
    let profile = User::user_profile();

    if profile.is_none() {
        return Err("Anonymous user.".to_string());
    }

    let files_contents = ContentNode::get_all_files_content();
    let files = FileNode::get_all_files();
    let users: HashMap<String, User> = PROFILE_STORE.with(|profile_store| {
        profile_store
            .borrow()
            .iter()
            .map(|(principal, user)| (principal.clone(), user.clone()))
            .map(|(principal, user)| (principal.to_string(), user))
            .collect()
    });

    // TODO DiscoverPosts should be shorter then 100 posts
    // TODo we should have another function called load_more_posts
    // Note don't return all users this is just for testing.

    let initial_data = InitialData {
        Profile: profile.unwrap(),
        FilesContents: Some(files_contents),
        Files: files,
        Friends: Friend::get_friends_of_caller(),
        DiscoverUsers: users,
        // DiscoverPosts: posts,
        // DiscoverPlugins: plugins,
    };

    Ok(initial_data)
}