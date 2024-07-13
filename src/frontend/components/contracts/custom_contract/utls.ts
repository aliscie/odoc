import {
    CCell,
    CColumn,
    CContract,
    CPayment,
    CRow,
    CustomContract,
    User
} from "../../../../declarations/backend/backend.did";
import {randomString} from "../../../data_processing/data_samples";
import {Principal} from "@dfinity/principal";

export function updateCContractColumn(contract, new_column): CContract {
    contract.columns = contract.columns.map((column: CColumn) => {
        if (column.id === new_column.id) {
            return {...column, ...new_column}
        }
        return column;
    });
    return contract;
}

export function updateContractColumn(contract: CustomContract, updated_column, view: any): CustomContract {

    return {
        ...contract,
        contracts: contract.contracts.map((c: CContract) => {
            if (c.id === view.id) {
                return updateCContractColumn(c, updated_column);
            }
            return c;
        })
    }
}

export function serialize_contract_column(contract, addVarsToParser, evaluate, all_users?): Array<CColumn> {
    return contract.columns.map((col: CColumn) => {
        if (col.formula_string && col.formula_string.length > 0) {
            col['width'] = 150;
            col['valueGetter'] = (params: any) => {
                addVarsToParser(params, contract);
                let ev = evaluate(col.formula_string)
                if (ev.err) {
                    return "Invalid formula"
                }
                return ev.value
            };
        } else {
            delete col['valueGetter'];
        }
        col['type'] = col.column_type;
        if (col.column_type == 'user') {
            col['type'] = 'singleSelect';
            col['valueOptions'] = all_users ? all_users.map(user => user.name) : [];
        }
        ;
        return col
    })
}


export function serialize_contract_rows(rows: Array<CRow>, columns: Array<CColumn>) {
    return rows.map((row: CRow) => {
        let cells: any = {}
        row.cells && row.cells.map((cell: CCell) => {
            let c = {}
            cells[cell.field] = cell.value || ""
            return c
        });
        if (row.cells.length < 1) {
            for (let i = 0; i < columns.length; i++) {
                cells[columns[i].field] = "";
            }
        }

        return {id: row.id, ...cells}
    })
}


export function deserialize_contract_rows(rows: Array<any>): Array<CRow> {
    return rows.map((row) => {
        let cells: Array<any> = [];
        Object.keys(row).map((k: string) => {
            if (k != "id" && k != 'cells') {
                cells.push({
                    value: String(row[k]) || '',
                    field: k
                })
            }
        });
        let de_row: CRow = {
            id: row['id'],
            cells
        }
        return de_row
    })
}

export const PROMISES_CONTRACT_FIELDS = ['amount', 'sender', 'status', 'receiver', 'id'];

export function serializeRowToPromise(row: any, all_users: any[], contract): CPayment {

    let cells: Array<CCell> = Object.keys(row)
        .filter(key => !PROMISES_CONTRACT_FIELDS.includes(key))
        .map(key => ({field: key, value: row[key] || ""}));
    let status: any = {};
    status[row.status] = null;
    let sender = all_users.find((user: any) => user.name === row.sender);
    let receiver = all_users.find((user: any) => user.name === row.receiver);

    let promes: CPayment = {
        'id': row.id,
        'status': status,
        'date_created': 0,
        'date_released': 0,
        cells,
        'contract_id': contract.id,
        'sender': Principal.fromText(sender.id),
        "amount": Number(row.amount),
        'receiver': receiver ? Principal.fromText(receiver.id) : Principal.fromText("2vxsx-fae"),
    }
    return promes


}


function ExtendColumnsRows(payments: Array<CPayment>, columns: Array<CColumn>, rows: Array<any>) {
    payments.forEach((p: CPayment) => {
        let extras = {};
        p.cells.forEach((c: CCell) => {
            extras[c.field] = c.value;
            if (!columns.find((col: any) => col.field === c.field)) {
                columns.push({
                    deletable: true,
                    id: c.field,
                    field: c.field,
                    headerName: c.field,
                    editable: true,
                    type: 'string',
                })
            }
        });
        rows = rows.map((r: any) => {
            if (r.id === p.id) {
                r = {...r, ...extras}
            }
            return r
        })

    });
    return {columns, rows}

}

