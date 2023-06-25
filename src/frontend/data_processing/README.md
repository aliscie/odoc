# Normalization: backend_data -> frontend_data

# Denormalization (convert back to virginal structure): frontend_data -> backend_data

# Data examples

```js


let normalized_contents = {
    "0": [{"id": 0, "type": "", "children": [{"id": 1, "type": "", "text": "child is here.d"}]}],
    "1": [{"id": 2, "type": "", "children": [{"id": 3, "type": "", "text": "child is here."}]}, {
        "id": 10,
        "type": "",
        "children": [{
            "id": 11,
            "type": "",
            "children": [{"id": 13, "type": "", "text": "one"}, {"text": "one", "id": "11"}]
        }]
    }, {"id": 12, "type": ""}],
    "2": [{"id": 4, "type": "", "children": [{"id": 5, "type": "", "text": "child is here."}]}, {
        "id": 14,
        "type": ""
    }, {
        "id": 15,
        "type": "",
        "children": [{
            "id": 16,
            "type": "",
            "children": [{"id": 17, "type": "", "text": "child"}, {"text": "child", "id": "16"}]
        }]
    }],
    "3": [{"id": 6, "type": "", "children": [{"id": 7, "type": "", "text": "child is here."}]}, {
        "id": 8,
        "type": "",
        "children": [{"id": 9, "type": "", "text": "1"}]
    }]
}

```

# multi_update_input

```js
let multi_update_input = [
    {
        0: {
            0: {
                "id": 0,
                "parent": [],
                "_type": "",
                "text": "Sample text 1",
                "children": [],
                "data": null
            }
        }
    },
    {
        1: {
            11: {
                "id": 11,
                "parent": [],
                "_type": "",
                "text": "Sample text 2",
                "children": [],
                "data": null
            }
        }
    },
    {
        2: {
            16: {
                "id": 16,
                "parent": [],
                "_type": "",
                "text": "Sample text 3",
                "children": [],
                "data": null
            }
        }
    }
]
```