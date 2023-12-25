import * as React from 'react';
import {useEffect, useState} from 'react';
import {GridCell, GridRenderCellParams, GridRowModel} from '@mui/x-data-grid';
import {Button, ButtonGroup} from '@mui/material';
import {StyledDataGrid} from "../spread_sheet";
import {useDispatch, useSelector} from "react-redux";
import {handleRedux} from "../../redux/main";
import ContextMenu from "../genral/context_menu";
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Row,
    Share,
    SharePaymentOption,
    ShareRequest,
    SharesContract,
    StoredContract,
    Table,
    User
} from "../../../declarations/user_canister/user_canister.did";
import useColumnManager from "./hooks/useColumnManager";
import {useFormulaDialog} from "../../hook/dialog";
import {updateTableContent} from "./utils/update_table";
import PayButton from "./shares_contract/pay_button";
import {RenderReceiver} from "./payment_contract/renderers";
import BasicMenu from "../genral/drop_down";
import {randomString} from "../../data_processing/data_samples";
import {Principal} from "@dfinity/principal";
import useGetUser from "../../utils/get_user_by_principal";
import {actor} from "../../App";
import ShareConfirmButton from "./shares_contract/conforim_button";
import useSharesRequests from "./shares_contract/use_shares_requests";
import ApproveButton from "./shares_contract/approve_button";
import ApplyButton from "./shares_contract/apply_button";

// export type SharesContractViews = "Payments" | "Shares" | "SharesRequests" | "PaymentOptions";

