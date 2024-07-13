use ic_cdk::caller;
use ic_cdk_macros::query;

use crate::WORK_SPACES;
use crate::workspaces::types::WorkSpace;

#[query]
fn get_work_spaces() -> Vec<WorkSpace> {
    WORK_SPACES.with(|store| {
        let work_spaces = store.borrow();
        work_spaces.clone().into_iter().filter(|ws| {
            ws.members.contains(&caller()) || ws.admins.contains(&caller()) || ws.creator == caller()
        }).collect()
    })
}