import { randomString } from "../data_processing/data_samples";
import { CColumn, CContract, Contract } from "../../declarations/backend/backend.did";

/**
 * Utility function to create and add a new column to a contract.
 * 
 * @param contract - The main contract object.
 * @param viewId - The ID of the specific view within the contract.
 * @param position - The position where the new column should be inserted.
 * @param updateCustomContractColumns - Function to update custom contract columns.
 * @param updateContract - Function to update the contract.
 * @returns The newly created column.
 */
export const addColumnUtils = (
    contract: Contract, 
    viewId: string,  
    position: number, 
    updateCustomContractColumns: (contract: Contract, columns: CColumn[], viewId: string) => Contract, 
    updateContract: (contract: Contract) => void
): CColumn => {
    const newColumn: CColumn = {
        id: randomString(),
        field: randomString(),
        headerName: "Untitled",
        column_type: 'string',
        filters: [],
        permissions: [{ AnyOneView: null }],
        formula_string: '',
        editable: true,
        deletable: true,
    };

    const current_contract = contract.contracts.find((c: CContract) => c.id === viewId);
    if (!current_contract) {
        throw new Error("Contract not found");
    }

    const newColumns = [...current_contract.columns];
    newColumns.splice(position, 0, newColumn);
    const updatedContract = updateCustomContractColumns(contract, newColumns, viewId);
    updateContract(updatedContract);

    return newColumn;
};