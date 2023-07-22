import * as React from 'react';
import {useDispatch, useSelector} from "react-redux";
import Editor from "odoc-editor"
import {EditorRenderer} from "../editor_components/editor_renderer";
import {file_data, payment_contract, file_content_sample} from "../../data_processing/data_samples";
import {handleRedux} from "../../redux/main";

let x = [{
    "id": "ac686n",
    "type": "table",
    "data": [],
    "children": [{
        "id": "kpi6hc",
        "type": "table-row",
        "data": [],
        "children": [{
            "id": "iu89ym",
            "type": "table-cell",
            "data": [],
            "children": [{"id": "a5nslz", "type": "", "data": [], "text": ""}]
        }, {
            "id": "jqzsu1",
            "type": "table-cell",
            "data": [],
            "children": [{"id": "1u54wg", "type": "", "data": [], "text": "Human"}]
        }, {
            "id": "indzwc",
            "type": "table-cell",
            "data": [],
            "children": [{"id": "pb7xjs", "type": "", "data": [], "text": "Dog"}]
        }, {
            "id": "d6c3m7",
            "type": "table-cell",
            "data": [],
            "children": [{"id": "ebvpuk", "type": "", "data": [], "text": "Cat"}]
        }]
    }, {
        "id": "l9zapr",
        "type": "table-row",
        "data": [],
        "children": [{
            "id": "b8mlry",
            "type": "table-cell",
            "data": [],
            "children": [{"id": "haxma8", "type": "", "data": [], "text": "# of Feet"}]
        }, {
            "id": "tyln0r",
            "type": "table-cell",
            "data": [],
            "children": [{"id": "1lano2", "type": "", "data": [], "text": "2"}]
        }, {
            "id": "0f4hmk",
            "type": "table-cell",
            "data": [],
            "children": [{"id": "lzra4a", "type": "", "data": [], "text": "4"}]
        }, {
            "id": "wh4idq",
            "type": "table-cell",
            "data": [],
            "children": [{"id": "z5z4sq", "type": "", "data": [], "text": "4"}]
        }]
    }, {
        "id": "srkohg",
        "type": "table-row",
        "data": [],
        "children": [{
            "id": "e9guyb",
            "type": "table-cell",
            "data": [],
            "children": [{"id": "xasld6", "type": "", "data": [], "text": "# of Lives"}]
        }, {
            "id": "r4aecd",
            "type": "table-cell",
            "data": [],
            "children": [{"id": "izlg74", "type": "", "data": [], "text": "1"}]
        }, {
            "id": "394exv",
            "type": "table-cell",
            "data": [],
            "children": [{"id": "xm3oqt", "type": "", "data": [], "text": "1"}]
        }, {
            "id": "qsuyug",
            "type": "table-cell",
            "data": [],
            "children": [{"id": "sgdthx", "type": "", "data": [], "text": "9"}]
        }]
    }]
}, {
    "id": "yndeb7",
    "type": "span",
    "data": [],
    "children": [{"id": "nvdd3i", "type": "", "data": [], "text": "test "}]
}, {
    "id": "90luj2",
    "type": "payment_contract",
    "data": [],
    "children": [{
        "id": "002",
        "type": "",
        "data": [{
            "Table": {
                "rows": [{
                    "id": "90luj2",
                    "contract": [{"PaymentContract": "90luj2"}],
                    "cells": [[["new_name", "any value"]]],
                    "requests": []
                }, {
                    "id": "lhh2jh",
                    "contract": [{"PaymentContract": "lhh2jh"}],
                    "cells": [[["new_name", ""]]],
                    "requests": []
                }],
                "columns": [{
                    "id": "0oxxml",
                    "_type": {"Text": null},
                    "field": "receiver",
                    "filters": [],
                    "permissions": [],
                    "dataValidator": [],
                    "editable": true,
                    "formula": []
                }, {
                    "id": "t8twba",
                    "_type": {"Text": null},
                    "field": "new_name",
                    "filters": [],
                    "permissions": [],
                    "dataValidator": [],
                    "editable": true,
                    "formula": []
                }, {
                    "id": "ujmyal",
                    "_type": {"Text": null},
                    "field": "amount",
                    "filters": [],
                    "permissions": [],
                    "dataValidator": [],
                    "editable": true,
                    "formula": []
                }, {
                    "id": "fgpip0",
                    "_type": {"Text": null},
                    "field": "released",
                    "filters": [],
                    "permissions": [],
                    "dataValidator": [],
                    "editable": true,
                    "formula": []
                }, {
                    "id": "wsqlzr",
                    "_type": {"Text": null},
                    "field": "confirmed",
                    "filters": [],
                    "permissions": [],
                    "dataValidator": [],
                    "editable": true,
                    "formula": []
                }]
            }
        }],
        "text": ""
    }]
}, {"id": "z4cize", "type": "span", "data": [], "children": [{"id": "z4qif2", "type": "", "data": [], "text": " "}]}]


