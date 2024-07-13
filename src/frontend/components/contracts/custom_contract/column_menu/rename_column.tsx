import * as React from 'react';
import {GridColumnMenuItemProps} from "@mui/x-data-grid";
import {PROMISES_CONTRACT_FIELDS, updateContractColumn} from "../utls";
import {Input} from "@mui/material";
import {PROMISES} from "../types";
import {CCell, CPayment} from "../../../../../declarations/backend/backend.did";


function RenameColumn(props: GridColumnMenuItemProps) {

    const {view, updateContract, contract, colDef} = props;
    // TODO maybe we should try to find a better way than this?

    if (view?.type == PROMISES && PROMISES_CONTRACT_FIELDS.includes(colDef.field)) {
        return null
    }

    function renameColumn(id: string, value: string) {

        let updated_column = {
            id,
            headerName: value
        }

        if (view?.type == PROMISES) {
            let updated_Contract = {...contract};
            updated_Contract.promises = updated_Contract.promises.map((p: CPayment) => {
                p.cells = p.cells.map((c: CCell) => {
                    if (c.field == id) {
                        c.field = value
                    }
                    return c
                });
                return p
            });
            updateContract(updated_Contract);

        } else {

            updateContract(updateContractColumn(contract, updated_column, view));
        }


    }


    const {columnName} = props;


    function handleRenameColumn(e: any) {
        let id = props.colDef.id;
        let value = e.target.value;
        renameColumn(id, value);
    }


    return (
        <Input
            onKeyDown={(event) => event.stopPropagation()}
            style={{marginLeft: "25px"}}
            onBlur={handleRenameColumn}
            disableUnderline
            defaultValue={columnName}
        />
    );

}

export default RenameColumn;

