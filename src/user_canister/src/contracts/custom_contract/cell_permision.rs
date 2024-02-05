use crate::contracts::custom_contract::types::CCell;
use crate::{CContract, CustomContract};

// cells actions
// 1. add cell
// 2. delete cell
// 3. update cell value
// prevent update id or field value
// prevent update or delete or add if !can_update
fn add_missing_cells(mut c_contract: CContract, old_c_contract: &CContract, old_contract: &CustomContract) -> CContract {
    for old_row in &old_c_contract.rows.clone() {
        for old_cell in &old_row.cells {
            // Check if the cell is missing in the new contract
            let is_missing = c_contract.rows.iter().all(|r| r.cells.iter().all(|c| c.id != old_cell.id));

            if is_missing && old_contract.can_update_cell(old_cell) {
                // Cell is missing, add it back if allowed
                let rows = c_contract.rows.clone();  // Clone rows before iteration
                c_contract.rows = rows.into_iter().map(|r| {
                    if r.id == old_row.id {
                        let mut new_row = r.clone();
                        new_row.cells.push(old_cell.clone());
                        new_row
                    } else {
                        r
                    }
                }).collect();
            }
        }
    }

    c_contract
}


fn remove_added_cells(mut c_contract: CContract, old_c_contract: &CContract, old_contract: &CustomContract) -> CContract {
    for row in c_contract.rows.clone() {
        for cell in &row.cells {
            // Check if the cell is added in the new contract
            let is_added = old_c_contract.rows.iter().all(|r| r.cells.iter().all(|c| c.id != cell.id));

            if is_added && !old_contract.can_update_cell(cell) {
                // Cell is added, remove it if not allowed
                let rows = c_contract.rows;
                c_contract.rows = rows.into_iter().map(|r| {
                    if r.id == row.id {
                        let mut new_row = r.clone();
                        new_row.cells.retain(|c| c.id != cell.id);
                        new_row
                    } else {
                        r
                    }
                }).collect();
            }
        }
    }

    c_contract.clone()
}


pub fn check_cells_add_delete_permissions(mut c_contract: CContract, old_contract: CustomContract) -> CContract {
    if let Some(old_c_contract) = old_contract.get_c_contract(&c_contract.id) {
        c_contract = add_missing_cells(c_contract, &old_c_contract, &old_contract);
        c_contract = remove_added_cells(c_contract, &old_c_contract, &old_contract);
    } else {
        // if there is no contract just add the cells anyway
    }
    c_contract
}


pub fn check_cells_update_permissions(mut c_contract: CContract, old_contract: CustomContract) -> CContract {
    c_contract.rows = c_contract.rows.into_iter().map(|mut row| {
        row.cells = row.cells.into_iter().map(|cell| {
            if let Some(old_cell) = old_contract.get_cell_value(&cell.id) {
                let updated_cell = CCell {
                    value: cell.value.clone(),
                    field: old_cell.field.clone(), // field can't be updated
                    id: old_cell.id.clone(), // id can't be updated
                };
                if let Some(column) = old_contract.get_column(&cell.field.clone()) {
                    if !column.can_update() {
                        // If the user does not have edit permission or it's AnyOneEdite,
                        // set the cell back to the old value
                        old_cell
                    } else {
                        updated_cell.clone()
                    }
                } else {
                    updated_cell.clone()
                }
            } else {
                cell
            }
        }).collect();
        row
    }).collect();
    c_contract
}
