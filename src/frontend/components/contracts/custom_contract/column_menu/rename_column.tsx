import * as React from 'react';
import {GridColumnMenuItemProps} from "@mui/x-data-grid";
import {updateContractColumn} from "../utls";
import {Input} from "@mui/material";


function RenameColumn(props: GridColumnMenuItemProps) {

    const {view, updateContract, contract, setView} = props;


    function renameColumn(id: string, value: string) {
        let updated_column = {
            id,
            headerName: value
        }
        updateContract(updateContractColumn(contract, updated_column, view));

        // update view with the new updated_column
        setView({
            ...view,
            columns: view.columns.map((column) => {
                if (column.id === id) {
                    return updated_column;
                }
                return column;
            })
        });
    }


    const {onReName, columnName} = props;


    function handleRenameColumn(e: any) {
        let id = props.colDef.id;
        let value = e.target.value;
        renameColumn(id, value);
    }


    return (
        <Input style={{marginLeft: "25px"}} onBlur={handleRenameColumn} disableUnderline
               defaultValue={columnName}/>
    );

}

export default RenameColumn;

