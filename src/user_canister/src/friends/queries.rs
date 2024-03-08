use crate::friends::FriendSystem;
use ic_cdk_macros::query;

#[query]
pub fn get_friends() -> Option<FriendSystem> {
    FriendSystem::get_friends_of_caller()
}