import {
    CCell,
    CColumn,
    CContract,
    CPayment,
    CRow,
    CustomContract,
    StoredContract
} from "../../../../declarations/user_canister/user_canister.did";
import BasicMenu from "../../genral/drop_down";
import CustomDataGrid from "../../datagrid";
import * as React from "react";
import {useEffect} from "react";
import {randomString} from "../../../data_processing/data_samples";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditorComponent from "../../editor_components/main";
import AddIcon from '@mui/icons-material/Add';
import {useDispatch, useSelector} from "react-redux";
import {handleRedux} from "../../../redux/main";
import {updateContractColumn, updateCustomContractColumns, updateCustomContractRows} from "./utls";
import {GridColumnMenuProps} from "@mui/x-data-grid";
import ChangeColumnPermissions from "./column_permision";
import ChangeColumnFormula from "./column_formula";
import useParser from "./formula_parser/parser";


function CustomContract(props: CustomContract) {


    let dispatch = useDispatch();
    const [contract, setContract] = React.useState(props);
    const [view, setView] = React.useState<CContract | CPayment | undefined | any>()
    const [data, setData] = React.useState({columns: [], rows: []})


    useEffect(() => {
        if (props !== contract) {
            let store_contract: StoredContract = {'CustomContract': contract}
            dispatch(handleRedux("UPDATE_CONTRACT", {contract: store_contract}))
            dispatch(handleRedux("CONTRACT_CHANGES", {changes: store_contract}));
        }
    }, [contract])


    let columnMenuSlots = {
        ChangeColumnPermissions: (props) => ChangeColumnPermissions({...props, setContract, view}),
        ChangeColumnFormula: (props) => ChangeColumnFormula({...props, setContract, view, contract}),
    }
    let columnMenuProps = (menuProps: GridColumnMenuProps) => {
        return {
            ChangeColumnPermissions: {
                displayOrder: 2,
                // onClick: () => ConvolverNode,
                menuProps,
            },
            ChangeColumnFormula: {
                displayOrder: 3,
                // onClick: () => ConvolverNode,
                menuProps,
                view,
                contract,
            }
        }
    }

    function deleteColumn(columns, column_id) {
        const updatedContract = updateCustomContractColumns(contract, columns, view);
        setContract(updatedContract);
    }

    function addColumn(position: number): CColumn {
        let new_column: CColumn = {
            id: randomString(),
            field: randomString(),
            headerName: "Untitled",
            'column_type': {'Text': null},
            'filters': [],
            'permissions': [{'AnyOneView': null}],
            formula_string: '',
            'editable': true,
            deletable: true,
        };

        // Update the state with the new column
        let new_columns = [...view.columns]
        new_columns.splice(position, 0, new_column)
        setContract((prevContract) => updateCustomContractColumns(prevContract, new_columns, view));


        return new_column;
    }


    function addRow(position: number): CRow {
        const new_row: CRow = {
            id: randomString(),
            cells: [],
        };

        let new_rows = [...view.rows]
        new_rows.splice(position, 0, new_row)
        // Update the state with the new rows
        setContract((prevContract) => updateCustomContractRows(prevContract, new_rows, view));


        return new_row;
    }


    function deleteRow(rows: any, rowId: number) {
        const updatedContract = updateCustomContractRows(contract, rows, view);
        setContract(updatedContract);
    }

    function updateRow(new_rows: any, newRow: any) {
        let updated_rows = view.rows.map((row: CRow) => {
            if (row.id === newRow.id) {
                let non_key = ["id", "cells"]
                let new_cells = Object.keys(newRow).filter(k => !non_key.includes(k)).map((key: string) => {
                    let value = newRow[key]
                    let c: CCell = {
                        'id': randomString(),
                        'field': key,
                        value: String(value)
                    }
                    return c
                })
                row.cells = new_cells
            }

            return row
        });

        const updatedContract = updateCustomContractRows(contract, updated_rows, view);
        setContract(updatedContract);
    }

    function renameColumn(id: string, value: string) {
        let updated_column = {
            id,
            headerName: value
        }
        setContract((prevContract) => (updateContractColumn(prevContract, updated_column, view)));
    }

    useEffect(() => {
        if (view && view.columns && view.columns.length == 0) {
            let new_column: CColumn = {
                id: randomString(),
                field: randomString(),
                headerName: "Untitled",
                'column_type': {'Text': null},
                'filters': [],
                'permissions': [{'AnyOneView': null}],
                formula_string: '',
                'editable': true,
                deletable: false,
            }
            setContract(updateCustomContractColumns(contract, new_column, view))
        }
    }, [view])


    useEffect(() => {
        if (contract.contracts && contract.contracts.length === 0) {

            let field = randomString();
            let new_cell: CCell = {
                id: randomString(),
                field,
                value: "",
            }
            let new_row: CRow = {
                id: randomString(),
                cells: [new_cell]

            }


            let new_column: CColumn = {
                id: randomString(),
                field,
                headerName: "Untitled",
                'column_type': {'Text': null},
                'filters': [],
                'permissions': [{'AnyOneView': null}],
                formula_string: '',
                'editable': true,
                deletable: false,
            }
            let new_c_contract: CContract = {
                id: randomString(),
                name: "Untitled c contract",
                'columns': [new_column],
                'rows': [new_row],
            }
            setContract({...contract, contracts: [new_c_contract]});
            setView(new_c_contract);
            setData(new_c_contract)
        } else {
            contract.contracts && setView(contract.contracts[0])
            contract.contracts && setData(contract.contracts[0])
        }

    }, [props])


    let SelectOption = async (option: string) => {
        switch (option.type) {
            case "payments":
                if (contract.payments.length === 0) {
                    let column = {
                        id: randomString(),
                        field: "amount",
                        headerName: "Amount",
                    }

                    let column_2 = {
                        id: randomString(),
                        field: "sender",
                        headerName: "Sender",
                    }

                    let column_3 = {
                        id: randomString(),
                        field: "receiver",
                        headerName: "Receiver",
                    }

                    let column_4 = {
                        id: randomString(),
                        field: "release",
                        headerName: "Release",
                    }


                    let row = {
                        id: randomString(),
                        cells: []
                    }
                    let columns = [column, column_2, column_3, column_4]
                    let rows = [row]

                    setView({
                        name: option.content,
                        columns,
                        rows
                    })

                    setData({
                        columns,
                        rows,
                    })

                } else {
                    // setView({
                    //     name: option.content,
                    //     // columns: contract.payments[0].columns,
                    //     // rows: contract.payments[0].rows
                    // })
                    // setData({
                    //     columns: contract.payments[0].columns,
                    //     rows: contract.payments[0].rows
                    // })
                }
                break
            case "create contract":
                break
            case "contract":
                setView({
                    name: option.content,
                    ...option
                })
                setData({
                    columns: option.columns,
                    rows: option.rows
                })
                break
            default:
                break
        }

    }


    let options: any = [
        {content: "Payments", type: "payments",},


        {content: <div><AddIcon color={"info"}/>Create contract</div>, type: "create_contract",},
        // {content: "Create view", type: "create view",},
        // {content: "Create view", type: "create chart",},
    ];
    if (contract.contracts) {
        let extra_options = contract.contracts.map((contract: CContract, index: number) => {
            return {content: contract.name, type: "contract", ...contract}
        });
        options = [...options, ...extra_options]
    }

    let main_options = [
        {content: "Rename"},
        {content: "Delete"},
        // {content: "Delete"},
    ];


    const {parser, addVarsToParser} = useParser({...props});

    return <CustomDataGrid
        columnMenuSlots={columnMenuSlots}
        columnMenuProps={columnMenuProps}
        deleteColumn={deleteColumn}
        data={{
            columns: data.columns.map((col: CColumn) => {
                if (col.formula_string.length > 0) {
                    col['valueGetter'] = (params: any) => {
                        addVarsToParser(parser, params, view);
                        return parser.parse(col.formula_string).result
                    };
                }
                return col
            }),
            rows: data.rows.map((row: CRow) => {
                let cells = {}
                row.cells.map((cell: CCell) => {
                    let c = {}
                    cells[cell.field] = cell.value
                    return c
                });
                let r = {id: row.id, ...cells};
                return r
            })
        }}
        addRow={addRow}
        deleteRow={deleteRow}
        addColumn={addColumn}
        updateRow={updateRow}
        renameColumn={renameColumn}
        tools={<>

            <EditorComponent
                preventSplit={true}
                preventToolbar={true}
                // onChange={handleTitleKeyDown}
                // contentEditable={editable}
                // editorKey={current_file.id}
                placeholder={"Untitled"}
                content={[{
                    "type": "h2",
                    "children": [{"text": view && view.name}]
                }
                ]}
            />


            <BasicMenu options={main_options}>
                <MoreVertIcon/>
            </BasicMenu>


            <BasicMenu SelectOption={SelectOption} options={options}>
                {view && view.name}
            </BasicMenu>
        </>}


    />
}

export default function SlateCustomContract(props: any) {

    const {contracts, profile, wallet} = useSelector((state: any) => state.filesReducer);
    let contract: CustomContract = contracts[props.id];
    return <CustomContract {...contract}/>
}


export {CustomContract};