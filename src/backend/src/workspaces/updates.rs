use ic_cdk::update;

use crate::user::User;
use crate::workspaces::WorkSpace;

#[update]
fn save_work_space(workspace: WorkSpace) -> Result<WorkSpace, String> {
    workspace.save()
}


#[update]
fn delete_work_space(workspace: WorkSpace) -> Result<WorkSpace, String> {
    workspace.delete()
}

