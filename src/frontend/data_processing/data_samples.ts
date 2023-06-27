export let payment_contract_content = [{
    "id": 1,
    "type": "contracts",
    "data": [{
        "Table": {
            "rows": [[["user", "John Doe"], ["amount", "100"], ["release", "Category A"]], [["amount", "200"], ["release", "Category B"], ["user", "Jane Smith"]]],
            "columns": [{
                "_type": {"Person": null},
                "field": "user",
                "filters": [],
                "permissions": [],
                "editable": true,
                "formula": []
            }, {
                "_type": {"Number": null},
                "field": "amount",
                "filters": [],
                "permissions": [],
                "editable": true,
                "formula": []
            }, {
                "_type": {"Category": null},
                "field": "release",
                "filters": [],
                "permissions": [],
                "editable": true,
                "formula": []
            }]
        }
    }],
    "children": [{"text": ""}]
}]


export let note_page_content = [{"id": 4, "children": [{"id": 5, "text": "", "type": "h1"}]}]
export let file_data = {"id": "0000", "content": "0", "name": "Untitled", "children": {}, "parent": []}

// a functoin that genrate random 6 digits string
export function randomString() {
    return Math.random().toString(36).substring(2, 8);
}