import * as React from 'react';
import {GridCell, GridRowModel, GridValueGetterParams} from '@mui/x-data-grid';
import {Button, ButtonGroup} from '@mui/material';
import {StyledDataGrid} from "./spread_sheet";
import {useDispatch, useSelector} from "react-redux";
import {handleRedux} from "../../redux/main";
import {useSnackbar} from "notistack";
import {useTotalDept} from "./payment_contract/use_total_dept";
import {Principal} from "@dfinity/principal";
import ContextMenu from "../genral/context_menu";
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import DeleteIcon from '@mui/icons-material/Delete';
import {Payment, Row, Table} from "../../../declarations/user_canister/user_canister.did";
import useRowManager from "./hooks/useRowManager";
import useColumnManager from "./hooks/useColumnManager";
import useGetUser from "../../utils/get_user_by_principal";
import {useFormulaDialog} from "../../hook/dialog";
import FunctionsIcon from '@mui/icons-material/Functions';
import {RenderConfirmed, RenderReceiver, RenderRelease} from "./payment_contract/renderers";
import {updateTableContent} from "./utils/update_table";
import {getFormula} from "./utils/parse_formula";


export default function PaymentContract(props: any) {
    let {getUser} = useGetUser();
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
    let {rows, handleAddRow, handleDeleteRow} = useRowManager({initial_rows, props})
    let {
        columns,
        handleDeleteColumn,
        handleRenameColumn,
        handleAddColumn,
        handleColumnValidator
    } = useColumnManager({initial_columns, props})

    function normalize_row(data: any) {
        return data.map((row: Row) => {

            let extra_cells = {}
            row.cells && row.cells[0] && row.cells[0].map((cell_value: [string, string]) => {
                extra_cells[cell_value[0]] = cell_value[1]
            });
            let contract_id = row.contract[0] && row.contract[0].PaymentContract;
            let contract = contracts && contracts[contract_id]
            if (contract) {


                let receiver = getUser(contract.receiver.toString());
                return {
                    ...contract,
                    ...extra_cells,
                    id: row.id,
                    receiver: receiver && receiver,
                }
            } else {
                return null
            }

        }).filter((row: any) => row !== null);
    }


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
                        return [String(key), newRow[key] || ""];
                    } else {
                        return [String(key), oldRow[key] || ""];
                    }

                })

                // update row cells

                function updateCells(newTable: Table) {

                    newTable.rows.map((row: Row) => {
                        if (row.id === oldRow.id) {
                            row = {...row, cells: [...row.cells, ...new_cells]};
                            // row.cells = [[...row.cells, ...new_cells]];
                        }
                        return row;
                    })
                    return newTable;
                }

                let newContent: Payment = updateTableContent(props, content, updateCells)
                dispatch(handleRedux("UPDATE_CONTENT", {id: current_file.id, content: newContent}));
                dispatch(handleRedux("CONTENT_CHANGES", {id: current_file.id, changes: newContent}));

            }

            let id = oldRow.id;

            let receiver = all_friends.filter((friend: any) => friend.name === newRow.receiver)[0]
            if (!receiver) {
                enqueueSnackbar("Please select a receiver", {variant: "warning"});
                return Promise.resolve();
            }

            let contract = {
                "contract_id": id,
                "sender": Principal.fromText(profile.id),
                "released": newRow.released,
                "confirmed": newRow.confirmed || false,
                "amount": BigInt(newRow.amount || 0),
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
        ]

        if (!["receiver", "amount", "released", "confirmed"].includes(props.field.toLowerCase())) {
            options.push({
                content: "Delete column",
                icon: <DeleteIcon color={"error"}/>,
                onClick: () => handleDeleteColumn(props.column.id),
            })

            options.unshift(
                {
                    content: "Formula",
                    icon: <FunctionsIcon/>,
                    onClick: () => handleClickOpen(props.column),
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
        switch (column.field.toLowerCase()) {
            case "receiver":
                new_column['renderEditCell'] = (props: any) => RenderReceiver({...props, options: all_friends})
                return new_column
            case "released":
                new_column['renderCell'] = RenderRelease
                new_column['width'] = 150;
                return new_column
            case "confirmed":
                new_column['renderCell'] = (props: any) => RenderConfirmed({...props, profile})
                return new_column
            case "amount":
                return new_column
            default:
                new_column['valueGetter'] = (params: GridValueGetterParams) => getFormula(params, new_column['dataValidator'][0])
                return new_column

        }
    })

    return (
        <div
            contentEditable={false}
            style={{maxHeight: "25%", maxWidth: '100%'}}
        >
            {dialog}
            <StyledDataGrid
                rows={normalize_row(rows)}
                columns={custom_columns}
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
