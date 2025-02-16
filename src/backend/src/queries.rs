use std::collections::HashMap;

use candid::{CandidType, Deserialize};
use ic_cdk::caller;
use ic_cdk_macros::query;

use crate::contracts::Contract;
use crate::files::FileNode;
use crate::files_content::ContentNode;
use crate::friends::Friend;
use crate::storage_schema::{ ContentTree, ContractId, FileId};
use crate::user::User;
use crate::{StoredContract, Wallet, PROFILE_STORE};
use crate::user_history::UserHistory;

#[derive(Clone, Debug, Default, CandidType, Deserialize)]
pub struct InitialData {
    Profile: User,
    FilesContents: Option<HashMap<FileId, ContentTree>>,
    Files: Vec<FileNode>,
    Friends: Vec<Friend>,
    // DiscoverUsers: HashMap<String, User>,
    Contracts: HashMap<ContractId, StoredContract>,
    Wallet: Wallet,
}


#[derive(Clone, Debug, Default, CandidType, Deserialize)]
pub struct SNSStatus {
    number_users: f64,
    active_users: f64,
}


#[query]
fn get_sns_status() -> Result<SNSStatus, String> {
    let number_users = User::get_number_of_users();
    let active_users = UserHistory::get_number_of_active_users();
    Ok(SNSStatus {
        number_users,
        active_users,
    })
}

#[query]
fn get_contract(author: String, contract_id: String) -> Result<StoredContract, String> {
    // let author: Result<Principal, PrincipalError> = Principal::from_text(author);
    // if author.is_err() {
    //     return Err("Invalid principal.".to_string());
    // };
    let contract = Contract::get_contract(author, contract_id);
    if let Some(contract) = contract {
        return Ok(contract);
    }
    Err("Invalid principal.".to_string())
}

#[query]
fn get_more_files(page: f32) -> (Vec<FileNode>, HashMap<FileId, ContentTree>) {
    let files = FileNode::get_page_files(page.clone());
    let files_contents: HashMap<FileId, ContentTree> = ContentNode::get_page_files_content(page);
    (files, files_contents)
}

#[query]
fn get_initial_data() -> Result<InitialData, String> {
    let profile = User::user_profile();

    if profile.is_none() {
        return Err("Anonymous user.".to_string());
    }

    let files_contents = ContentNode::get_page_files_content(1_f32);
    let files = FileNode::get_page_files(1_f32);


    let contracts: HashMap<ContractId, StoredContract> =
        Contract::get_all_contracts().unwrap_or(HashMap::new());

    let initial_data = InitialData {
        Profile: profile.unwrap(),
        FilesContents: Some(files_contents),
        Files: files,
        Friends: Friend::get_list(caller()),
        Contracts: contracts,
        Wallet: Wallet::get(caller()),
    };
    Ok(initial_data)
}