export function serializePromisesData(payments: Array<CPayment>, all_users = []) {
    let valueOptions = all_users ? all_users.map(user => user && user.name) : [];
    let column = {
        id: randomString(),
        field: "amount",
        headerName: "Amount",
        editable: true,
        type: 'number',
        // 'column_type': {'Text': null},
        // 'filters': [],
        // 'permissions': [],
    }

    let column_2 = {
        id: randomString(),
        field: "sender",
        headerName: "Sender",
        editable: true,
        type: 'singleSelect',
        valueOptions: [valueOptions[0]],
    }
    // valueOptions.slice(1, valueOptions.length);
    let column_3 = {
        id: randomString(),
        field: "receiver",
        headerName: "Receiver",
        editable: true,
        type: 'singleSelect',
        valueOptions,
    }

    let column_4 = {
        id: randomString(),
        field: "status",
        headerName: "Status",
        type: 'singleSelect',
        valueOptions: [
            "Released",
            // "Confirmed",
            // "Objected",
            "Cancelled",
            "RequestCancellation",
            "HighPromise",
            // Objected(String),
            "None",
        ],
        editable: true,
    }


    let columns: Array<CColumn | any> = [column, column_2, column_3, column_4]; //
    let rows: undefined | Array<any> = payments && payments.map((p: CPayment) => {
        let sender: undefined | User = all_users.find((user: User) => p.sender.toString() === String(user.id))
        let receiver: undefined | User = all_users.find((user: User) => p.receiver.toString() === String(user.id))


        return {

            id: p.id,
            status: Object.keys(p.status)[0],
            amount: p.amount,
            sender: sender ? sender.name : "",
            receiver: receiver ? receiver.name : "",
        }
    })


    return ExtendColumnsRows(payments, columns, rows)
}


export function serializePaymentData(payments: Array<CPayment>, all_users?) {
    let valueOptions = all_users ? all_users.map(user => user.name) : [];
    let column = {
        id: randomString(),
        field: "amount",
        headerName: "Amount",
        type: 'number',
    }

    let column_2 = {
        id: randomString(),
        field: "sender",
        headerName: "Sender",
        type: 'singleSelect',
        valueOptions,
    }

    let column_3 = {
        id: randomString(),
        field: "receiver",
        headerName: "Receiver",
        type: 'singleSelect',
        valueOptions
    }


    let columns: any = [column, column_2, column_3];
    let rows = [];
    return ExtendColumnsRows(payments, columns, rows)
}

export function createCColumn(field: string): CColumn {
    return {
        id: randomString(),
        field,
        headerName: "Untitled",
        column_type: "string",
        filters: [],
        permissions: [{'AnyOneView': null}],
        formula_string: '',
        editable: true,
        deletable: false,
    }
}

export function createCContract(): CContract {
    let field = randomString();
    let new_cell: CCell = {
        field,
        value: "",
    }
    let new_row: CRow = {
        id: randomString(),
        cells: [new_cell]

    };

    let new_column: CColumn = createCColumn(field);
    let new_c_contract: CContract = {
        id: randomString(),
        name: "Untitled",
        'columns': [new_column],
        'rows': [new_row],
        date_created: 0,
        creator: Principal.fromText("2vxsx-fae"),
    }
    return new_c_contract
}

export function updateCustomContractRows(contract: CustomContract, new_rows: Array<CRow>, view_id: string): CustomContract {

    return {
        ...contract,
        contracts: contract.contracts.map((c: CContract) => {
            if (c.id === view_id) {
                return {...c, rows: new_rows}
            }
            return c;
        })
    }
}


export function updateCustomContractColumns(contract: CustomContract, new_columns, view: any): CustomContract {
    return {
        ...contract,
        contracts: contract.contracts.map((c: CContract) => {
            if (c.id === view.id) {
                return {...c, columns: new_columns}
            }
            return c;
        })
    }
}


export function createNewPromis(sender): CPayment {
    let status = {'None': null};
    let new_promise: CPayment = {
        contract_id: "",// the backend will handle this
        'id': randomString(),
        'date_created': 0,
        'date_released': 0,
        sender,
        status,
        'amount': 0,
        'receiver': Principal.fromText("2vxsx-fae"),
        cells: []
    }
    return new_promise
}