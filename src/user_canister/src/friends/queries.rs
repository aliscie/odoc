use ic_cdk::caller;
use crate::friends::Friend;
use ic_cdk_macros::query;

#[query]
pub fn get_friends() -> Vec<Friend> {
    Friend::get_list(caller())
}