import * as React from 'react';
import {useDispatch, useSelector} from "react-redux";
import Editor from "odoc-editor"
import {EditorRenderer} from "../editor_components/editor_renderer";
import {file_data, payment_contract, file_content_sample} from "../../data_processing/data_samples";
import {handleRedux} from "../../redux/main";


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
                data={initialValue}/>
        </span>
    );
}
