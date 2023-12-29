use std::collections::HashMap;


use ic_cdk::{caller};
use candid::{CandidType, Deserialize, Principal};
use candid::types::principal::PrincipalError;
use ic_cdk_macros::query;

use crate::{PROFILE_STORE, StoredContract, Wallet};
use crate::contracts::Contract;
use crate::files::FileNode;
use crate::files_content::ContentNode;
use crate::friends::FriendSystem;
use crate::storage_schema::{ContentId, ContentTree, ContractId, FileId};
use crate::user::User;

#[derive(Clone, Debug, Default, CandidType, Deserialize)]
pub struct InitialData {
    Profile: User,
    FilesContents: Option<HashMap<FileId, ContentTree>>,
    Files: Option<HashMap<ContentId, FileNode>>,
    Friends: Option<FriendSystem>,
    DiscoverUsers: HashMap<String, User>,
    Contracts: HashMap<ContractId, StoredContract>,
    Wallet: Wallet,
}


#[query]
fn get_contract(author: String, contract_id: String) -> Result<StoredContract, String> {
    let author: Result<Principal, PrincipalError> = Principal::from_text(author);
    if author.is_err() {
        return Err("Invalid principal.".to_string());
    };
    let contract = Contract::get_contract(author.unwrap(), contract_id);
    if let Some(contract) = contract {
        return Ok(contract);
    }
    Err("Invalid principal.".to_string())
}

#[query]
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

    let contracts: HashMap<ContractId, StoredContract> = Contract::get_all_contracts().unwrap_or(HashMap::new());

    // TODO Pagination
    //   DiscoverPosts should be shorter then 100 posts
    //   We should have another function called load_more_posts
    //   Note don't return all users this is just for testing.

    let initial_data = InitialData {
        Profile: profile.unwrap(),
        FilesContents: Some(files_contents),
        Files: files,
        Friends: FriendSystem::get_friends_of_caller(),
        DiscoverUsers: users,
        Contracts: contracts,
        Wallet: Wallet::get(caller()),
    };
    Ok(initial_data)
}