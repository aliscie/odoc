import * as React from 'react';
import {GridCell, GridRowModel, GridValueGetterParams} from '@mui/x-data-grid';
import {Button, ButtonGroup} from '@mui/material';
import {StyledDataGrid} from "../spread_sheet";
import {useDispatch, useSelector} from "react-redux";
import {randomString} from "../../../data_processing/data_samples";
import {handleRedux} from "../../../redux/main";
import {useSnackbar} from "notistack";
import CustomColumnMenu from "./column_menu";
import {useTotalDept} from "./use_total_dept";
import ReleaseButton from "./release_button";
import CustomEditComponent from "./render_reciver_column";
import {Principal} from "@dfinity/principal";
import CancelButton from "./cancel_button";
import ContextMenu from "../../genral/context_menu";
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import DeleteIcon from '@mui/icons-material/Delete';
import {Column, ColumnTypes, Row} from "../../../../declarations/user_canister/user_canister.did";

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
            id: randomString(),
            field: 'receiver',
            headerName: 'receiver',
            width: 250,
            editable: true,
            renderEditCell: (props: any) => CustomEditComponent({...props, options: all_friends}),
        },
        {
            id: randomString(),
            field: 'amount', headerName: 'Amount', width: 150, editable: true
        },
        {
            id: randomString(),
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
                    <CancelButton
                        released={params.row.released}
                        onClick={() => handleCancel(params.row.id)}
                    />

                </>
            ),
        },
        ...extra_columns,
    ];


    let [columns, setColumns] = React.useState(init_columns)

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

        const cells = init_rows[0] && init_rows[0].cells[0];
        if (cells) {
            const cell_sample = cells[0];
            const cell_name = cell_sample[0];
            newRow.cells = [[[cell_name, ""]]];
        }

        const rowIndex = rows.findIndex((row) => row.id === rowId);
        if (rowIndex === -1) {
            // Row not found, handle the error or return early
            return;
        }

        let newTableRows = [...rows];
        if (before) {
            // Insert the row above the specified row
            newTableRows.splice(rowIndex, 0, newRow);
        } else {
            // Insert the row below the specified row
            newTableRows.splice(rowIndex + 1, 0, newRow);
        }
        // const newContent = generateNewContent({Table: {rows: [...rows, newRow]}});
        let newContent = content.map((item) => {
            if (item.id === props.id) {
                let newChildren = item.children.map((child) => {
                    if (child.data && child.id === table_content.id) {
                        let newData = child.data.map((data) => {
                            let newTable = {...data.Table};
                            newTable.rows = [...newTable.rows, {...newRow}];
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

        // Update state or dispatch actions as needed
        // ...

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
        if (before) {
            setColumns((prevColumns) => {
                const newColumns = [...prevColumns];
                newColumns.splice(index, 0, newColumn);
                return newColumns;
            });
        } else {
            setColumns((prevColumns) => {
                const newColumns = [...prevColumns];
                newColumns.splice(index + 1, 0, newColumn);
                return newColumns;
            });
        }

        // Update newContent with the added column
        const newContent = content.map((item) => {
            if (item.id === props.id) {
                const newChildren = item.children.map((child) => {
                    if (child.data && child.id === table_content.id) {
                        const newData = child.data.map((data) => {
                            const newTable = {...data.Table};
                            newTable.columns = [...newTable.columns, newColumn];
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

        // TODO: Dispatch relevant actions or update state as needed
        dispatch(handleRedux("UPDATE_CONTENT", {id: current_file.id, content: newContent}));
        // dispatch(handleRedux("ADD_CONTRACT", {id: contract.contract_id, contract}));
        // dispatch(handleRedux("CONTRACT_CHANGES", {changes: contract}));
        dispatch(handleRedux("CONTENT_CHANGES", {id: current_file.id, changes: newContent}));
    };

    const generateNewContent = (newData: any): any[] => {
        return content.map((item) => {
            if (item.id === props.id) {
                const newChildren = item.children.map((child) => {
                    if (child.data && child.id === table_content.id) {
                        const updatedData = child.data.map((data) => {
                            return {...data, ...newData};
                        });
                        return {...child, data: updatedData};
                    }
                    return child;
                });
                return {...item, children: newChildren};
            }
            return item;
        });
    };


    const handleDeleteRow = (rowId: string) => {
        let newContent = content.map((item) => {
            if (item.id === props.id) {
                let newChildren = item.children.map((child) => {
                    if (child.data && child.id === table_content.id) {
                        let newData = child.data.map((data) => {
                            let newTable = {...data.Table};
                            newTable.rows = newTable.rows.filter((row) => row.id !== rowId); // Remove the row with matching rowId
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

        // Update state or dispatch actions as needed
        // ...

        // Example dispatching an action to update content
        dispatch(handleRedux("UPDATE_CONTENT", {id: current_file.id, content: newContent}));
    };

    const handleDeleteColumn = (colId: string) => {
        let colIndex = columns.findIndex((col: Column) => col.id === colId);
        let newContent = content.map((item) => {
            if (item.id === props.id) {
                let newChildren = item.children.map((child) => {
                    if (child.data && child.id === table_content.id) {
                        let newData = child.data.map((data) => {
                            let newTable = {...data.Table};
                            newTable.rows.forEach((row) => {
                                if (row.cells[colIndex]) {
                                    row.cells[colIndex].splice(0, 1);
                                }
                            });
                            setRows(newTable.rows);
                            return {...data, Table: newTable};
                        });
                        return {...child, data: newData};
                    }
                    return child;
                });
                return {...item, children: newChildren};
            }
            setColumns((pre: any) => {
                let new_columns = pre.filter((item: any, index: number) => index !== colIndex);
                return new_columns;
            })
            return item;
        });

        // Update state or dispatch actions as needed
        // ...

        // Example dispatching an action to update content
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

        // Update newContent with the renamed column
        const newContent = content.map((item) => {
            if (item.id === props.id) {
                const newChildren = item.children.map((child) => {
                    if (child.data && child.id === table_content.id) {
                        const newData = child.data.map((data) => {
                            const newTable = {...data.Table};
                            newTable.columns[index].headerName = newName;
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
            // dispatch(handleRedux("UPDATE_CONTENT", {id: current_file.id, content: content}));
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

            dispatch(handleRedux("UPDATE_CONTRACT", {id, contract}));
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
        console.log({props});

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

        if (!["receiver", "amount", "released", "confirmed"].includes(props.field.toLowerCase())) {
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
        return <ContextMenu options={options}>
            <GridCell {...props} />
        </ContextMenu>;
    }

    // function CustomRow(props: any) {
    //     console.log({props})
    //     return <GridRow {...props} />;
    // }

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

            />


        </div>
    );
}
