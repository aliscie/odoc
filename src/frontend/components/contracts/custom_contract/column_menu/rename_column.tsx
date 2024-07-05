import * as React from 'react';
import {GridColumnMenuItemProps} from "@mui/x-data-grid";
import {updateContractColumn} from "../utls";
import {Input} from "@mui/material";
import {PROMISES} from "../types";


function RenameColumn(props: GridColumnMenuItemProps) {

    const {view, updateContract, contract, colDef} = props;
    // TODO maybe we should try to find a better way than this?
    if (view?.type == PROMISES && ['amount', 'sender', 'receiver', 'status'].includes(colDef.field)) {
        return null
    }

    function renameColumn(id: string, value: string) {
        let updated_column = {
            id,
            headerName: value
        }
        updateContract(updateContractColumn(contract, updated_column, view));

    }


    const {onReName, columnName} = props;


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

