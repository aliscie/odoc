import * as React from 'react';
import Box from '@mui/material/Box';
import Editor from "dox-editor";

// function EditorRenderer(props: RendererProps) {
//     const {tag, content, attributes = {}, children} = props;
//     let Tag = tag || "span";
//     switch (tag) {
//         case "quote":
//             return <div>quote {children}</div>;
//         default:
//             return (<Tag
//                 style={{margin: 0}}
//                 {...props}
//                 placeholder={"enter somthing..."}
//                 {...attributes}>{children}</Tag>)
//     }
// }

const my_dummies = [
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

//
// let newd = [
//     {type: "h1", children: [{text: "My heading is here."}]},
//     {
//         type: 'paragraph',
//         children: ["id_111", "id_223", "id_224", "id_225", "id_226"],
//     },
//     {
//         id: "id_111",
//         text:
//             'This example shows how you can make a hovering menu appear above your content, which you can use to make text ',
//     },
//     {id: "id_223", text: 'bold', bold: true},
//     {id: "id_224", text: ', '},
//     {id: "id_225", text: 'italic', italic: true},
//     {id: "id_226", text: ', or anything else you might want to do!'},
//     {
//         type: 'paragraph',
//         children: ["id_222", "id_223", "id_224"],
//     },
//
//     {id: "id_222", text: 'Try it out yourself! Just '},
//     {id: "id_223", text: 'select any piece of text and the menu will appear', bold: true},
//     {id: "id_224", text: '.'},
//
// ]
export default function SimplePaper() {


    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'top',
                minHeight: '100vh',
                p: 4,
                // marginLeft: 10,
                // marginRight: 10,
                backgroundColor: 'var(--background-color)',
            }}
        >
            <Box sx={{alignItems: 'flex-start'}}>
                {/*// https://github.com/aliscie/text-editor*/}
                <h1> hello editor </h1>
                <Editor
                    // element_render={EditorRenderer}
                    data={my_dummies}
                />
            </Box>
        </Box>
    );
}
