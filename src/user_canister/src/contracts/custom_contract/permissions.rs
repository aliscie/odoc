use ic_cdk::caller;

use crate::{CColumn, CContract, Contract, ContractError, CRow, CustomContract};
use crate::contracts::custom_contract::types::CCell;
use crate::tables::PermissionType;

// cells actions
// 1. add cell
// 2. delete cell
// 3. update cell value
// prevent update id or field value
// prevent update or delete or add if !can_update

impl CContract {
    //  ----------------------------------------------- Column CRUD permissions -----------------------------------------------\\
    pub fn update_column_permission(&self, new_column: CColumn, old_column: CColumn) -> Result<CColumn, String> {
        if self.creator == caller() {
            return Ok(new_column.clone());
        }
        Err("Only creator can update column".to_string())
    }

    pub fn delete_column_permission(&self, deleted_column: CColumn) -> Result<CColumn, String> {
        if self.creator == caller() {
            return Ok(deleted_column.clone());
        }
        Err("Only creator can delete column".to_string())
    }

    pub fn create_column_permission(&self, new_column: CColumn) -> Result<CColumn, String> {
        if self.creator == caller() {
            return Ok(new_column.clone());
        }
        Err("Only creator can create column".to_string())
    }
    //  ----------------------------------------------- Row CRUD permissions -----------------------------------------------\\
    pub fn has_cell_update_permeation(&mut self, new_cell: CCell, old_c_contract: CContract) -> bool {
        if let Some(column) = old_c_contract.columns.iter().find(|c| c.field == new_cell.field) {
            let permissions = column.permissions.clone();
            let perm_1 = PermissionType::Edit(caller());
            let perm_2 = PermissionType::AnyOneEdite;
            if permissions.contains(&perm_1) || permissions.contains(&perm_2) || self.creator == caller() {
                // TODO the creator can renounce the permission to edit the cell
                //  we can add that later.
                return true;
            }
            return false;
        }
        true
    }

    //  ----------------------------------------------- Row CRUD permissions -----------------------------------------------\\
    pub fn update_row_permission(&mut self, new_row: &CRow, old_c_contract: CContract) -> Result<CRow, String> {
        let mut updated_cells: Vec<CCell> = vec![];

        for cell in new_row.cells.clone() {
            let is_permitted = self.has_cell_update_permeation(cell.clone(), old_c_contract.clone());
            if is_permitted {
                updated_cells.push(cell.clone());
            } else if let Some(old_cell) = old_c_contract.rows.iter().find(|r| r.id == new_row.id).and_then(|r| r.cells.iter().find(|c| c.field == cell.field)) {
                updated_cells.push(old_cell.clone());
            }
        }
        let deleted_cells = old_c_contract.rows.clone().iter().find(|r| r.id == new_row.id).map(|r| {
            r.cells.iter().filter(|c| !new_row.cells.iter().any(|new_cell| new_cell.field == c.field)).cloned().collect()
        }).unwrap_or(vec![]);


        // Iterate over deleted cells and add them if permitted
        for cell in deleted_cells {
            if self.has_cell_update_permeation(cell.clone(), old_c_contract.clone()) {
                updated_cells.push(cell.clone());
            }
        }

        return Ok(CRow {
            id: new_row.id.clone(),
            cells: updated_cells.clone(),
        });
    }
    // pub fn delete_row_permission()
    // pub fn create_row_permission()


    pub fn update(&mut self, contract_errors: &mut Vec<ContractError>, old_contract: &CustomContract) -> Self {
        if let Some(old_c_contract) = old_contract.contracts.iter().find(|c| c.id == self.id) {
            // Clone self.rows before iteration
            //  ----------------------------------------------- columns CRUD permissions -----------------------------------------------\\
            // --------------------------------------------------------------------------------------------------------------------------\\
            self.columns = self.columns.iter().map(|column| {
                if let Some(old_column) = old_c_contract.columns.iter().find(|c| c.field == column.field) {
                    return self.update_column_permission(column.clone(), old_column.clone()).unwrap();
                }
                column.clone()
            }).collect();

            //  ----------------------------------------------- Rows CRUD permissions -----------------------------------------------\\
            // --------------------------------------------------------------------------------------------------------------------------\\
            let mut updated_rows: Vec<CRow> = vec![];
            for row in self.rows.clone() {
                if let Ok(updated_row) = self.update_row_permission(&row, old_c_contract.clone()) {
                    updated_rows.push(updated_row);
                } else {
                    contract_errors.push(ContractError { message: "You don't have permission to update this row".to_string() });
                }
            }


            let deleted_rows = old_contract.contracts.clone().iter().find(|c| c.id == self.id).map(|c| {
                c.rows.iter().filter(|r| !self.rows.iter().any(|new_row| new_row.id == r.id)).cloned().collect()
            }).unwrap_or(vec![]);

            //--------------- prevent delete row in case of not having permission ---------------\\
            for deleted_row in deleted_rows {
                let is_in = self.rows.iter().any(|r| r.id == deleted_row.id);
                if is_in {
                    continue;
                }
                for cell in deleted_row.cells.clone() {
                    let is_permitted = self.has_cell_update_permeation(cell.clone(), old_c_contract.clone());
                    if !is_permitted {
                        contract_errors.push(ContractError { message: "You don't have permission to delete this cell".to_string() });
                        // prevent delete cell if not permitted
                        updated_rows.push(deleted_row.clone());
                    }
                }
            }


            self.rows = updated_rows;
            return self.clone();
        }


        // ----------------------------------------------- Other field CRUD permissions -----------------------------------------------\\
        // --------------------------------------------------------------------------------------------------------------------------\\
        self.creator = caller();
        self.date_created = ic_cdk::api::time() as f64;
        self.clone()
    }
}