export const initialValue = [
    {type: "h1", children: [{text: "My heading is here."}]},
    {
        type: 'paragraph',
        children: [
            {
                text:
                    'This example shows how you can make a hovering menu appear above your content, which you can use to make text ',
            },
            {text: 'bold', bold: true},
            {text: ', '},
            {text: 'italic', italic: true},
            {text: ', or anything else you might want to do!'},
        ],
    },
    {
        type: 'paragraph',
        children: [
            {text: 'Try it out yourself! Just '},
            {text: 'select any piece of text and the menu will appear', bold: true},
            {text: '.'},
        ],
    },
]


export let table = {
    type: 'table',
    children: [
        {
            type: 'table-row',
            children: [
                {
                    type: 'table-cell',
                    children: [{text: ''}],
                },
                {
                    type: 'table-cell',
                    children: [{text: 'Human', bold: true}],
                },
                {
                    type: 'table-cell',
                    children: [{text: 'Dog', bold: true}],
                },
                {
                    type: 'table-cell',
                    children: [{text: 'Cat', bold: true}],
                },
            ],
        },
        {
            type: 'table-row',
            children: [
                {
                    type: 'table-cell',
                    children: [{text: '# of Feet', bold: true}],
                },
                {
                    type: 'table-cell',
                    children: [{text: '2'}],
                },
                {
                    type: 'table-cell',
                    children: [{text: '4'}],
                },
                {
                    type: 'table-cell',
                    children: [{text: '4'}],
                },
            ],
        },
        {
            type: 'table-row',
            children: [
                {
                    type: 'table-cell',
                    children: [{text: '# of Lives', bold: true}],
                },
                {
                    type: 'table-cell',
                    children: [{text: '1'}],
                },
                {
                    type: 'table-cell',
                    children: [{text: '1'}],
                },
                {
                    type: 'table-cell',
                    children: [{text: '9'}],
                },
            ],
        },
    ],
}

export default function EditorDemo() {
    let {searchValue} = useSelector((state: any) => state.uiReducer);
    const dispatch = useDispatch();

    function handleOnInsertComponent(e: any, component: any) {
        console.log("handleOnInsertComponent", e, component)
        if (component.type == "payment_component") {
            dispatch(handleRedux("ADD_CONTENT", {id: file_data.id, content: file_content_sample}))
        }

    }

    return (
        <span>
            <Editor
                onInsertComponent={handleOnInsertComponent}
                componentsOptions={[
                    table,
                    payment_contract,
                    {type: "accumulative_contract"},
                    {type: "custom_contract"},
                ]}
                mentionOptions={["Ali", "Alen", "Alice", "John,", "Jack", "James", "Mik", "Mathis"]}
                renderElement={EditorRenderer}
                searchOptions={"gi"}
                search={searchValue}
                data={x}/>
        </span>
    );
}
