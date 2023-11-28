use crate::friends::Friend;
use ic_cdk_macros::query;

#[query]
pub fn get_friends() -> Option<Friend> {
    Friend::get_friends_of_caller()
}