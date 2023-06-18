import {useSelector} from "react-redux";
import Editor from "dox-editor";
import * as React from "react";

interface Node {
    id: number;
    _type: string;
    text: string;
    children: Node[];
}

interface DataMap {
    [id: number]: { id: number; _type: string; text: string; children: number[] };
}

export function convertDataStructure(data: any): Node[] {
    const roots: Node[] = [];
    const visited: Set<number> = new Set();

    for (const nodeId in data) {
        const node = data[nodeId];
        if (!visited.has(node.id)) {
            let item = buildTree(node.value, data, visited);
            // remove field text
            delete item.text;
            roots.push(item);
        }
    }

    return roots;
}

function buildTree(
    node: { id: number; _type: string; text: string; children: number[] },
    data: DataMap,
    visited: Set<number>
): any {
    visited.add(node.id);

    let children: any[] = [];
    if (node.children.length > 0) {
        for (const childId of node.children) {
            const child = data[childId];
            if (!visited.has(child.id)) {
                children.push(buildTree(child.value, data, visited));
            }
        }
    }
    if (children.length > 0 && node.text.length > 0) {
        // children.push({text: node.text, type: "", id: node.id});
        children = [...children, {text: node.text, id: node.id}];
        return {
            id: Number(node.id),
            type: node._type,
            children,
        };
    }

    if (children.length > 0) {

        return {
            id: Number(node.id),
            type: node._type,
            text: node.text,
            children,
        };
    }

    return {
        id: Number(node.id),
        type: node._type,
        text: node.text,
    };
}




function FileContentPage(props: any) {
    let {searchValue} = useSelector((state: any) => state.uiReducer);
    const {current_file, files_content} = useSelector((state: any) => state.filesReducer);
    // const [state, setState] = React.useState<any>(dummy);

    console.log(current_file.id != null, {current_file, files_content})
    if (current_file.id != null) {
        let content = files_content[current_file.id];
        // let proceeded_content = convertDataStructure(content);
        // stringify proceeded_content
        // console.log(JSON.stringify(proceeded_content))
        // setState(proceeded_content);
        console.log({content})
        // stringify content
        console.log(JSON.stringify(content))
        return (<span style={{margin: '3px', marginLeft: "20%", marginRight: "10%"}}>
            {current_file.name && <>
                <h1 contentEditable={true}>{current_file.name}</h1>
                <Editor
                    searchOptions={"gi"}
                    search={searchValue}
                    // element_render={EditorRenderer}
                    data={content}
                />
            </>}
        </span>);
    }
    return <span>
        404
        dummy
    </span>

}

export default FileContentPage;