export let note_page_content = [{"id": 4, "children": [{"id": 5, "text": "", "type": "h1"}]}]
export let file_data = {"id": "0000", "content": "0", "name": "Untitled", "children": {}, "parent": []}
export let payment_contract_content = [
    {type: "span", children: [{text: ""}]},
    {
        "id": 0,
        "children": [{
            "id": 1,
            "children": [{"id": 2, "text": ""}],
            "data": [{
                "Table": {
                    "rows": [],
                    "columns": []
                }
            }]
        }],
        "type": "payment_contract"
    },
    {type: "span", children: [{text: ""}]},
]
export let payment_contract_row = {"Contract": {"PaymentContract": "0"}}
export let payment_contract_row2 = {"Contract": {"PaymentContract": "1"}}

export let contracts_sample = {
    "17": {
        "contract_id": "17",
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

export function randomString() {
    return Math.random().toString(36).substring(2, 8);
}