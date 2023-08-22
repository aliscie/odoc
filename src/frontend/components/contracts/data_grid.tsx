import * as React from 'react';
import {GridCell, GridRowModel} from '@mui/x-data-grid';
import {Button, ButtonGroup} from '@mui/material';
import {StyledDataGrid} from "./spread_sheet";
import {useDispatch, useSelector} from "react-redux";
import {handleRedux} from "../../redux/main";
import ContextMenu from "../genral/context_menu";
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import DeleteIcon from '@mui/icons-material/Delete';
import {Payment, Row, Table} from "../../../declarations/user_canister/user_canister.did";
import useRowManager from "./hooks/useRowManager";
import useColumnManager from "./hooks/useColumnManager";
import {useFormulaDialog} from "../../hook/dialog";
import FunctionsIcon from '@mui/icons-material/Functions';
import {updateTableContent} from "./utils/update_table";


export default function DataGrid(props: any) {
    const dispatch = useDispatch();

    const {
        files_content,
        current_file,
    } = useSelector((state: any) => state.filesReducer);
    let content = files_content[current_file.id];

    // ToDo  `props.data[0]` instead of `props.children[0].data[0]`
    let table_content = props.children[0]
    let initial_rows = table_content.data[0].Table.rows

    let initial_columns = table_content.data[0].Table.columns;
    let {rows, handleAddRow, handleDeleteRow} = useRowManager({initial_rows, props})

    let {
        columns,
        handleDeleteColumn,
        handleAddColumn,
        handleColumnValidator
    } = useColumnManager({initial_columns, props});

    function normalize_row(data: any) {
        let res = [];
        data.map((item: any) => {
            let deserilzedrow = {};
            item.cells[0].map((cell: any) => {
                deserilzedrow[cell[0]] = cell[1];
                deserilzedrow['id'] = item.id;
            })
            res.push(deserilzedrow);
        })
        return res;
    }

    const processRowUpdate = React.useCallback(
        (newRow: GridRowModel, oldRow: GridRowModel) => {
            // console.log('Updated row:', newRow);
            // console.log('Old row:', oldRow);

            // let old_keys = Object.keys(oldRow);
            // let keys = Object.keys(newRow);
            // let diff = keys.filter((key) => !old_keys.includes(key));


            let new_cells: Array<[string, string]> = Object.keys(newRow).map((key: string) => {

                // if (newRow[key]) {
                return [String(key), newRow[key] || ""];
                // } else {
                //     return [String(key), oldRow[key] || ""];
                // }

            })


            function updateCells(newTable: Table) {
                const updatedRows = newTable.rows.map((row: Row) => {
                    if (row.id === oldRow.id) {
                        // const updatedCells = [...row.cells, ...new_cells];
                        return {...row, cells: [new_cells]};
                    }
                    return row;
                });
                return {...newTable, rows: updatedRows};
            }

            let newContent: Payment = updateTableContent(props, content, updateCells)

            dispatch(handleRedux("UPDATE_CONTENT", {id: current_file.id, content: newContent}));
            dispatch(handleRedux("CONTENT_CHANGES", {id: current_file.id, changes: newContent}));


            // let id = oldRow.id;
            // revoke_message();
            return Promise.resolve(newRow);
        },
        []
    );

    const handleProcessRowUpdateError = React.useCallback(
        (params: any) => {
            console.log('An error occurred while updating the row with params:', params);
            return Promise.resolve();
        }
        , []
    );


    const {dialog, handleClickOpen} = useFormulaDialog(handleColumnValidator);


    function CustomCell(props: any) {
        let field = props.field;

        const add_row = [
            <Button onClick={() => handleAddRow(props.rowId, true)} key="two"><ArrowCircleUpIcon/></Button>,
            <Button onClick={() => handleAddRow(props.rowId, false)} key="three"><ArrowCircleDownIcon/></Button>,
            <span onClick={() => handleAddRow(props.rowId, false)} style={{width: "100px"}} key="one">Add row</span>,
        ];

        const add_column = [
            <Button onClick={() => handleAddColumn(props.column.id, true)} key="two"><ArrowCircleLeftIcon/></Button>,
            <Button onClick={() => handleAddColumn(props.column.id, false)}
                    key="three"><ArrowCircleRightIcon/></Button>,
            <span style={{width: "100px"}} key="one"
                  onClick={() => handleAddColumn(props.column.id, false)}>Add column</span>,
        ];

        let button_group_props = {
            variant: "text",
            size: "small",
            ariaLabel: "small button group",
        }


        let options = [
            {
                content: <ButtonGroup {...button_group_props}>{add_row}</ButtonGroup>,
            },
            {
                content: <ButtonGroup {...button_group_props}>{add_column}</ButtonGroup>,
                // preventClose: true,
            },

            {
                content: "Delete row",
                icon: <DeleteIcon color={"error"}/>,
                onClick: () => handleDeleteRow(props.rowId),
            },
            {
                content: "Delete column",
                icon: <DeleteIcon color={"error"}/>,
                onClick: () => handleDeleteColumn(props.column.id),
            },
            {
                content: "Formula",
                icon: <FunctionsIcon/>,
                onClick: () => handleClickOpen(props.column),
            }
        ]


        let children = <GridCell {...props} />;

        return <ContextMenu options={options}>
            {children}
        </ContextMenu>;

    }


    return (
        <div contentEditable={false}
             style={{maxHeight: "25%", maxWidth: '100%'}}
        >
            {dialog}
            <StyledDataGrid
                rows={normalize_row(rows)}
                columns={columns}
                // disableColumnSelector
                hideFooterPagination
                editMode="row"
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={handleProcessRowUpdateError}
                slots={{
                    // toolbar: () => <div>{OptionsComponent}</div>,
                    // row: CustomRow,
                    cell: CustomCell,

                }}
            />


        </div>
    );
}
