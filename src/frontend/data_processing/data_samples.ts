export let note_page_content = [{"id": 4, "children": [{"id": 5, "text": "", "type": "h1"}]}]
export let file_data = {"id": "0000", "content": "0", "name": "Untitled", "children": {}, "parent": []}
export let payment_contract = {
    "id": 0,
    "children": [{"id": "002", "text": "", "data": [{"Table": {"rows": [], "columns": []}}]}],
    "type": "payment_contract"
}
export let payment_contract_content = [
    {type: "span", children: [{text: ""}]},
    payment_contract,
    {type: "span", children: [{text: ""}]},
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
export let contract_sample = {
    "contract_id": "18",
    "sender": "",
    "released": false,
    "confirmed": false,
    "amount": "",
    "receiver": ""
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

