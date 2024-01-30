import {CColumn, CContract, CustomContract} from "../../../../declarations/user_canister/user_canister.did";

export function updateContractColumn(contract: CustomContract, updated_column, view: any): CustomContract {

    return {
        ...contract,
        contracts: contract.contracts.map((c: CContract) => {
            if (c.id === view.id) {
                c.columns = c.columns.map((column: CColumn) => {
                    if (column.id === updated_column.id) {
                        return {...column, ...updated_column}
                    }
                    return column;
                });
                return c;
            }
            return c;
        })
    }
}

export function addContractColumn() {
}




export function updateCustomContractRows(contract: CustomContract, new_rows, view: any): CustomContract {

    return {
        ...contract,
        contracts: contract.contracts.map((c: CContract) => {
            if (c.id === view.id) {
                return {...c, rows: new_rows}
            }
            return c;
        })
    }
}


export function updateCustomContractColumns(contract: CustomContract, new_columns, view: any): CustomContract {

    return {
        ...contract,
        contracts: contract.contracts.map((c: CContract) => {
            if (c.id === view.id) {
                c.columns = new_columns;
            }
            return c;
        })
    }
}