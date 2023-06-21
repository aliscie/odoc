import * as React from 'react';
import {useSelector} from "react-redux";
import Editor from "odoc-editor"
import {EditorRenderer} from "../editor_components/editor_renderer";


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
