import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useSnackbar} from "notistack";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import {randomString} from "../../../data_processing/data_samples";
import {handleRedux} from "../../../redux/main";
import {
    CColumn,
    CContract,
    CPayment,
    CRow,
    CustomContract,
    StoredContract
} from "../../../../declarations/user_canister/user_canister.did";
import {
    createCContract,
    deserialize_contract_rows,
    deserialize_payment_data,
    serialize_contract_column,
    serialize_contract_rows,
    serializePaymentData,
    serializePromisesData,
    updateCustomContractColumns,
    updateCustomContractRows
} from "./utls";
import {CONTRACT, CREATE_CONTRACT, PAYMENTS, PROMISES} from "./types";
import BasicMenu from "../../genral/drop_down";
import CustomDataGrid from "../../datagrid";
import EditorComponent from "../../editor_components/main";
import useParser from "./formula_parser/use_parser";
import RenameColumn from "./column_menu/rename_column";
import ChangeColumnPermissions from "./column_menu/column_permision";
import ChangeColumnFormula from "./column_menu/column_formula";
import {actor} from "../../../App";

interface VIEW {
    id?: string,
    name: string,
    type: CONTRACT | CREATE_CONTRACT | PAYMENTS | PROMISES,
}

export function CustomContractComponent({contract}: { contract: CustomContract }) {
    const {profile, all_friends, wallet} = useSelector((state: any) => state.filesReducer);
    const {enqueueSnackbar} = useSnackbar();
    const [view, setView] = useState<VIEW>({id: "", name: PROMISES, type: PROMISES});
    let current_contract = contract.contracts.find((c: CContract) => c.id === view.id);
    const {evaluate, addVarsToParser} = useParser({contract: current_contract, main_contract: contract});
    const dispatch = useDispatch();

    const columnMenuProps = (menuProps: any) => {
        return {
            RenameColumn: {
                displayOrder: 1,
                columnName: menuProps.colDef.headerName,
            },
            ChangeColumnPermissions: {
                displayOrder: 2,
                menuProps,
            },
            ChangeColumnFormula: {
                displayOrder: 3,
                menuProps,
                view,
                contract,
            }
        };
    };


    let columnMenuSlots = {}
    if (view?.type == CONTRACT) {
        let current_contract = contract.contracts.find((c: CContract) => c.id === view.id);
        columnMenuSlots["RenameColumn"] = (props) => RenameColumn({...props, contract, updateContract, view});
        columnMenuSlots["ChangeColumnPermissions"] = (props) => ChangeColumnPermissions({
            ...props,
            contract,
            updateContract,
            current_contract
        });
        columnMenuSlots["ChangeColumnFormula"] = (props) => ChangeColumnFormula({
            ...props,
            updateContract,
            current_contract,
            contract
        });
    }

    function deleteColumn(columns: any, columnId: string) {
        const updatedContract = updateCustomContractColumns(contract, columns, view.id);
        updateContract(updatedContract);
        return columns;
    }


    function addColumn(position: number) {
        const newColumn: CColumn = {
            id: randomString(),
            field: randomString(),
            headerName: "Untitled",
            column_type: {Text: null},
            filters: [],
            permissions: [{AnyOneView: null}],
            formula_string: '',
            editable: true,
            deletable: true,
        };
        let current_contract = contract.contracts.find((c: CContract) => c.id === view.id);
        const newColumns = [...(current_contract?.columns ?? [])];
        newColumns.splice(position, 0, newColumn);
        const updatedContract = updateCustomContractColumns(contract, newColumns, view.id);
        updateContract(updatedContract);
        return newColumn;
    }

    function addRow(position: number) {
        switch (view?.type) {
            case PAYMENTS:
                break
            case PROMISES:
                const new_payment: CPayment = {
                    'date_created': 0,
                    'date_released': 0,
                    contract_id: contract.id,
                    id: randomString(),
                    amount: 0,
                    sender: profile.name,
                    receiver: profile.name,
                    status: {'None': null},
                    released: false,
                    objected: false,
                    confirmed: false,
                };
                const updated_promises = [...contract.promises, new_payment];
                updateContract({...contract, promises: updated_promises});
                return {
                    id: new_payment.id,
                    sender: "",
                    receiver: "",
                    amount: 0,
                    status: "",
                };
                break
            case CONTRACT:
                let current_contract = contract.contracts.find((c: CContract) => c.id === view.id);
                const newRow: CRow = {
                    id: randomString(),
                    cells: [],
                };
                const newRows = [...current_contract?.rows ?? []];
                newRows.splice(position, 0, newRow);
                const updatedContract = updateCustomContractRows(contract, newRows, view.id);
                updateContract(updatedContract);
                return newRow;
            default:
                break

        }

    }

    function deleteRow(rows: any, rowId: number) {
        switch (view?.type) {
            case PAYMENTS:
                break;
            case PROMISES:
                // TODO check promises.status and make good frontend message to user
                const updated_promises: Array<CPayment> = contract.promises.filter((p: CPayment) => p.id !== rowId);
                updateContract({...contract, promises: updated_promises});
                break;
            case CONTRACT:
                const updatedContract = updateCustomContractRows(contract, rows, view.id);
                updateContract(updatedContract);
                break;
        }

    }

    function updateRow(newRows: any, newRow: any) {
        switch (view?.type) {
            case PAYMENTS:
                break
            case PROMISES:

                if (newRow.status == "Released" && newRow.sender != profile.name) {
                    enqueueSnackbar("You can't release other's payments", {variant: "error"})
                }

                if (newRow.status == "Objected" && newRow.receiver != profile.name) {
                    enqueueSnackbar("You can't Objected on a payment not for you", {variant: "error"})
                }


                //TODO if (newRow.status == "Cancel" && oldRow.status == "Confirmed") {
                //     enqueueSnackbar("You can't cancel a confined payment", {variant: "error"})
                // }


                if (newRow.status == "Cancel" && newRow.sender != profile.name) {
                    enqueueSnackbar("You can't cancel a payment not from you", {variant: "error"})
                }


                if (newRow.status == "Confirmed" && newRow.receiver != profile.name) {
                    enqueueSnackbar("You can't Confirmed a payment not for you", {variant: "error"})
                } else if (newRow.status == "Confirmed" && newRow.receiver == profile.name) {
                    enqueueSnackbar("Confirm a payment will ensure protect it from acclimation by the sender", {variant: "info"})
                }

                if (newRow.amount > wallet.balance) {
                    enqueueSnackbar("You don't have enough balance to make this promise", {variant: "error"})
                }

                if (newRow.sender !== profile.name) {
                    enqueueSnackbar("You can only make promises for yourself", {variant: "error"})
                }

                if (newRow.sender == newRow.receiver) {
                    enqueueSnackbar("You can't make promises to yourself", {variant: "error"})
                }


                if (newRow.released) {
                    enqueueSnackbar(`As you hit save button you will send ${newRow.amount}USDT to ${newRow.receiver}`, {variant: "info"})
                }
                let updated_promises: Array<CPayment> = deserialize_payment_data(newRows, [profile, ...all_friends]);
                updateContract({...contract, promises: updated_promises})
                break
            case CONTRACT:

                let updated_contract = contract.contracts.find((c: CContract) => c.id === view.id);
                let rows = deserialize_contract_rows(newRows);
                const updatedContract = updateCustomContractRows(contract, rows, updated_contract.id);
                updateContract(updatedContract);
                break;


            default:
                break
        }

    }

    function updateContract(updatedContract: CustomContract) {
        if (updatedContract !== contract) {
            const storedContract: StoredContract = {CustomContract: updatedContract};
            dispatch(handleRedux("UPDATE_CONTRACT", {contract: storedContract}));
            dispatch(handleRedux("CONTRACT_CHANGES", {changes: storedContract}));
        }
    }

    const mainSelectOption = async (option: any) => {
        switch (option.content) {
            case "Delete":
                const updatedContracts = contract.contracts.filter((c: CContract) => c.id !== view.id);
                updateContract({...contract, contracts: [...updatedContracts]});
                setView({
                    type: PROMISES,
                });
                break;
            case "Rename":
                const updatedContract = contract.contracts.map((c: CContract) => {
                    if (c.id === view.id) {
                        c.name = "new_name";
                    }
                    return c;
                });
                updateContract({...contract, contracts: [...updatedContract]});
                break;
            default:
                break;
        }
    };
    let all_users = [profile, ...all_friends];
    const selectOption = async (option: any) => {

        switch (option.type) {

            case PROMISES:
                let serialize_PromisesData = serializePaymentData(contract.promises, all_users)

                setView({
                    type: PROMISES,
                    ...serialize_PromisesData,
                })
                break

            case PAYMENTS:
                // if (contract.payments.length > 0) {
                // let serialize_PaymentData = serialize_payment_data(contract.payments, all_users)

                setView({
                    type: PAYMENTS,
                    // ...serialize_PaymentData,
                })

                // } else {
                // }
                break
            case CREATE_CONTRACT:
                let new_c_contract = createCContract();
                let contracts = [...contract.contracts, new_c_contract];
                updateContract({...contract, contracts: [...contracts]});
                setView({id: new_c_contract.id, type: CONTRACT, name: new_c_contract.name});
                break
            case CONTRACT:
                setView({
                    id: option.id,
                    type: CONTRACT,
                    name: option.name,
                })
                break

            default:
                break
        }
    };

    let otherContracts: any[] = [];
    if (contract && contract.contracts) {
        otherContracts = contract.contracts.map((contract: CContract, index: number) => {
            return {content: contract.name, type: "contract", ...contract};
        });
    }

    const options: any[] = [
        {content: "Promises", type: PROMISES},
        {content: "Payments", type: PAYMENTS},
        ...otherContracts,
        {content: <div><AddIcon color={"info"}/>Create contract</div>, type: CREATE_CONTRACT},
    ];

    const mainOptions: any[] = [
        {content: "Rename"},
        {content: "Delete"},
    ];
    // data if view.type == CONTRACT serizlie from contract using contract serizlie and if view.type == PROMISES and if view.type == PAYMENTS
    let data = {};
    switch (view?.type) {
        case CONTRACT:
            let current_contract: CContract | undefined = contract.contracts.find((c: CContract) => c.id === view.id);
            if (!current_contract) {
                data = view;
                break
            }
            let serialized_columns: Array<CColumn> = serialize_contract_column(current_contract, addVarsToParser, evaluate)
            let serialized_rows = serialize_contract_rows(current_contract.rows, current_contract.columns)
            data = {columns: serialized_columns, rows: serialized_rows, name: view.name};
            break;
        // case PROMISES:
        //     const serializedPromisesData = serializePromisesData(contract.promises, [profile, ...all_friends]);
        //     data = {
        //         type: PROMISES,
        //         name: "Promises",
        //         ...serializedPromisesData,
        //     };
        //     break;
        case PAYMENTS:
            const serializedPaymentData = serializePaymentData(contract.payments, [profile, ...all_friends]);
            data = {
                type: PAYMENTS,
                name: PAYMENTS,
                ...serializedPaymentData,
            };
            break
        default:
            const serializedPromiseData = serializePromisesData(contract.promises, [profile, ...all_friends]);
            data = {
                type: PROMISES,
                name: PROMISES,
                ...serializedPromiseData,
            };
            break
    }
    ;

    return (
        <CustomDataGrid
            columnMenuSlots={columnMenuSlots}
            columnMenuProps={columnMenuProps}
            deleteColumn={deleteColumn}
            data={data}
            addRow={addRow}
            deleteRow={deleteRow}
            addColumn={addColumn}
            updateRow={updateRow}
            tools={
                <>
                    {view.name && (
                        <EditorComponent
                            preventSplit={true}
                            preventToolbar={true}
                            onChange={(value: any) => {
                                // console.log(value);
                            }}
                            placeholder={"Untitled"}
                            content={[
                                {
                                    type: "h2",
                                    children: [{text: view.name}],
                                },
                            ]}
                        />
                    )}
                    <BasicMenu SelectOption={mainSelectOption} options={mainOptions}>
                        <MoreVertIcon/>
                    </BasicMenu>
                    <BasicMenu SelectOption={selectOption} options={options}>
                        {view && (view.name || view.type)}
                    </BasicMenu>
                </>
            }
        />
    );
}

export default function SlateCustomContract(props: any) {
    const {contracts, current_file} = useSelector((state: any) => state.filesReducer);
    // const contract: CustomContract = contracts[props.id];
    const dispatch = useDispatch();
    const [contract, setContract] = useState<CustomContract>(contracts[props.id]);
    useEffect(() => {


        (async () => {
            // if (window.location.pathname.split("/").pop() === "share") {
            if (!contract) {
                let contract: undefined | { Ok: StoredContract } | { Err: string } = actor && current_file && await actor.get_contract(current_file.author, props.id);
                if (contract && "Ok" in contract) {
                    setContract(contract.Ok.CustomContract);
                    dispatch(handleRedux("UPDATE_CONTRACT", {contract: contract.Ok}));
                }
            }
        })()
    }, [])

    return (contract && <CustomContractComponent contract={contract}/>);
}

