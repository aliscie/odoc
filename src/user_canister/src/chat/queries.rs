use ic_cdk_macros::query;
use crate::chat::Chat;

#[query]
fn get_my_chats() -> Vec<Chat> {
    Chat::get_my_chats()
}
