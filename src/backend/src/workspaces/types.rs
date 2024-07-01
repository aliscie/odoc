use ic_cdk::caller;
use ic_websocket_cdk::{CanisterWsCloseResult, CanisterWsGetMessagesArguments, CanisterWsGetMessagesResult, CanisterWsMessageArguments, CanisterWsMessageResult, CanisterWsOpenArguments, CanisterWsOpenResult, WsHandlers, WsInitParams};
use crate::{WORK_SPACES};
use candid::{CandidType, Deserialize, Principal};


#[derive(Clone, Debug, Deserialize, CandidType)]
pub struct WorkSpace {
    pub id: String,
    pub name: String,
    pub chats: Vec<String>,
    pub files: Vec<String>,
    pub members: Vec<Principal>,
    pub admins: Vec<Principal>,
    pub creator: Principal,
}

impl WorkSpace {
    pub fn new(name: String, id: String) -> Result<Self, String> {
        let new_work_space = WorkSpace {
            id,
            name: name.clone(),
            chats: vec![],
            files: vec![],
            members: vec![caller()],
            admins: vec![caller()],
            creator: caller(),
        };
        WORK_SPACES.with(|store| {
            let mut work_spaces = store.borrow_mut();
            if work_spaces.iter().any(|ws| ws.name == name) {
                return Err("Workspace with the same name already exists".to_string());
            } else {
                work_spaces.push(new_work_space.clone());
            }
            return Ok(new_work_space);
        })
    }

    pub fn get(name: String) -> Option<Self> {
        WORK_SPACES.with(|store| {
            let work_spaces = store.borrow();
            work_spaces.iter().find(|ws| ws.name == name).cloned()
        })
    }

    pub fn save(&self) -> Result<Self, String> {
        let old_work_space = Self::get(self.id.clone());

        if let Some(old_work_space) = old_work_space.clone() {
            if old_work_space.creator != caller() || !old_work_space.admins.contains(&caller()) {
                return Err("You are not allowed to update this workspace".to_string());
            }
        };

        WORK_SPACES.with(|store| {
            let mut work_spaces = store.borrow_mut();
            if let Some(old_work_space) = old_work_space.clone() {
                let index = work_spaces.iter().position(|ws| ws.id == self.id).unwrap();
                work_spaces[index] = self.clone();
            } else {
                work_spaces.push(self.clone());
            }
        });

        //TODO if old_work_space.name != self.name {
        //     // create notifications for all members
        //
        // }
        Ok(self.clone())
    }
}