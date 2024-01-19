use ic_cdk_macros::query;
use crate::chat::{Chat, Message};
use crate::websocket::{AppMessage, Notification};

#[query]
fn get_my_chats() -> Vec<Chat> {
    Chat::get_my_chats()
}


#[query]
fn get_chats_notifications() -> Vec<Message> {
    Chat::get_notifications()
}
