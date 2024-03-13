use ic_cdk::{caller, api};

use crate::{CColumn, CContract, ContractError, CRow, CustomContract};
use crate::contracts::custom_contract::types::CCell;
use crate::tables::PermissionType;

// Cell actions: 1. Add, 2. Delete, 3. Update
// - Prevent updating id or field value
// - Prevent update or delete or add if !can_update

impl CContract {
    // Column CRUD permissions
    fn check_creator_permission(&self) -> Result<(), String> {
        // let perm = slef.permissions;
        // if self.creator == caller() {
        //     Ok(())
        // } else {
        //     Err("Only creator can perform this action".to_string())
        // }
        Ok(())
    }

    fn update_column_permission(&self, new_column: CColumn, old_column: CColumn) -> Result<CColumn, String> {
        self.check_creator_permission()?;
        Ok(new_column.clone())
    }

    fn delete_column_permission(&self, deleted_column: CColumn) -> Result<CColumn, String> {
        self.check_creator_permission()?;
        Ok(deleted_column.clone())
    }

    fn create_column_permission(&self, new_column: CColumn) -> Result<CColumn, String> {
        self.check_creator_permission()?;
        Ok(new_column.clone())
    }

    // Row CRUD permissions
    fn has_cell_update_permission(&self, new_cell: &CCell, old_c_contract: &CContract) -> bool {
        if let Some(column) = old_c_contract.columns.iter().find(|c| c.field == new_cell.field) {
            let permissions = &column.permissions;
            let perm_1 = PermissionType::Edit(caller());
            let perm_2 = PermissionType::AnyOneEdite;
            return permissions.contains(&perm_1) || permissions.contains(&perm_2) || self.creator == caller();
        }
        self.creator == caller()
    }

    fn update_row_permission(&self, new_row: &CRow, old_c_contract: &CContract, contract_errors: &mut Vec<ContractError>) -> Result<CRow, String> {
        let mut updated_cells: Vec<CCell> = new_row.cells.iter().map(|cell| {
            let is_permitted = self.has_cell_update_permission(cell, old_c_contract);
            if is_permitted {
                return cell.clone();
            }
            if let Some(old_cell) = old_c_contract.rows.iter().find(|r| r.id == new_row.id).map(|r| r.cells.iter().find(|c| c.field == cell.field)) {
                let column = old_c_contract.columns.iter().find(|c| c.field == cell.field).unwrap();
                let name = column.headerName.clone();
                contract_errors.push(ContractError { message: format!("You don't have permission to update column: {}", name) });
                return old_cell.unwrap().clone();
            }
            cell.clone()
        }).collect();

        Ok(CRow {
            id: new_row.id.clone(),
            cells: updated_cells.clone(),
        })
    }

    // Update method
    pub fn update(&mut self, contract_errors: &mut Vec<ContractError>, old_contract: &CustomContract) -> Self {
        if let Some(old_c_contract) = old_contract.contracts.iter().find(|c| c.id == self.id) {
            // Columns CRUD permissions
            self.columns = self.columns.iter().map(|column| {
                if let Some(old_column) = old_c_contract.columns.iter().find(|c| c.field == column.field) {
                    let res = self.update_column_permission(column.clone(), old_column.clone());
                    if let Ok(updated_column) = res {
                        return updated_column;
                    } else if let Err(err) = res {
                        contract_errors.push(ContractError { message: err });
                    }
                }
                column.clone()
            }).collect();

            // Rows CRUD permissions
            let mut updated_rows: Vec<CRow> = vec![];
            for row in self.rows.clone() {
                let res = self.update_row_permission(&row, old_c_contract, contract_errors);
                if let Ok(updated_row) = res {
                    updated_rows.push(updated_row);
                } else if let Err(err) = res {
                    contract_errors.push(ContractError { message: err });
                }
            }

            // Prevent delete row if not permitted
            for deleted_row in old_contract.contracts.clone().iter().find(|c| c.id == self.id)
                .map(|c| c.rows.iter().filter(|r| !self.rows.iter().any(|new_row| new_row.id == r.id)).cloned().collect())
                .unwrap_or(vec![]) {
                for cell in deleted_row.cells.clone() {
                    let is_permitted = self.has_cell_update_permission(&cell, old_c_contract);
                    if !is_permitted {
                        contract_errors.push(ContractError { message: "You don't have permission to delete this cell".to_string() });
                        updated_rows.push(deleted_row.clone());
                    }
                }
            }
            self.rows = updated_rows;
            return self.clone();
        }
        // Other field CRUD permissions
        self.creator = caller();
        self.date_created = api::time() as f64;
        self.clone()
    }
}
