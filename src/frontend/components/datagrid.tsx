import {Button, ButtonGroup} from "@mui/material";
import {StyledDataGrid} from "./spread_sheet";
import * as React from "react";
import {useEffect} from "react";
import {GridCell, GridRowModel} from "@mui/x-data-grid";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import DeleteIcon from "@mui/icons-material/Delete";
import ContextMenu from "./genral/context_menu";
import {Row} from "../../declarations/user_canister/user_canister.did";

interface Props {
    data: any,
    tools: React.ReactNode,
    addRow: any
    deleteRow: any,
    updateRow: any,
}

function CustomDataGrid(props: Props) {
    // const [rows, setRows] = React.useState(props.data.rows);
    // const [columns, setColumns] = React.useState(props.data.columns);
    const [data, setData] = React.useState(props.data);
    // TODO
        useEffect(() => {
            setData(props.data)
        }, [props.data]);

    const processRowUpdate = React.useCallback((newRow: GridRowModel, oldRow: GridRowModel) => {

            setData((pre) => {
                let new_rows = [...pre.rows];
                new_rows = new_rows.map((row: Row) => {
                    if (row.id === oldRow.id) {
                        return {...row, ...newRow}
                    }
                    return row
                });
                props.updateRow(new_rows, newRow);
                return {...pre, rows: new_rows}
            })
            return Promise.resolve(newRow);
        },
        [props.data]
    );

    const handleProcessRowUpdateError = React.useCallback(
        (params: any) => {
            console.log('An error occurred while updating the row with params:', params);
            return Promise.resolve();
        }
        , [data]
    );
    // const {
    //     files_content,
    //     current_file,
    //     all_friends,
    //     profile,
    //     contracts
    // } = useSelector((state: any) => state.filesReducer);

    const handleAddRow = (rowId: string, before: boolean) => {
        // let updated_contracts = {...contracts};
        // const new_share_id = randomString();


        ///// ------- get the correct positioning --------- \\\
        const rowIndex = data.rows.findIndex((row) => row.id === rowId);

        if (rowIndex === -1) {
            console.error("Row not found, handle the error or return early");
            return;
        }

        let step = before ? 0 : 1;
        let newRow = props.addRow(rowIndex + step);
        let new_table_rows = [...data.rows]
        new_table_rows.splice(rowIndex + step, 0, newRow)
        setData((pre) => {
            let new_rows = [...pre.rows];
            new_rows.splice(rowIndex + step, 0, newRow);
            return {...pre, rows: new_rows}
        });


    };

    const handleAddColumn = (colId: number, before: boolean) => {
        // let column_type: ColumnTypes = {'Text': null};
        // let id = randomString();
        // const newColumn: Column = {
        //     // ...props.data.columns
        //     id,
        //     _type: column_type,
        //     field: `column${columns && (columns.length + 1)}`,
        //     filters: [],
        //     permissions: [],
        //     dataValidator: [],
        //     formula: [],
        //     // headerName: `Column ${columns.length + 1}`,
        //     // width: 150,
        //     editable: true,
        // };
        // let index = columns.findIndex((col) => col.id === colId);
        // let step = before ? 0 : 1;
        // setColumns((prevColumns) => {
        //     const newColumns = [...prevColumns];
        //     newColumns.splice(index + step, 0, newColumn);
        //     return newColumns;
        // });
        //
        // // Update newContent with the added column
        // function updateColumn(newTable: Table) {
        //     newTable.columns.splice(index + step, 0, newColumn);
        //     return newTable;
        // }
        //
        // const newContent = updateTableContent(props.props, content, updateColumn);
        //
        // // TODO: Dispatch relevant actions or update state as needed
        // dispatch(handleRedux("UPDATE_CONTENT", {id: current_file.id, content: newContent}));
        // // dispatch(handleRedux("ADD_CONTRACT", {id: contract.contract_id, contract}));
        // // dispatch(handleRedux("CONTRACT_CHANGES", {changes: contract}));
        // dispatch(handleRedux("CONTENT_CHANGES", {id: current_file.id, changes: newContent}));
    };


    const handleDeleteRow = (rowId: string) => {
        setData((pre) => {
            let rows = [...pre.rows];
            rows = rows.filter((row: Row) => row.id !== rowId);
            props.deleteRow(rows, rowId);
            // let updated_contracts = {...contracts};
            // if (view == "Shares") {
            //     updated_contracts[table_content.id] = {
            //         ...contracts[table_content.id],
            //         shares: UpdatedContractFromRow(rows, contracts[table_content.id].shares),
            //     };
            //
            // } else if (view == "Payment options") {
            //     let payment_options: Array<SharePaymentOption> = contracts[table_content.id].payment_options.filter((item: SharePaymentOption) => item.id !== rowId);
            //     updated_contracts[table_content.id] = {
            //         ...contracts[table_content.id],
            //         payment_options,
            //     };
            // }
            // dispatch(handleRedux("UPDATE_CONTRACT", {contract: updated_contracts[table_content.id]}));
            // dispatch(handleRedux("CONTRACT_CHANGES", {changes: updated_contracts[table_content.id]}));
            return {...pre, rows}
        })
    };

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

        let button_group_props: any = {
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
            // {
            //     content: "Delete column",
            //     icon: <DeleteIcon color={"error"}/>,
            //     onClick: () => handleDeleteColumn(props.column.id),
            // },
            // {
            //     content: "Formula",
            //     icon: <FunctionsIcon/>,
            //     onClick: () => handleClickOpen(props.column),
            // }
        ]

        if (['receiver', 'share'].includes(field)) {
            options = options.filter((item: any) => !["Formula", "Delete column"].includes(item.content));
        }

        let children = <GridCell {...props} />;

        return <ContextMenu options={options}>
            {children}
        </ContextMenu>;

    }

    // console.log({data})

    return <StyledDataGrid
        rows={data.rows}
        columns={data.columns}
        // disableColumnSelector
        hideFooterPagination
        editMode="row"
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        slots={{
            cell: CustomCell,
            toolbar: () => <ButtonGroup variant="text" size={'small'}>
                {props.tools}
            </ButtonGroup>
        }}

    />
}

export default CustomDataGrid