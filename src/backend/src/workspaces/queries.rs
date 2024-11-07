use ic_cdk::caller;
use ic_cdk_macros::query;

use crate::WORK_SPACES;
use crate::workspaces::types::WorkSpace;

#[query]
fn get_work_spaces() -> Vec<WorkSpace> {
    WORK_SPACES.with(|store| {
        let work_spaces = store.borrow();
        let all_workspaces: Vec<WorkSpace> = work_spaces.iter()
            .flat_map(|(_, ws_vec)| ws_vec.workspaces.clone())
            .collect();
        all_workspaces
            .into_iter()
            .filter(|ws| {
                ws.members.contains(&caller()) || ws.admins.contains(&caller()) || ws.creator == caller()
            })
            .collect()
    })
}
