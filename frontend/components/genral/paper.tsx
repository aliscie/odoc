import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Editor from "autodox-text-editor";

function EditorRenderer(props: RendererProps) {
    const {tag, content, attributes = {}, children} = props;
    let Tag = tag || "span";
    switch (tag) {
        case "quote":
            return <div>quote {children}</div>;
        default:
            return (<Tag
                style={{margin: 0}}
                {...props}
                placeholder={"enter somthing..."}
                {...attributes}>{children}</Tag>)
    }
}

const my_dummies = [
    {tag: 'h3', children: [{id: 'p2', content: 'hello world'}], id: 'p3'},
    {tag: 'p', children: [{id: 'p2', content: 'Blockchain technology has emerged as a groundbreaking innovation with the potential to transform numerous industries and revolutionize the way we interact, transact, and secure data. With its decentralized and immutable nature, blockchain has garnered significant attention and adoption across various sectors.'}], id: 'p3'},
    {tag: 'p', children: [{id: 'p2', content: 'Blockchain technology has emerged as a groundbreaking innovation with the potential to transform numerous industries and revolutionize the way we interact, transact, and secure data. With its decentralized and immutable nature, blockchain has garnered significant attention and adoption across various sectors.'}], id: 'p3'}
]

export default function SimplePaper() {


    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'top',
                minHeight: '100vh',
                p: 4,
                marginLeft: 10,
                marginRight: 10,
                backgroundColor: 'var(--background-color)',
            }}
        >
            <Box sx={{alignItems: 'flex-start'}}>
                {/*// https://github.com/aliscie/text-editor*/}
                <Editor
                    element_render={EditorRenderer}
                    data={my_dummies}
                />
            </Box>
        </Box>
    );
}
