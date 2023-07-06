import * as React from 'react';
import {GridCell, GridRowModel, GridValueGetterParams} from '@mui/x-data-grid';
import {Button, ButtonGroup, Tooltip} from '@mui/material';
import {StyledDataGrid} from "../spread_sheet";
import {useDispatch, useSelector} from "react-redux";
import {randomString} from "../../../data_processing/data_samples";
import {handleRedux} from "../../../redux/main";
import {useSnackbar} from "notistack";
import CustomColumnMenu from "./column_menu";
import {useTotalDept} from "./use_total_dept";
import ReleaseButton from "./release_button";
import ReceiverComponent from "./render_reciver_column";
import {Principal} from "@dfinity/principal";
import CancelButton from "./cancel_button";
import ContextMenu from "../../genral/context_menu";
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import DeleteIcon from '@mui/icons-material/Delete';
import {Column, ColumnTypes, Row, Table} from "../../../../declarations/user_canister/user_canister.did";


function updateTableContent(props: any, content: any, updater: any) {
    let table_content = props.children[0];

    let newContent = content.map((item) => {
        if (item.id === props.id) {
            let newChildren = item.children.map((child) => {
                if (child.data && child.id === table_content.id) {
                    let newData = child.data.map((data) => {
                        return {...data, Table: updater({...data.Table})};
                    });
                    return {...child, data: newData};
                }
                return child;
            });
            return {...item, children: newChildren};
        }
        return item;
    });
    return newContent;
}


function handleRelease(id: number) {
    // Perform release logic here
    // Update the 'released' property of the corresponding row
    // Set the state or dispatch an action to update the data
}

function handleCancel(id: number) {
    // Perform release logic here
    // Update the 'released' property of the corresponding row
    // Set the state or dispatch an action to update the data
}


