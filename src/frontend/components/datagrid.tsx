import {Button, ButtonGroup} from "@mui/material";
import BasicMenu from "./genral/drop_down";
import ApproveButton from "./contracts/shares_contract/approve_button";
import ApplyButton from "./contracts/shares_contract/apply_button";
import PayButton from "./contracts/shares_contract/pay_button";
import {StyledDataGrid} from "./spread_sheet";
import * as React from "react";
import {GridRowModel} from "@mui/x-data-grid";
import {GridCell, GridRenderCellParams, GridRowModel} from '@mui/x-data-grid';
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import DeleteIcon from "@mui/icons-material/Delete";
import ContextMenu from "./genral/context_menu";
import {Column, ColumnTypes, Row, SharePaymentOption, Table} from "../../declarations/user_canister/user_canister.did";
import {randomString} from "../data_processing/data_samples";
import {handleRedux} from "../redux/main";
import {updateTableContent} from "./contracts/utils/update_table";

interface Props {
    data: any,
    current_view: any
}

function CustomDataGrid(props: Props) {
    // const [rows, setRows] = React.useState(props.data.rows);
    // const [columns, setColumns] = React.useState(props.data.columns);
    const [data, setData] = React.useState(props.data);

    const processRowUpdate = React.useCallback((newRow: GridRowModel, oldRow: GridRowModel) => {
            return Promise.resolve(newRow);
        },
        [props.data, props.current_view]
    );

    const handleProcessRowUpdateError = React.useCallback(
        (params: any) => {
            console.log('An error occurred while updating the row with params:', params);
            return Promise.resolve();
        }
        , []
    );

    const handleAddRow = (rowId: string, before: boolean) => {
        let newRow = {};
        let updated_contracts = {...contracts};
        const new_share_id = randomString();

        newRow = {
            id: new_share_id,
            contract: [{"SharesContract": new_share_id}],
            cells: [],
        };

        ///// ------- get the correct positioning --------- \\\
        const rowIndex = props.children[0].data[0].Table.rows.findIndex((row) => row.id === rowId);
        if (rowIndex === -1) {
            console.error("Row not found, handle the error or return early");
            return;
        }

        let step = before ? 0 : 1;
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
        // setData((pre) => {
        //     let rows = [...pre.rows];
        //     rows = rows.filter((row: Row) => row.id !== rowId);
        //     let updated_contracts = {...contracts};
        //     if (view == "Shares") {
        //         updated_contracts[table_content.id] = {
        //             ...contracts[table_content.id],
        //             shares: UpdatedContractFromRow(rows, contracts[table_content.id].shares),
        //         };
        //
        //     } else if (view == "Payment options") {
        //         let payment_options: Array<SharePaymentOption> = contracts[table_content.id].payment_options.filter((item: SharePaymentOption) => item.id !== rowId);
        //         updated_contracts[table_content.id] = {
        //             ...contracts[table_content.id],
        //             payment_options,
        //         };
        //     }
        //     dispatch(handleRedux("UPDATE_CONTRACT", {contract: updated_contracts[table_content.id]}));
        //     dispatch(handleRedux("CONTRACT_CHANGES", {changes: updated_contracts[table_content.id]}));
        //     return {...pre, rows}
        // })
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


    return <StyledDataGrid
        {...props.data}
        // rows={data}
        // columns={renderColumns}
        // disableColumnSelector
        hideFooterPagination
        editMode="row"
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        // slots={{
        //     cell: CustomCell,
        //     toolbar: () => <ButtonGroup variant="text" size={'small'}>
        //         <BasicMenu
        //             options={[
        //                 {content: "Shares", Click},
        //                 {content: "Payment options", Click},
        //                 {content: "Payments", Click},
        //                 ...render_shares_requests,
        //                 {content: "+Request", Click}
        //             ]}>{view}</BasicMenu>
        //         <Button>Filter</Button>
        //         {currentRequest && <ApproveButton
        //             req={currentRequest}
        //             contract={contracts[table_content.id]}/>}
        //
        //         {currentRequest && current_page != 'share' && < ApplyButton
        //             setData={setData}
        //             props={props}
        //             req={currentRequest}
        //             id={currentRequest && currentRequest.id}
        //             contract={contracts[table_content.id]}/>}
        //
        //         {currentRequest && current_page == 'share' && <Button>Upload share request</Button>}
        //         <PayButton contract={contracts[table_content.id]}/>
        //     </ButtonGroup>
        // }}

    />
}

export default CustomDataGrid