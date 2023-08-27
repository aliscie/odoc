import {Principal} from "@dfinity/principal";
import {Column, Payment} from "../../declarations/user_canister/user_canister.did";

let contract_id = randomString();
export let note_page_content = [{"id": 4, "children": [{"id": 5, "text": "", "type": "h1"}]}]
export let file_data = {"id": "0000", "content": "0", "name": "NameTest", "children": {}, "parent": []}
let column: Column = {
    _type: {Text: null},
    field: "receiver",
    filters: [],
    permissions: [],
    dataValidator: [],
    editable: true,
    formula: [],
    id: randomString(),
}
export let data_grid = {

    "id": randomString(),
    "children": [{
        "id": "002", "text": "", "data": [{
            "Table": {
                "rows": [
                    {
                        id: randomString(),
                        contract: [],
                        cells: [[["name", ""], ["last_name", "x"], ["full_name", "xxxa"]]],
                        requests: [],
                    }
                ],
                "columns": [
                    {...column, id: randomString(), field: "name"},
                    {
                        ...column,
                        id: randomString(),
                        field: "last_name",
                    },
                    {...column, id: randomString(), field: "full_name",}
                ]
            }
        }]
    }],
    "type": "data_grid"
}


export let accumulative_contract = {

    "id": randomString(),
    "children": [{
        "id": "002", "text": "", "data": [{
            "Table": {
                "rows": [
                    {
                        id: randomString(),
                        contract: [],
                        cells: [[["receiver", "any"], ["share%", "10"]]],
                        requests: [],
                    }
                ],
                "columns": [
                    {...column, id: randomString(), field: "receiver"},
                    {
                        ...column,
                        id: randomString(),
                        field: "share%",
                    },
                ]
            }
        }]
    }],
    "type": "accumulative_contract"
}

export let payment_contract = {
    "id": contract_id,
    "children": [{
        "id": "002", "text": "", "data": [{
            "Table": {
                "rows": [
                    {
                        id: contract_id,
                        contract: [{"PaymentContract": contract_id}],
                        cells: [],
                        requests: [],
                    }
                ],
                "columns": [
                    {...column},
                    {...column, id: randomString(), field: "amount"},
                    {
                        ...column,
                        id: randomString(),
                        field: "released",
                    },
                    {...column, id: randomString(), field: "confirmed",}
                ]
            }
        }]
    }],
    "type": "payment_contract"
}
export let file_content_sample = [
    {type: "p", children: [{text: ""}]},
]
export let payment_contract_row = {"Contract": {"PaymentContract": "0"}}
export let payment_contract_row2 = {"Contract": {"PaymentContract": "1"}}

export let contracts_sample = {
    "4": {
        "contract_id": "4",
        "sender": {
            "id": "l5gd7-bl4bd-jodqy-yqblz-eawxr-w4fdt-eqxhj-luwyp-nav4q-fs66j-xae",
            "name": "d",
            "description": "d",
            "photo": {}
        },
        "released": false,
        "confirmed": false,
        "amount": "200",
        "receiver": {
            "id": "l5gd7-bl4bd-jodqy-yqblz-eawxr-w4fdt-eqxhj-luwyp-nav4q-fs66j-xae",
            "name": "d",
            "description": "d",
            "photo": {}
        }
    },
    "18": {
        "contract_id": "18",
        "sender": {
            "id": "l5gd7-bl4bd-jodqy-yqblz-eawxr-w4fdt-eqxhj-luwyp-nav4q-fs66j-xae",
            "name": "d",
            "description": "d",
            "photo": {}
        },
        "released": false,
        "confirmed": false,
        "amount": "150",
        "receiver": {
            "id": "l5gd7-bl4bd-jodqy-yqblz-eawxr-w4fdt-eqxhj-luwyp-nav4q-fs66j-xae",
            "name": "d",
            "description": "d",
            "photo": {}
        }
    }
}
export let contract_sample: Payment = {
    "contract_id": contract_id,
    "sender": Principal.fromText("2vxsx-fae"),
    "receiver": Principal.fromText("2vxsx-fae"),
    "released": false,
    "confirmed": false,
    "canceled": false,
    "amount": BigInt(0),
}

export let contract_id_sample = {"Contract": {"PaymentContract": "18"}}

let payment_contract_sample = {
    "Table": {
        "rows": [{
            "contract": [{"PaymentContract": "4"}],
            "cells": [[["task", "signup task"]]],
            "requests": []
        }, {
            "contract": [{"PaymentContract": "5"}],
            "cells": [[["task", "login task"]]],
            "requests": []
        }, {"contract": [{"PaymentContract": "6"}], "cells": [[["task", "dark mode"]]], "requests": []}],
        "columns": [{
            "_type": {"Text": null},
            "field": "task",
            "filters": [],
            "permissions": [],
            "dataValidator": [],
            "editable": true,
            "formula": []
        }]
    }
}

export function randomString() {
    return Math.random().toString(36).substring(2, 8);
}

