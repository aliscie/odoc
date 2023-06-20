import * as React from 'react';
import {useSelector} from "react-redux";
import Editor from "odoc-editor"
import SpreadSheet from "../spread_sheet/spread_sheet";

export function EditorRenderer(props: any) {

    const {element, attributes = {}, children} = props;
    let Tag = element.type || "p"
    console.log('----------', {Tag, props, data: element.data})
    switch (Tag) {
        case "table":
            return <SpreadSheet {...props.element} />;
        default:
            return (<Tag
                style={{margin: 0}}
                {...props}
                placeholder={"enter somthing..."}
                {...attributes}>{children}</Tag>)
    }
}

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


export default function EditorDemo() {
    let {searchValue} = useSelector((state: any) => state.uiReducer);
    return (
        <span>
            <Editor
                renderElement={EditorRenderer}
                searchOptions={"gi"}
                search={searchValue}
                data={initialValue}/>
        </span>
    );
}
