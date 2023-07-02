import * as React from 'react';
import {GridColDef, GridRowModel, GridValueGetterParams} from '@mui/x-data-grid';
import {Button} from '@mui/material';
import {StyledDataGrid} from "../spread_sheet";
import {useDispatch, useSelector} from "react-redux";
import {contract_sample, randomString} from "../../../data_processing/data_samples";
import {handleRedux} from "../../../redux/main";
import {useSnackbar} from "notistack";
import CustomColumnMenu from "./column_menu";
import {useTotalDept} from "./use_total_dept";
import ReleaseButton from "./release_button";
import CustomEditComponent from "./render_reciver_column";
import {logger} from "../../../dev_utils/log_data";


function handleRelease(id: number) {
    // Perform release logic here
    // Update the 'released' property of the corresponding row
    // Set the state or dispatch an action to update the data
}


export default function PaymentContract(props: any) {


    const dispatch = useDispatch();

    const {files_content, current_file, contracts, all_friends} = useSelector((state: any) => state.filesReducer);
    let content = files_content[current_file.id];

    // ToDo  `props.data[0]` instead of `props.children[0].data[0]`
    let table_content = props.children[0]
    let init_rows = table_content.data[0].Table.rows
    let extra_columns = table_content.data[0].Table.columns;

    function normalize_row(data: any) {
        return data.map((row: any) => {
            let extra_cells = {}
            row.cells[0] && row.cells[0].map((i: any) => {
                extra_cells[i[0]] = i[1]
            });
            let contract_id = row.contract[0].PaymentContract;
            let contract = contracts[contract_id]

            let receiver = all_friends.filter((friend: any) => friend.id === contract.receiver.toString())[0]
            return {
                id: contract_id,
                receiver: receiver && receiver.name,
                amount: contract.amount,
                released: contract.released,
                ...extra_cells
            }
        });
    }

    let normalized_row = normalize_row(init_rows)
    const [rows, setRows] = React.useState(normalized_row);


    const init_columns: any[] = [
        {
            field: 'receiver',
            headerName: 'receiver',
            width: 250,
            editable: true,
            renderEditCell: (props: any) => CustomEditComponent({...props, options: all_friends}),
        },
        {field: 'amount', headerName: 'Amount', width: 150, editable: true},
        {
            field: 'release',
            headerName: 'Release',
            width: 300,
            editable: false,
            renderCell: (params: GridValueGetterParams) => (
                <>
                    <ReleaseButton

                        released={params.row.released}
                        onClick={() => handleRelease(params.row.id)}
                    />
                    <Button color={"warning"}>X</Button>
                </>
            ),
        },
        ...extra_columns,
    ];


    let [columns, setColumns] = React.useState(init_columns)

    const handleAddRow = () => {


        let id = randomString();
        let contract = contract_sample;
        contract.contract_id = id;
        let newRow = {"contract": [{"PaymentContract": id}], "cells": [], "requests": []}


        let cells = init_rows[0] && init_rows[0].cells[0]
        if (cells) {
            let cell_sample = cells[0]
            let cell_name = cell_sample[0]
            newRow["cells"] = [[[cell_name, ""]]]
        }

        // add new row
        // let content_index = content.findIndex((item: any) => item.id == props.id)
        // let content_item = content[content_index];
        // let child_index = content_item.children.findIndex((item: any) => item.id == table_content.id)
        // let child_item = content_item.children[child_index];
        // child_item.data[0].Table.rows = [...child_item.data[0].Table.rows, newRow]

        // also add new row
        let newContent = content.map((item) => {
            if (item.id === props.id) {
                let newChildren = item.children.map((child) => {
                    if (child.data && child.id === table_content.id) {
                        let newData = child.data.map((data) => {
                            let newTable = {...data.Table};
                            newTable.rows = [...newTable.rows, {id: newTable.rows.length + 1, ...newRow}];
                            setRows(newTable.rows);
                            return {...data, Table: newTable};
                        });
                        return {...child, data: newData};
                    }
                    return child;
                });
                return {...item, children: newChildren};
            }
            return item;
        });

        dispatch(handleRedux("UPDATE_CONTENT", {id: current_file.id, content: newContent}));
        dispatch(handleRedux("ADD_CONTRACT", {id, contract}));
        dispatch(handleRedux("CONTRACT_CHANGES", {id, contract}));
        // let newRows = [...rows, newRow];


        // setRows([...rows, newRow]);
    };

    const handleAddColumn = () => {
        const newColumn: GridColDef = {
            field: `column${columns.length + 1}`,
            headerName: `Column ${columns.length + 1}`,
            width: 150,
            editable: true,
        };
        setColumns([...columns, newColumn]);
        // TODO // dispatch(handleRedux("CONTENT_CHANGES", {id:current_file, new_content}));
    };
    const handleDeleteColumn = (column_name: any) => {
        console.log("delete column", {column_name})
        setColumns((pre: any) => {
            let new_data = pre.filter((i: any) => i.field !== column_name)
            console.log({new_data})
            return new_data;
        })
    };

    const {enqueueSnackbar} = useSnackbar();
    let {revoke_message} = useTotalDept();

    const processRowUpdate = React.useCallback(
        (newRow: GridRowModel, oldRow: GridRowModel) => {
            console.log('Updated row:', newRow);
            console.log('Old row:', oldRow);
            // dispatch(handleRedux("UPDATE_CONTENT", {id: current_file.id, content: content}));
            let id = oldRow.id;

            var receiver = all_friends.filter((friend: any) => friend.name === newRow.receiver)[0]
            if (!receiver) {
                enqueueSnackbar("Please select a receiver", {variant: "warning"});
                return Promise.resolve();
            }

            let contract = {
                "contract_id": id,
                "sender": "",
                "released": newRow.released,
                "confirmed": newRow.confirmed,
                "amount": newRow.amount,
                "receiver": receiver.id,
            }

            dispatch(handleRedux("UPDATE_CONTRACT", {id, contract}));
            dispatch(handleRedux("CONTRACT_CHANGES", {id, contract}));
            revoke_message();
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


    return (
        <div contentEditable={false}
             style={{maxHeight: "25%", maxWidth: '100%'}}
        >
            <StyledDataGrid
                rows={rows}
                columns={columns}
                // disableColumnSelector
                hideFooterPagination
                editMode="row"
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={handleProcessRowUpdateError}
                slots={{
                    columnMenu: (p: any) => CustomColumnMenu(p, handleDeleteColumn),
                    toolbar: () => (
                        <span style={{display: 'flex'}}>
                            <Button size={"small"} onClick={handleAddRow} variant="text" color="primary">
                                Add Row
                            </Button>
                            <Button size={"small"} onClick={handleAddColumn} variant="text" color="primary">
                                Add Column
                            </Button>
                        </span>
                    ),

                }}

            />


        </div>
    );
}
