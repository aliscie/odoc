import * as React from 'react';
import {useEffect, useState} from 'react';
import {GridRenderCellParams} from '@mui/x-data-grid';
import {Button} from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import {handleRedux} from "../../redux/main";
import {
    Column,
    Row,
    Share,
    SharePaymentOption,
    ShareRequest,
    SharesContract,
    StoredContract
} from "../../../declarations/backend/backend.did";
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
import CustomDataGrid from "../datagrid";

// export type SharesContractViews = "Payments" | "Shares" | "SharesRequests" | "PaymentOptions";

export default function SharesContractComponent(props: any) {

    let [view, setView] = useState("Shares");
    let {getUser} = useGetUser();
    const dispatch = useDispatch();

    const {
        current_file,
        all_friends,
        profile,
        contracts
    } = useSelector((state: any) => state.filesReducer);
    const redux = useSelector((state: any) => state.filesReducer);

    // ToDo  `props.data[0]` instead of `props.children[0].data[0]`
    let table_content = props.children[0]
    // let initial_rows = table_content.data[0].Table.rows

    let initial_columns = table_content.data[0].Table.columns;


    // ------------------------ Handle Columns and SetData ------------------------ \\
    let custom_columns = initial_columns.map((column: any) => {
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
        columns: []
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
                    let [cols, normalized_rows] = await normalize_share_rows(fetched_contracts);
                    setData((pre: any) => {
                        return {...pre, rows: normalized_rows}
                    })
                    dispatch(handleRedux("UPDATE_CONTRACT", {contract: contract.Ok}));

                    //TODO console.log("Why this runs 3 times?");

                }

            } else {
                let [columns, rows] = await normalize_share_rows(contracts)
                setData({columns, rows})
            }
        })()
    }, [current_file])


    //  ---------- TODO Why this component renders 10 times -------- \\
    //// ----------------------- TODO ----------------------- \\\\
    //                            Hande add row correct for share
    //                            Sometimes it has two shares on contract, but one row on content,
    //                            which should not happen

    async function normalize_share_rows(CONTRACTS): Promise<[Array<Column>, Array<Row>]> {

        let columns = custom_columns;
        const normalizedRows = await Promise.all(
            CONTRACTS[table_content.id].shares.map(async (share) => {
                let receiver = share && await getUser(share.receiver.toString());
                let extra_cells = {}


                share.extra_cells.forEach((cell) => {
                    extra_cells[cell[0]] = cell[1]
                    !columns.find((column) => column.field === cell[0]) && columns.push({
                        "id": randomString(),
                        "_type": {"Text": null},
                        "field": cell[0],
                        "editable": true,
                        "headerName": cell[0],
                        "filters": [],
                        "permissions": [],
                        "dataValidator": [],
                        "formula": [],
                        "deletable": true

                    })
                })
                return {
                    "accumulation": share && share.accumulation,
                    "share%": share && share.share,
                    "receiver": receiver ? receiver.name : "",
                    "id": share.share_contract_id,
                    "contract": [{"SharesContract": share.share_contract_id}],
                    ...extra_cells,
                };
            })
        );

        return [columns, normalizedRows];
    }


    // const {dialog, handleClickOpen} = useFormulaDialog(handleColumnValidator);


    let {setRequest, currentRequest, addRequestRow, handleClickReq, UpdatedContractFromRow} = useSharesRequests({
        table_content,
        props,
        setView,
        data,
        setData
    });

    function deleteColumn(new_columns: Array<Column>, column_id: string) {

        switch (view) {
            case "Shares":
                // let updated_share_id = newRow.contract && newRow.contract[0] && newRow.contract[0]["SharesContract"];
                // let receiver_name: string = newRow["receiver"];
                // let receiver: User | null = getUserByName(receiver_name);
                //
                // let eliminate = ["accumulation", "share%", "receiver", "id", "contract"];
                // let extra_cells: Array<[string, string]> = Object.keys(newRow).filter((key) => !eliminate.includes(key)).map((key) => {
                //     return [key, newRow[key]]
                // })

                // let updated_contract: SharesContract = {
                //     ...contracts[table_content.id],
                //     shares: contracts[table_content.id].shares.map((item: Share) => {
                //         return {
                //             ...item,
                //             extra_cells: item.extra_cells.filter((cell) => cell[0] === column.field),
                //         };
                //     }),
                // };
                // dispatch(handleRedux("UPDATE_CONTRACT", {contract: updated_contract}));
                // dispatch(handleRedux("CONTRACT_CHANGES", {changes: updated_contract}));

                break
            default:
                break
            // case "Payment options":
            //     let payment_options: Array<SharePaymentOption> = contracts[table_content.id].payment_options;
            //     if (Object.keys(newRow).toString() === ["id", "title", "amount", "description"].toString()) {
            //         payment_options = payment_options.map((item: SharePaymentOption) => {
            //             if (item.id === newRow.id) {
            //                 let new_item: SharePaymentOption = {
            //                     'id': newRow.id,
            //                     'title': newRow.title,
            //                     'date': "", // TODO handle and string data if needed later.
            //                     'description': newRow.description,
            //                     'amount': BigInt(newRow.amount),
            //                 };
            //                 return new_item;
            //             }
            //             return item
            //         })
            //     }
            //     let options_updated_contract: SharesContract = {
            //         ...contracts[table_content.id],
            //         payment_options
            //     }
            //     dispatch(handleRedux("UPDATE_CONTRACT", {contract: options_updated_contract}));
            //     dispatch(handleRedux("CONTRACT_CHANGES", {changes: options_updated_contract}));
            //
            //     break
            // default:
            //     // request
            //
            //     let shares_requests: Array<[string, ShareRequest]> = contracts[table_content.id].shares_requests;
            //     shares_requests = contracts[table_content.id].shares_requests.map((share_req: [string, ShareRequest]) => {
            //         if (share_req[1].id == currentRequest.id) {
            //             return [
            //                 share_req[0],
            //                 {
            //                     ...share_req[1],
            //                     shares: UpdatedContractFromRow(new_rows, share_req[1].shares)
            //                 }
            //             ]
            //         } else {
            //             return share_req;
            //         }
            //
            //     });
            //
            //     // }
            //
            //
            //     let req_updated_contract: SharesContract = {
            //         ...contracts[table_content.id],
            //         shares_requests
            //     }
            //
            //     dispatch(handleRedux("UPDATE_CONTRACT", {contract: req_updated_contract}));
            //     dispatch(handleRedux("CONTRACT_CHANGES", {changes: req_updated_contract}));
        }

    }

    const updateRow = (new_rows: any, newRow: any) => {
        switch (view) {
            case "Shares":
                let updated_contract: SharesContract = {
                    ...contracts[table_content.id],
                    shares: UpdatedContractFromRow(new_rows, contracts[table_content.id].shares),
                };
                let stored_shares_contract: StoredContract = {'SharesContract': updated_contract}
                dispatch(handleRedux("UPDATE_CONTRACT", {contract: stored_shares_contract}));
                dispatch(handleRedux("CONTRACT_CHANGES", {changes: stored_shares_contract}));

                break
            case "Payment options":
                let payment_options: Array<SharePaymentOption> = contracts[table_content.id].payment_options;
                if (Object.keys(newRow).toString() === ["id", "title", "amount", "description"].toString()) {
                    payment_options = payment_options.map((item: SharePaymentOption) => {
                        if (item.id === newRow.id) {
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
                let options_updated_contract: SharesContract = {
                    ...contracts[table_content.id],
                    payment_options
                }
                let to_store_shares: StoredContract = {"SharesContract": options_updated_contract}
                dispatch(handleRedux("UPDATE_CONTRACT", {contract: to_store_shares}));
                dispatch(handleRedux("CONTRACT_CHANGES", {changes: to_store_shares}));

                break
            default:
                // request

                let shares_requests: Array<[string, ShareRequest]> = contracts[table_content.id].shares_requests;
                shares_requests = contracts[table_content.id].shares_requests.map((share_req: [string, ShareRequest]) => {
                    if (share_req[1].id == currentRequest.id) {
                        return [
                            share_req[0],
                            {
                                ...share_req[1],
                                shares: UpdatedContractFromRow(new_rows, share_req[1].shares)
                            }
                        ]
                    } else {
                        return share_req;
                    }

                });

                // }


                let req_updated_contract: SharesContract = {
                    ...contracts[table_content.id],
                    shares_requests
                }
                let re_to_store_shares = {"SharesContract": req_updated_contract}
                dispatch(handleRedux("UPDATE_CONTRACT", {contract: re_to_store_shares}));
                dispatch(handleRedux("CONTRACT_CHANGES", {changes: re_to_store_shares}));
        }
    }


    const deleteRow = (rows: any, rowId: number) => {
        let delete_updated_contract: SharesContract = {...contracts[table_content.id]}

        switch (view) {
            case "Payment options":
                let payment_options: Array<SharePaymentOption> = delete_updated_contract.payment_options.filter((item: SharePaymentOption) => item.id !== rowId);
                delete_updated_contract = {
                    ...delete_updated_contract,
                    payment_options,
                };
                break;
            case "Shares":

                delete_updated_contract = {
                    ...delete_updated_contract,
                    shares: UpdatedContractFromRow(rows, delete_updated_contract.shares),
                };
                break
            case "Shares requests":
                let shares_requests: Array<[string, ShareRequest]> = delete_updated_contract.shares_requests.map((item: [string, ShareRequest]) => {
                    if (item[1].id === currentRequest.id) {
                        item[1].shares = item[1].shares.filter((share: Share) => share.share_contract_id !== rowId)
                    }
                    return item
                });
                delete_updated_contract = {
                    ...delete_updated_contract,
                    shares_requests,
                };
                break;
            default:
                break;
        }
        let to_store: StoredContract = {"SharesContract": delete_updated_contract}
        dispatch(handleRedux("UPDATE_CONTRACT", {contract: to_store}));
        dispatch(handleRedux("CONTRACT_CHANGES", {changes: to_store}));

    };
    const addRow = (position) => {
        let new_id = randomString();
        switch (view) {
            case "Payment options":
                let new_payment_option: SharePaymentOption = {
                    id: new_id,
                    title: "",
                    amount: 0n,
                    description: "",
                    date: "",
                };
                let payment_options_updated_contract = {
                    ...contracts[table_content.id],
                }
                updated_contract.payment_options.splice(position, 0, new_payment_option);
                let stored_payment: StoredContract = {"PaymentContract": payment_options_updated_contract}
                dispatch(handleRedux("CONTRACT_CHANGES", {changes: stored_payment}));

                return new_payment_option;
            case "Shares":
                let new_shares_row = {
                    id: new_id,
                    contract: [{"SharesContract": new_id}],
                };
                let new_table_rows = [...data.rows]
                new_table_rows.splice(position, 0, new_shares_row);

                let shares_update_contract: SharesContract = {
                    ...contracts[table_content.id],
                    shares: UpdatedContractFromRow(new_table_rows, contracts[table_content.id].shares),
                };
                let to_store: StoredContract = {"SharesContract": shares_update_contract}
                dispatch(handleRedux("CONTRACT_CHANGES", {changes: to_store}));
                dispatch(handleRedux("UPDATE_CONTRACT", {contract: to_store}));
                return new_shares_row;
            default:
                let new_share_request = {id: new_id, receiver: profile.name, share: 0n};
                let new_rows = [...data.rows];
                new_rows.splice(position, 0, new_share_request);

                let shares_requests: Array<[string, ShareRequest]> = contracts[table_content.id].shares_requests.map((share_request: [string, ShareRequest]) => {
                    if (share_request[0] === currentRequest.id) {
                        return [share_request[1].id, {
                            ...share_request[1],
                            shares: UpdatedContractFromRow(new_rows, share_request[1].shares)
                        }]
                    }
                    return share_request;
                });

                let req_updated_contract = {
                    ...contracts[table_content.id],
                    shares_requests,
                };
                let re_to_store = {"SharesContract": req_updated_contract}
                dispatch(handleRedux("CONTRACT_CHANGES", {changes: re_to_store}));
                return new_share_request
            // default:
            //     return {};
        }


    }

    let Click = async (e: string) => {
        switch (e) {
            case 'Shares':
                let [col, nor_rows] = await normalize_share_rows(contracts);
                setData({
                    rows: nor_rows,
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
                    extra_cells: []
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
                let updated_stored_contract: StoredContract = {"SharesContract": updated_contract}
                dispatch(handleRedux("UPDATE_CONTRACT", {contract: updated_stored_contract}));
                dispatch(handleRedux("CONTRACT_CHANGES", {changes: updated_stored_contract}));
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
                break;
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
            {/*{dialog}*/}
            <CustomDataGrid
                deleteColumn={deleteColumn}
                data={data}
                addRow={addRow}
                deleteRow={deleteRow}
                // addColumn={addColumn}
                updateRow={updateRow}
                tools={<>
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
                </>}
            />

        </div>
    );
}
