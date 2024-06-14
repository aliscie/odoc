use ic_cdk_macros::query;
use crate::chat::{Chat, Message};
use crate::websocket::{AppMessage, Notification};
use candid::{CandidType, Deserialize, Principal};
use crate::discover::UserFE;
use crate::user::User;


#[derive(Clone, Debug, Deserialize, CandidType)]
pub struct FEChat {
    // FE == FrontEnd
    pub id: String,
    pub name: String,
    // this used only for groups
    pub admins: Vec<UserFE>,
    // for private chats both users are admonish and members will be empty
    pub members: Vec<Principal>,
    // this used only for groups
    pub messages: Vec<Message>,
    pub creator: UserFE,
}


#[query]
fn get_my_chats() -> Vec<FEChat> {
    let chats: Vec<Chat> = Chat::get_my_chats();
    let mut fe_chats: Vec<FEChat> = Vec::new();

    for chat in chats {
        let creator_user = match User::get_user_from_principal(chat.creator) {
            Some(user) => user,
            None => continue, // Skip this chat if user is not found
        };
        let creator_fe_user = UserFE {
            id: creator_user.id,
            name: creator_user.name,
        };

        let admins_fe: Vec<UserFE> = chat
            .admins
            .iter()
            .filter_map(|admin_principal| User::get_user_from_principal(*admin_principal))
            .map(|admin_user| UserFE {
                id: admin_user.id,
                name: admin_user.name,
            })
            .collect();

        let fe_chat = FEChat {
            id: chat.id,
            name: chat.name,
            admins: admins_fe,
            members: chat.members,
            messages: chat.messages,
            creator: creator_fe_user,
        };

        fe_chats.push(fe_chat);
    }

    fe_chats
}


#[query]
fn get_chats_notifications() -> Vec<Message> {
    Chat::get_notifications()
}
