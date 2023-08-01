import {Column, ColumnTypes, Table} from "../../../../declarations/user_canister/user_canister.did";
import {handleRedux} from "../../../redux/main";
import {useDispatch, useSelector} from "react-redux";
import {randomString} from "../../../data_processing/data_samples";
import * as React from "react";
import {content} from "../../spesific/create_new_post";
import {updateTableContent} from "../payment_contract";
import {useFormulaDialog} from "../../../hook/dialog";

function useColumnManager(props: any) {
    const {current_file} = useSelector((state: any) => state.filesReducer);

    let [columns, setColumns] = React.useState(props.initial_columns)
    let {setRows} = props;
    const dispatch = useDispatch();

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

        const newContent = updateTableContent(props.props, content, updateColumn);

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
                headerName: newName.replace("_", "")
            };
            return newColumns;
        });

        function renameColumn(newTable: Table) {
            newTable.columns[index].field = newName.replace(" ", "_");
            newTable.columns[index].headerName = newName;
            return newTable;
        }

        const newContent = updateTableContent(props.props, content, renameColumn);


        // TODO: Dispatch relevant actions or update state as needed
        dispatch(handleRedux("UPDATE_CONTENT", {id: current_file.id, content: newContent}));
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

        const newContent = updateTableContent(props.props, content, updateColumn);

        // TODO: Dispatch relevant actions or update state as needed
        dispatch(handleRedux("UPDATE_CONTENT", {id: current_file.id, content: newContent}));
        // dispatch(handleRedux("ADD_CONTRACT", {id: contract.contract_id, contract}));
        // dispatch(handleRedux("CONTRACT_CHANGES", {changes: contract}));
        dispatch(handleRedux("CONTENT_CHANGES", {id: current_file.id, changes: newContent}));
    };


    return {columns, handleDeleteColumn, handleRenameColumn, handleAddColumn}
}

export default useColumnManager;