export default function SharesContract(props: any) {
    let [view, setView] = useState("Shares");
    let {getUser, getUserByName} = useGetUser();
    const dispatch = useDispatch();

    const {
        files_content,
        current_file,
        all_friends,
        profile,
        contracts
    } = useSelector((state: any) => state.filesReducer);


    // ToDo  `props.data[0]` instead of `props.children[0].data[0]`
    let table_content = props.children[0]
    let initial_rows = table_content.data[0].Table.rows

    let initial_columns = table_content.data[0].Table.columns;


    let {
        columns,
        handleDeleteColumn,
        handleAddColumn,
        handleColumnValidator
    } = useColumnManager({initial_columns, props});


    // ------------------------ Handle Columns and SetData ------------------------ \\
    let custom_columns = columns.map((column: any) => {
        let new_column = {...column}
        switch (column.field.toLowerCase()) {
            case "receiver":
                new_column['renderEditCell'] = (props: any) => RenderReceiver({
                    ...props,
                    options: [...all_friends, profile]
                })
                return new_column

            case "confirmed":
                new_column['renderCell'] = (params: GridRenderCellParams<any, Date>) => {
                    let share_contract_id = params.row.contract[0]["SharesContract"];
                    let share: Share = contracts[table_content.id].shares.find((share) => share.share_contract_id === share_contract_id);
                    return <ShareConfirmButton
                        contract={contracts[table_content.id]}
                        share={share}
                    />
                }

                return new_column
            default:
                return new_column

        }
    })

    let [data, setData]: any = useState({
        rows: [],
        columns: custom_columns
    });

    /// ----------------------- Hande contracts in Share file ----------------------- \\\
    let current_page = window.location.pathname.split("/").pop();
    useEffect(() => {
        (async () => {
            if (current_page === "share") {

                let contract: undefined | { Ok: StoredContract } | { Err: string } = actor && current_file && await actor.get_contract(current_file.author, table_content.id);
                if (contract && "Ok" in contract) {

                    let fetched_contracts = {}
                    fetched_contracts[table_content.id] = contract.Ok["SharesContract"];
                    let normalized_rows = await normalize_share_rows(fetched_contracts);
                    setData((pre: any) => {
                        return {...pre, rows: normalized_rows}
                    })
                    dispatch(handleRedux("UPDATE_CONTRACT", {contract: contract.Ok["SharesContract"]}));

                    //TODO console.log("Why this runs 3 times?");

                }

            } else {
                let rows = await normalize_share_rows(contracts)
                setData((pre: any) => {
                    return {...pre, rows}
                })
            }
        })()
    }, [current_file])


    //  ---------- TODO Why this component renders 10 times -------- \\
    //// ----------------------- TODO ----------------------- \\\\
    //                            Hande add row correct for share
    //                            Sometimes it has two shares on contract, but one row on content,
    //                            which should not happen

    async function normalize_share_rows(CONTRACTS): Promise<Array<Row>> {
        const normalizedRows = await Promise.all(
            CONTRACTS[table_content.id].shares.map(async (share) => {
                let receiver = share && await getUser(share.receiver.toString());
                return {
                    "accumulation": share && share.accumulation,
                    "share%": share && share.share,
                    "receiver": receiver ? receiver.name : "",
                    "id": share.share_contract_id,
                    "contract": [{"SharesContract": share.share_contract_id}],
                    "cells": [],
                };
            })
        );

        return normalizedRows;
    }

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


    let {setRequest, currentRequest, addRequestRow, handleClickReq, UpdatedContractFromRow} = useSharesRequests({
        table_content,
        props,
        setView,
        data,
        setData
    });


    const processRowUpdate = React.useCallback((newRow: GridRowModel, oldRow: GridRowModel) => {

            // ------------------ Update the extra cells ------------------ \\
            // let new_cells: Array<[string, string]> = Object.keys(newRow).map((key: string) => {
            //     return [String(key), newRow[key] || ""];
            // })
            //
            // function updateCells(newTable: Table) {
            //     const updatedRows = newTable.rows.map((row: Row) => {
            //         if (row.id === oldRow.id) {
            //             // const updatedCells = [...row.cells, ...new_cells];
            //             return {...row, cells: [new_cells]};
            //         }
            //         return row;
            //     });
            //     return {...newTable, rows: updatedRows};
            // };
            //
            // let newContent: SharesContract = updateTableContent(props, content, updateCells)
            // // TODO when hit save new data get removed, but they stored correctly in the BackEnd?
            //
            // dispatch(handleRedux("UPDATE_CONTENT", {id: current_file.id, content: newContent}));
            // dispatch(handleRedux("CONTENT_CHANGES", {id: current_file.id, changes: newContent}));
            let shares_requests: Array<[string, ShareRequest]> = contracts[table_content.id].shares_requests;
            let shares_requests_keys = ['id', 'receiver', 'share']

            // ------------------ Update Shares Requests ------------------ \\
            if (Object.keys(newRow).toString() === shares_requests_keys.toString()) {

                let new_rows = [...data.rows];
                setData((pre) => {
                    new_rows = new_rows.map((row: Row) => {
                        if (row.id === oldRow.id) {
                            return {...row, ...newRow}
                        }
                        return row
                    });
                    return {...pre, rows: new_rows}
                });

                shares_requests = contracts[table_content.id].shares_requests.map((share_req: [string, ShareRequest]) => {
                    if (share_req[1].id == currentRequest.id) {
                        let new_item: [string, ShareRequest] = [newRow.id, {
                            ...share_req[1],
                            shares: UpdatedContractFromRow(new_rows, share_req[1].shares),
                        }]
                        return new_item;
                    }
                    return share_req;
                });

            }


            // ------------------ Update Payment Option ------------------ \\
            let payment_options: Array<SharePaymentOption> = contracts[table_content.id].payment_options;
            if (Object.keys(newRow).toString() === ["id", "title", "amount", "description"].toString()) {
                payment_options = payment_options.map((item: SharePaymentOption) => {
                    if (item.id === oldRow.id) {
                        let new_item: SharePaymentOption = {
                            'id': newRow.id,
                            'title': newRow.title,
                            'date': "", // TODO handle and string data if needed later.
                            'description': newRow.description,
                            'amount': BigInt(newRow.amount),
                        };
                        return new_item;
                    }
                    return item
                })
            }

            // ------------------ Update Contract ------------------ \\


            // if (Object.keys(newRow).toString() === "accumulation,share%,receiver,id,contract,cells") {
            // }

            let updated_share_id = newRow.contract && newRow.contract[0] && newRow.contract[0]["SharesContract"];
            let receiver_name: string = newRow["receiver"];
            let receiver: User | null = getUserByName(receiver_name);

            let updated_contract: SharesContract = {
                ...contracts[table_content.id],
                "payment_options": payment_options,
                // contract_id: contract.contract_id,
                // payments: contract.payments,
                "shares_requests": shares_requests,
                "author": contracts[table_content.id].author,
                shares: contracts[table_content.id].shares.map((item: Share) => {
                    if (item.share_contract_id === updated_share_id) {
                        return {
                            ...item,
                            "accumulation": BigInt(item.accumulation || 0),
                            "confirmed": Boolean(item.confirmed),
                            "share_contract_id": updated_share_id,
                            "share": newRow["share%"],
                            "receiver": Principal.fromText(receiver ? receiver.id.toString() : "2vxsx-fae"),
                        };
                    }
                    return item;
                }),
            };


            // ------------------ TODO save the contract in form of StoredContract ------------------ \\
            //                      That is in order to prevent the need for extra steps in denormalize_contracts.tsx
            //                         let contract: StoredContract = {
            //                             "SharesContract": {
            //                                 "shares": shares,
            //                                 "payments": item.payments,
            //                                 "shares_requests": item.shares_requests,
            //                                 "contract_id": item.contract_id,
            //                             }
            //                         };


            dispatch(handleRedux("UPDATE_CONTRACT", {contract: updated_contract}));
            dispatch(handleRedux("CONTRACT_CHANGES", {changes: updated_contract}));
            setData((pre) => {
                let new_rows = [...pre.rows];
                new_rows = new_rows.map((row: Row) => {
                    if (row.id === oldRow.id) {
                        return {...row, ...newRow}
                    }
                    return row
                });
                return {...pre, rows: new_rows}
            })
            // revoke_message();

            return Promise.resolve(newRow);
        },
        [currentRequest, data]
    );

    const handleDeleteRow = (rowId: string) => {
        setData((pre) => {
            let rows = [...pre.rows];
            rows = rows.filter((row: Row) => row.id !== rowId);
            let updated_contracts = {...contracts};
            if (view == "Shares") {
                updated_contracts[table_content.id] = {
                    ...contracts[table_content.id],
                    shares: UpdatedContractFromRow(rows, contracts[table_content.id].shares),
                };

            } else if (view == "Payment options") {
                let payment_options: Array<SharePaymentOption> = contracts[table_content.id].payment_options.filter((item: SharePaymentOption) => item.id !== rowId);
                updated_contracts[table_content.id] = {
                    ...contracts[table_content.id],
                    payment_options,
                };
            }
            dispatch(handleRedux("UPDATE_CONTRACT", {contract: updated_contracts[table_content.id]}));
            dispatch(handleRedux("CONTRACT_CHANGES", {changes: updated_contracts[table_content.id]}));
            return {...pre, rows}
        })
    };

    const handleAddRow = (rowId: string, before: boolean) => {
        let newRow = {};
        let updated_contracts = {...contracts};

        //// ----- handle the different views -------- \\\\
        switch (view) {
            case "Payment options":
                let new_payment_option: SharePaymentOption = {
                    id: randomString(),
                    title: "",
                    amount: 0n,
                    description: "",
                    date: "",
                };

                let optionRowIndex = contracts[table_content.id].payment_options.findIndex((item: SharePaymentOption) => item.id === rowId);
                let optionStep = before ? 0 : 1;
                contracts[table_content.id].payment_options.splice(optionRowIndex + optionStep, 0, new_payment_option);
                let payment_options_updated_contract = {
                    ...contracts[table_content.id],
                    "payment_options": contracts[table_content.id].payment_options
                };
                updated_contracts[table_content.id] = payment_options_updated_contract

                newRow = {
                    id: new_payment_option.id,
                    description: "",
                    amount: 0n,
                    title: "",
                }

                setData((pre) => {
                    let new_rows = [...pre.rows];
                    new_rows.splice(optionRowIndex + optionStep, 0, newRow);
                    return {...pre, rows: new_rows}
                })
                dispatch(handleRedux("CONTRACT_CHANGES", {changes: updated_contracts[table_content.id]}));
                // dispatch(handleRedux("UPDATE_CONTRACT", {contract: updated_contract}));
                break;
            case "Shares":

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

                updated_contracts[table_content.id] = {
                    ...contracts[table_content.id],
                    shares: UpdatedContractFromRow(new_table_rows, contracts[table_content.id].shares),
                };

                let content = files_content[current_file.id];
                const newContent = updateTableContent(props, content, (newTable: Table) => {
                    return {...newTable, rows: new_table_rows};
                });

                // in this case we are not adding a new contract we are just adding new share to the current contracts
                // so there is no need to the following line
                // dispatch(handleRedux("ADD_CONTRACT", {id: contract.contract_id, contract}));
                // dispatch(handleRedux("UPDATE_CONTENT", {id: current_file.id, content: newContent}));
                // dispatch(handleRedux("CONTENT_CHANGES", {id: current_file.id, changes: newContent}));
                dispatch(handleRedux("CONTRACT_CHANGES", {changes: updated_contracts[table_content.id]}));
                dispatch(handleRedux("UPDATE_CONTRACT", {contract: updated_contracts[table_content.id]}));
                break;
            default:
                addRequestRow(rowId, before);
                break;

        }

        //// --------------- Cell Update ----------------- \\\\
        // const cells = props.children[0].data[0].Table.rows[0].cells[0];
        //
        // if (cells && cells.length > 0) {
        //     const cell_name = cells[0][0];
        //     newRow.cells = [[[cell_name, ""]]];
        // }


    };

    let Click = async (e: string) => {

        switch (e) {
            case 'Shares':
                setData({
                    rows: await normalize_share_rows(contracts),
                    columns: custom_columns
                });
                setView(e);
                setRequest(null);
                break;
            case "Payments":
                let rows = [];
                for (const payment of contracts[table_content.id].payments) {
                    let sender: any = await getUser(payment.sender.toString());
                    sender = sender ? sender.name : ""
                    let row = {
                        id: randomString(),
                        sender,
                        amountUSDC: payment.amount,
                    }
                    rows.push(row);
                }
                setData({
                    rows,
                    columns: [
                        {field: 'sender', headerName: 'sender', width: 150},
                        {field: 'amountUSDC', headerName: 'amountUSDC', width: 150},
                        {field: 'date', headerName: 'date', width: 150},
                    ],
                });

                setView(e);
                setRequest(null);
                break;

            case '+Request':
                let new_share: Share = {
                    'share_contract_id': randomString(),
                    'accumulation': 0n,
                    'share': 100n,
                    'confirmed': true,
                    'receiver': Principal.fromText(profile.id),
                };
                let new_request: ShareRequest = {
                    id: randomString(),
                    name: "name",
                    requester: Principal.fromText(profile.id),
                    shares: [new_share],
                    approvals: [],
                    is_applied: false,
                };

                let shares_requests: Array<[string, ShareRequest]> = contracts[table_content.id].shares_requests;
                shares_requests.push([new_request.id, new_request]);

                let updated_contract: SharesContract = {
                    ...contracts[table_content.id],
                    shares_requests,
                };

                dispatch(handleRedux("UPDATE_CONTRACT", {contract: updated_contract}));
                dispatch(handleRedux("CONTRACT_CHANGES", {changes: updated_contract}));
                await handleClickReq(new_request);
                // setView(new_request.id);
                break;

            case 'Payment options':
                let payment_options_rows = contracts[table_content.id].payment_options.map((payment_option: SharePaymentOption) => {
                    let payment_option_row = {
                        id: payment_option.id,
                        title: payment_option.title,
                        amount: payment_option.amount,
                        // date: payment_option.date,
                        description: payment_option.description,
                    };
                    return payment_option_row
                })
                setData({
                    rows: payment_options_rows,
                    columns: [

                        {field: 'title', headerName: 'title', width: 150, editable: true},
                        {field: 'amount', headerName: 'amount', width: 150, editable: true},
                        {field: 'description', headerName: 'description', width: 150, editable: true},
                    ]
                });
                setView(e);
                setRequest(null);
                break;
            default:
                setView(e);
        }

    }

    let render_shares_requests = contracts && contracts[table_content.id] && contracts[table_content.id].shares_requests && contracts[table_content.id].shares_requests.map((req: [string, ShareRequest]) => {
        return {content: req[1] && req[1].id, Click: async () => handleClickReq(req[1])}
    }) || [];

    if (!data.columns) {
        console.error("// ------------ data is empty ------------\\")
        return <div>Error</div>
    }

    return (
        <div contentEditable={false}
             style={{
                 // maxHeight: "25%",
                 maxWidth: '90%'
             }}
        >
            {dialog}
            {view && <StyledDataGrid
                {...data}
                // rows={data}
                // columns={renderColumns}
                // disableColumnSelector
                hideFooterPagination
                editMode="row"
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={handleProcessRowUpdateError}
                slots={{
                    cell: CustomCell,
                    toolbar: () => <ButtonGroup variant="text" size={'small'}>
                        <BasicMenu
                            options={[
                                {content: "Shares", Click},
                                {content: "Payment options", Click},
                                {content: "Payments", Click},
                                ...render_shares_requests,
                                {content: "+Request", Click}
                            ]}>{view}</BasicMenu>
                        <Button>Filter</Button>
                        {currentRequest && <ApproveButton
                            req={currentRequest}
                            contract={contracts[table_content.id]}/>}

                        {currentRequest && current_page != 'share' && < ApplyButton
                            setData={setData}
                            props={props}
                            req={currentRequest}
                            id={currentRequest && currentRequest.id}
                            contract={contracts[table_content.id]}/>}

                        {currentRequest && current_page == 'share' && <Button>Upload share request</Button>}
                        <PayButton contract={contracts[table_content.id]}/>
                    </ButtonGroup>
                }}

            />}


        </div>
    );
}