export default function PaymentContract(props: any) {


    const dispatch = useDispatch();

    const {
        profile,
        files_content,
        current_file,
        contracts,
        all_friends
    } = useSelector((state: any) => state.filesReducer);
    let content = files_content[current_file.id];

    // ToDo  `props.data[0]` instead of `props.children[0].data[0]`
    let table_content = props.children[0]
    let initial_rows = table_content.data[0].Table.rows
    let initial_columns = table_content.data[0].Table.columns;

    function normalize_row(data: any) {
        return data.map((row: any) => {
            console.log({normalize_row: row})
            let extra_cells = {}
            row.cells && row.cells[0] && row.cells[0].map((cell_value: [string, string]) => {
                extra_cells[cell_value[0]] = cell_value[1]
            });
            let contract_id = row.contract[0].PaymentContract;
            let contract = contracts[contract_id]

            let receiver = all_friends.filter((friend: any) => friend.id === contract.receiver.toString())[0]
            return {
                id: row.id,
                receiver: receiver && receiver.name,
                amount: contract.amount,
                released: contract.released,
                ...extra_cells
            }
        });
    }

    // let normalized_row = normalize_row(rows)
    const [rows, setRows] = React.useState(initial_rows);

    let RenderReceiver = (props: any) => ReceiverComponent({...props, options: all_friends})
    let RenderRelease = (params: GridValueGetterParams) => (
        <span style={{minWidth: "200px"}}>
            <Tooltip title={"Click here to release the payment."}>
                <ReleaseButton
                    released={params.row.released}
                    onClick={() => handleRelease(params.row.id)}
                />
            </Tooltip>
            <Tooltip title={"Click here to cancel the payment."}>
                <CancelButton
                    released={params.row.released}
                    onClick={() => handleCancel(params.row.id)}
                />
            </Tooltip>
        </span>
    )

    let [columns, setColumns] = React.useState(initial_columns)


    const handleAddRow = (rowId: string, before: boolean) => {
        const id = randomString();
        const contract = {
            contract_id: id,
            sender: Principal.fromText(profile.id),
            receiver: Principal.fromText("2vxsx-fae"),
            released: false,
            confirmed: false,
            amount: BigInt(0),
        };
        const newRow: Row = {
            id,
            contract: [{"PaymentContract": id}],
            cells: [],
            requests: [],
        };

        const cells = initial_rows[0] && initial_rows[0].cells[0];

        if (cells && cells.length > 0) {
            const cell_name = cells[0][0];
            newRow.cells = [[[cell_name, ""]]];
        }
        const rowIndex = initial_rows.findIndex((row) => row.id === rowId);
        if (rowIndex === -1) {
            // Row not found, handle the error or return early
            return;
        }
        let step = before ? 0 : 1;
        let newTableRows = [...rows];
        newTableRows.splice(rowIndex + step, 0, newRow);

        function updateRows(newTable: Table) {
            newTable.rows = newTableRows;
            setRows(newTableRows);
            return newTable;
        }

        const newContent = updateTableContent(props, content, updateRows);

        // Example dispatching an action to update content
        dispatch(handleRedux("UPDATE_CONTENT", {id: current_file.id, content: newContent}));
        dispatch(handleRedux("ADD_CONTRACT", {id: contract.contract_id, contract}));
        dispatch(handleRedux("CONTRACT_CHANGES", {changes: contract}));
        dispatch(handleRedux("CONTENT_CHANGES", {id: current_file.id, changes: newContent}));
    };


    const handleAddColumn = (colId: number, before: boolean) => {
        let column_type: ColumnTypes = {'Text': null};
        let id = randomString();
        const newColumn: Column = {
            id,
            _type: column_type,
            field: `column${columns.length + 1}`,
            filters: [],
            permissions: [],
            dataValidator: [],
            formula: [],
            // headerName: `Column ${columns.length + 1}`,
            // width: 150,
            editable: true,
        };
        let index = columns.findIndex((col) => col.id === colId);
        let step = before ? 0 : 1;
        setColumns((prevColumns) => {
            const newColumns = [...prevColumns];
            newColumns.splice(index + step, 0, newColumn);
            return newColumns;
        });

        // Update newContent with the added column
        function updateColumn(newTable: Table) {
            newTable.columns.splice(index + step, 0, newColumn);
            return newTable;
        }

        const newContent = updateTableContent(props, content, updateColumn);

        // TODO: Dispatch relevant actions or update state as needed
        dispatch(handleRedux("UPDATE_CONTENT", {id: current_file.id, content: newContent}));
        // dispatch(handleRedux("ADD_CONTRACT", {id: contract.contract_id, contract}));
        // dispatch(handleRedux("CONTRACT_CHANGES", {changes: contract}));
        dispatch(handleRedux("CONTENT_CHANGES", {id: current_file.id, changes: newContent}));
    };

    // const generateNewContent = (newData: any): any[] => {
    //     return content.map((item) => {
    //         if (item.id === props.id) {
    //             const newChildren = item.children.map((child) => {
    //                 if (child.data && child.id === table_content.id) {
    //                     const updatedData = child.data.map((data) => {
    //                         return {...data, ...newData};
    //                     });
    //                     return {...child, data: updatedData};
    //                 }
    //                 return child;
    //             });
    //             return {...item, children: newChildren};
    //         }
    //         return item;
    //     });
    // };


    const handleDeleteRow = (rowId: string) => {
        function deleteRow(newTable: Table) {
            newTable.rows = newTable.rows.filter((row) => row.id !== rowId); // Remove the row with matching rowId
            setRows(newTable.rows);
            return newTable;
        }

        const newContent = updateTableContent(props, content, deleteRow);

        // Example dispatching an action to update content
        dispatch(handleRedux("UPDATE_CONTENT", {id: current_file.id, content: newContent}));
        dispatch(handleRedux("CONTENT_CHANGES", {id: current_file.id, changes: newContent}));
    };

    const handleDeleteColumn = (colId: string) => {
        let colIndex = columns.findIndex((col: Column) => col.id === colId);

        function updateColumn(newTable: Table) {
            newTable.rows.forEach((row) => {
                if (row.cells[colIndex]) {
                    row.cells[colIndex].splice(0, 1);
                }
            });
            // newTable.columns = newTable.columns.filter((col: Column, index: number) => index !== colIndex);
            setRows(newTable.rows);
            setColumns((pre: any) => {
                let new_columns: Array<Column> = pre.filter((item: any, index: number) => index !== colIndex);
                // let remove_contract_column = new_columns.filter((item: any, index: number) => !["receiver", "amount", "release", "confined"].includes(item.field.toLowerCase()));
                newTable.columns = new_columns;
                return new_columns
            })
            return newTable;
        }

        const newContent = updateTableContent(props, content, updateColumn);

        // Example dispatching an action to update content
        console.log({newContent})
        dispatch(handleRedux("UPDATE_CONTENT", {id: current_file.id, content: newContent}));
        // dispatch(handleRedux("ADD_CONTRACT", {id: contract.contract_id, contract}));
        dispatch(handleRedux("CONTENT_CHANGES", {id: current_file.id, changes: newContent}));
    };


    const handleRenameColumn = (colId: number, newName: string) => {
        let index = columns.findIndex((col) => col.id === colId);
        setColumns((prevColumns) => {
            const newColumns = [...prevColumns];
            newColumns[index] = {
                ...newColumns[index],
                headerName: newName,
            };
            return newColumns;
        });

        function renameColumn(newTable: Table) {
            newTable.columns[index].field = newName.replace(" ", "_");
            newTable.columns[index].headerName = newName;
            return newTable;
        }

        const newContent = updateTableContent(props, content, renameColumn);


        // TODO: Dispatch relevant actions or update state as needed
        dispatch(handleRedux("UPDATE_CONTENT", {id: current_file.id, content: newContent}));
        // dispatch(handleRedux("ADD_CONTRACT", {id: contract.contract_id, contract}));
        // dispatch(handleRedux("CONTRACT_CHANGES", {changes: contract}));
        dispatch(handleRedux("CONTENT_CHANGES", {id: current_file.id, changes: newContent}));
    };


    const {enqueueSnackbar} = useSnackbar();
    let {revoke_message} = useTotalDept();

    const processRowUpdate = React.useCallback(
        (newRow: GridRowModel, oldRow: GridRowModel) => {
            console.log('Updated row:', newRow);
            console.log('Old row:', oldRow);

            let old_keys = Object.keys(oldRow);
            let keys = Object.keys(newRow);
            let diff = keys.filter((key) => !old_keys.includes(key));
            if (diff.length > 0) {
                let new_cells: Array<[string, string]> = diff.map((key: string) => {
                    if (newRow[key]) {
                        return [String(key), String(newRow[key])];
                    } else {
                        return [String(key), String(oldRow[key])];
                    }

                })

                // update row cells

                function updateCells(newTable: Table) {
                    newTable.rows.map((row: Row) => {
                        if (row.id === oldRow.id) {
                            row.cells = [[...row.cells, ...new_cells]];
                        }
                        return row;
                    })
                    return newTable;
                }

                let newContent = updateTableContent(props, content, updateCells)
                dispatch(handleRedux("UPDATE_CONTENT", {id: current_file.id, content: newContent}));
                dispatch((handleRedux("CONTENT_CHANGES", {id: current_file.id, changes: newContent})));

            }

            let id = oldRow.id;

            var receiver = all_friends.filter((friend: any) => friend.name === newRow.receiver)[0]
            if (!receiver) {
                enqueueSnackbar("Please select a receiver", {variant: "warning"});
                return Promise.resolve();
            }

            let contract = {
                "contract_id": id,
                "sender": Principal.fromText(profile.id),
                "released": newRow.released,
                "confirmed": newRow.confirmed || false,
                "amount": BigInt(newRow.amount),
                "receiver": Principal.fromText(receiver.id),
            }

            dispatch(handleRedux("UPDATE_CONTRACT", {id: contract.contract_id, contract}));
            dispatch(handleRedux("CONTRACT_CHANGES", {changes: contract}));
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
        ]

        if (!["receiver", "amount", "released"].includes(props.field.toLowerCase())) {
            options.push({
                content: "Delete column",
                icon: <DeleteIcon color={"error"}/>,
                onClick: () => handleDeleteColumn(props.column.id),
            })
            // push at index 0
            options.unshift({
                content: <input
                    onKeyDown={(e: any) => {
                        if (e.key === "Enter") {
                            handleRenameColumn(props.column.id, e.target.value)
                        }
                    }
                    }
                    placeholder={"Rename column..."}/>,
                preventClose: true,
            })
        }
        let children = <GridCell {...props} />;

        switch (field.toLowerCase()) {
            // TODO
            //     case "receiver":
            //         children = <RenderReceiver  {...props}/>
            case "released":
                children = <RenderRelease  {...props}/>
            default:
                children = <GridCell {...props} />
        }
        return <ContextMenu options={options}>
            {children}
        </ContextMenu>;

    }

    let custom_columns = columns.map((column: any) => {
        let new_column = {...column}
        if (column.field === "receiver") {
            new_column['renderEditCell'] = RenderReceiver
        } else if (column.field === "released") {
            new_column['renderCell'] = RenderRelease
            new_column['width'] = 150;
        }
        return new_column
    })
    return (
        <div contentEditable={false}
             style={{maxHeight: "25%", maxWidth: '100%'}}
        >
            <StyledDataGrid
                rows={normalize_row(rows)}
                columns={custom_columns}
                // disableColumnSelector
                hideFooterPagination
                editMode="row"
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={handleProcessRowUpdateError}
                slots={{
                    // row: CustomRow,
                    cell: CustomCell,
                    columnMenu: (p: any) => CustomColumnMenu(p),
                    // toolbar: () => (
                    //     <span style={{display: 'flex'}}>
                    //         <Button size={"small"} onClick={handleAddRow} variant="text" color="primary">
                    //             Add Row
                    //         </Button>
                    //         <Button size={"small"} onClick={handleAddColumn} variant="text" color="primary">
                    //             Add Column
                    //         </Button>
                    //     </span>
                    // ),

                }}
                // checkboxSelection
            />


        </div>
    );
}
