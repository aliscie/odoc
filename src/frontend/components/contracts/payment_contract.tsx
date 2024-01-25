import * as React from 'react';
import {useEffect} from 'react';
import {GridValueGetterParams} from '@mui/x-data-grid';
import {useDispatch, useSelector} from "react-redux";
import {handleRedux} from "../../redux/main";
import {useSnackbar} from "notistack";
import {useTotalDept} from "./payment_contract/use_total_dept";
import {Principal} from "@dfinity/principal";
import {PaymentContract, Row, Table} from "../../../declarations/user_canister/user_canister.did";
import useGetUser from "../../utils/get_user_by_principal";
import {RenderReceiver, RenderRelease} from "./payment_contract/renderers";
import {updateTableContent} from "./utils/update_table";
import {getFormula} from "./utils/parse_formula";
import CustomDataGrid from "../datagrid";
import {randomString} from "../../data_processing/data_samples";


export default function PaymentContract(props: any) {

    let {getUser, getUserByName} = useGetUser();
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
    const [data, setData] = React.useState({rows: [], columns: []});
    useEffect(() => {
        (async () => {
            setData({
                rows: await normalize_row(initial_rows),
                columns: custom_columns,
            })
        })()
    }, [])
    // TODO add column, delete column, rename column
    // let {
    //     columns,
    //     handleDeleteColumn,
    //     handleRenameColumn,
    //     handleAddColumn,
    //     handleColumnValidator
    // } = useColumnManager({initial_columns, props})

    async function normalize_row(data: any) {
        return Promise.all(
            data.map(async (row: Row) => {
                let extra_cells = {};
                row.cells &&
                row.cells[0] &&
                row.cells[0].map((cell_value: [string, string]) => {
                    extra_cells[cell_value[0]] = cell_value[1];
                });
                let contract_id = row.contract[0] && row.contract[0].PaymentContract;
                let contract = contracts && contracts[contract_id];
                if (contract) {
                    let receiver = await getUser(contract.receiver.toString());
                    return {
                        ...contract,
                        ...extra_cells,
                        id: row.id,
                        receiver: receiver && receiver.name,
                    };
                } else {
                    return null;
                }
            })
        ).then((normalizedRows) => normalizedRows.filter((row) => row !== null));
    }


    const {enqueueSnackbar} = useSnackbar();
    let {revoke_message} = useTotalDept();


    // const {dialog, handleClickOpen} = useFormulaDialog(handleColumnValidator);

    let custom_columns = initial_columns.map((column: any) => {
        let new_column = {...column}
        switch (column.field.toLowerCase()) {
            case "receiver":
                new_column['renderEditCell'] = (props: any) => RenderReceiver({...props, options: all_friends})
                return new_column
            case "released":
                new_column['renderCell'] = RenderRelease
                new_column['width'] = 150;
                return new_column
            // case "confirmed":
            //     new_column['renderCell'] = (props: any) => RenderConfirmed({...props, profile})
            //     return new_column
            case "amount":
                return new_column
            default:
                new_column['valueGetter'] = (params: GridValueGetterParams) => getFormula(params, new_column['dataValidator'][0])
                return new_column

        }
    })

    function addRow(position: number) {
        const id = randomString();
        const contract: PaymentContract = {
            contract_id: id,
            sender: Principal.fromText(profile.id),
            receiver: Principal.fromText("2vxsx-fae"),
            released: false,
            confirmed: false,
            canceled: false,
            amount: BigInt(0),
            extra_cells: [],
            objected: [],
        };
        const newRow: Row = {
            id,
            contract: [{"PaymentContract": id}],
            cells: [],
        };

        const cells = initial_rows[0] && initial_rows[0].cells[0];

        if (cells && cells.length > 0) {
            const cell_name = cells[0][0];
            newRow.cells = [[[cell_name, ""]]];
        }
        let newTableRows = [...initial_rows];
        newTableRows.splice(position, 0, newRow);

        //
        function updateRows(newTable: Table) {
            newTable.rows = newTableRows;
            return newTable;
        }

        let content = files_content[current_file.id];
        const newContent = updateTableContent(props, content, updateRows);


        dispatch(handleRedux("CONTENT_CHANGES", {id: current_file.id, changes: newContent}));
        dispatch(handleRedux("UPDATE_CONTENT", {id: current_file.id, content: newContent}));
        dispatch(handleRedux("ADD_CONTRACT", {id: contract.contract_id, contract}));

        return {
            id,
            receiver: "Null",
            amount: 0,
            released: false,
        };

    }

    const deleteRow = (rows: any, rowId: number) => {

        function deleteRow(newTable: Table) {
            newTable.rows = newTable.rows.filter((row) => row.id !== rowId); // Remove the row with matching rowId
            // setRows(newTable.rows);
            return newTable;
        }

        let content = files_content[current_file.id];
        const newContent = updateTableContent(props, content, deleteRow);

        // Example dispatching an action to update content
        dispatch(handleRedux("UPDATE_CONTENT", {id: current_file.id, content: newContent}));
        dispatch(handleRedux("CONTENT_CHANGES", {id: current_file.id, changes: newContent}));
        dispatch(handleRedux("REMOVE_CONTRACT", {id: rowId}));

    }

    const updateRow = (new_rows: any, newRow: any) => {

        // console.log('Updated row:', newRow);
        // console.log('Old row:', oldRow);

        // let old_keys = Object.keys(newRow);
        // let keys = Object.keys(newRow);
        // let diff = keys.filter((key) => !old_keys.includes(key));
        // if (diff.length > 0) {
        //     let new_cells: Array<[string, string]> = diff.map((key: string) => {
        //         if (newRow[key]) {
        //             return [String(key), newRow[key] || ""];
        //         } else {
        //             return [String(key), newRow[key] || ""];
        //         }
        //
        //     })
        //
        //     // update row cells
        //
        //     function updateCells(newTable: Table) {
        //
        //         newTable.rows.map((row: Row) => {
        //             if (row.id === newRow.id) {
        //                 return {...row, cells: [...row.cells, ...new_cells]};
        //                 // row.cells = [[...row.cells, ...new_cells]];
        //             }
        //             return row;
        //         })
        //         return newTable;
        //     }
        //
        //     let newContent: PaymentContract = updateTableContent(props, content, updateCells)
        //     dispatch(handleRedux("UPDATE_CONTENT", {id: current_file.id, content: newContent}));
        //     dispatch(handleRedux("CONTENT_CHANGES", {id: current_file.id, changes: newContent}));
        //
        // }

        let id = newRow.id;

        // let receiver = all_friends.filter((friend: any) => friend.name === newRow.receiver)[0]
        let receiver = getUserByName(newRow.receiver);
        if (!receiver) {
            enqueueSnackbar("Please select a receiver", {variant: "warning"});
            return Promise.resolve();
        }

        let contract: PaymentContract = {
            "canceled": Boolean(newRow.canceled || false),
            "contract_id": id,
            "sender": Principal.fromText(profile.id),
            "released": newRow.released,
            "confirmed": newRow.confirmed || false,
            "amount": BigInt(newRow.amount || 0),
            "receiver": Principal.fromText(receiver.id),
            extra_cells: [],
            objected: [],
        }

        dispatch(handleRedux("UPDATE_CONTRACT", {contract: contract}));
        dispatch(handleRedux("CONTRACT_CHANGES", {changes: contract}));
        revoke_message();


    }

    return (
        <div
            contentEditable={false}
            style={{
                // maxHeight: "25%",
                maxWidth: '70%'
            }}
        >
            {/*{dialog}*/}

            <CustomDataGrid
                data={data}
                addRow={addRow}
                deleteRow={deleteRow}
                updateRow={updateRow}
                // TODO
                //   addColumn={addColumn}
                //   deleteColumn={deleteColumn}
                //   updateColumn={updateColumn} // Rname, change formula, change type
            />


        </div>
    );
}
