import {randomString} from "../../../data_processing/data_samples";
import {Payment, Row, Table} from "../../../../declarations/user_canister/user_canister.did";
import {Principal} from "@dfinity/principal";
import {handleRedux} from "../../../redux/main";
import {updateTableContent} from "../payment_contract";
import * as React from "react";
import {useDispatch, useSelector} from "react-redux";

function useRowManager(props: any) {
    const {profile, current_file, files_content} = useSelector((state: any) => state.filesReducer);

    const dispatch = useDispatch();
    const [rows, setRows] = React.useState(props.initial_rows);
    const handleAddRow = (rowId: string, before: boolean) => {
        const id = randomString();
        const contract: Payment = {
            contract_id: id,
            sender: Principal.fromText(profile.id),
            receiver: Principal.fromText("2vxsx-fae"),
            released: false,
            confirmed: false,
            canceled: false,
            amount: BigInt(0),
        };
        const newRow: Row = {
            id,
            contract: [{"PaymentContract": id}],
            cells: [],
            requests: [],
        };

        const cells = props.initial_rows[0] && props.initial_rows[0].cells[0];

        if (cells && cells.length > 0) {
            const cell_name = cells[0][0];
            newRow.cells = [[[cell_name, ""]]];
        }
        const rowIndex = props.initial_rows.findIndex((row) => row.id === rowId);
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

        let content = files_content[current_file.id];
        const newContent = updateTableContent(props.props, content, updateRows);

        // Example dispatching an action to update content
        dispatch(handleRedux("UPDATE_CONTENT", {id: current_file.id, content: newContent}));
        dispatch(handleRedux("ADD_CONTRACT", {id: contract.contract_id, contract}));
        dispatch(handleRedux("CONTRACT_CHANGES", {changes: contract}));
        dispatch(handleRedux("CONTENT_CHANGES", {id: current_file.id, changes: newContent}));
    };


    const handleDeleteRow = (rowId: string) => {
        function deleteRow(newTable: Table) {
            newTable.rows = newTable.rows.filter((row) => row.id !== rowId); // Remove the row with matching rowId
            setRows(newTable.rows);
            return newTable;
        }

        let content = files_content[current_file.id];
        const newContent = updateTableContent(props.props, content, deleteRow);

        // Example dispatching an action to update content
        dispatch(handleRedux("UPDATE_CONTENT", {id: current_file.id, content: newContent}));
        dispatch(handleRedux("CONTENT_CHANGES", {id: current_file.id, changes: newContent}));
        dispatch(handleRedux("REMOVE_CONTRACT", {id: rowId}));
    };


    return {rows, handleAddRow, handleDeleteRow}
}

export default useRowManager;