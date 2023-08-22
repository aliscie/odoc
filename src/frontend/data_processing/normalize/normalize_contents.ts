import {ContentNode} from "../../../declarations/user_canister/user_canister.did";


export interface SlateNode {
    id: String;
    language?: string;
    type?: string;
    language?: string;
    text?: string;
    children?: SlateNode[];
    data?: any[];
    parent?: number[];
}


function nesting(content_node: [string, ContentNode], alL_contents: Array<[string, ContentNode]>, visited: any[] = []) {
    let children = content_node[1].children.map((child_id: string) => {
        let child: [string, ContentNode] = alL_contents.find((node: [string, ContentNode]) => node[0] === child_id)
        visited.push(child[0])
        return nesting(child, alL_contents, visited)
    })

    let item = {
        id: content_node[0],
        type: content_node[1]._type,
        data: content_node[1].data,
        // text: content_node[1].text,
        // children
    };

    if (content_node[1].language.length > 0) {
        item['language'] = content_node[1].language
    }
    if (children.length > 0) {
        item['children'] = children
    } else {
        item['text'] = content_node[1].text
    }

    visited.push(content_node[0])
    return item

}

export function normalize_content_tree(tree: Array<[string, ContentNode]>) {
    let nested_file_content: Array<SlateNode> = [];
    let visited = [];
    tree.map((node: [string, ContentNode]) => {
        if (!visited.includes(node[0]) && !node[1].parent[0]) {
            visited.push(node[0])
            let slate_node: SlateNode = nesting(node, tree, visited)
            nested_file_content.push(slate_node)
        }
    })
    return nested_file_content
}

export function normalize_files_contents(content: Array<Array<[string, Array<[string, ContentNode]>]>>) {
    if (!content[0]) {
        return []
    }
    let data = {}
    // Array<Array<[string, Array<[string, ContentNode]>]>>
    content.map((node: Array<[string, Array<[string, ContentNode]>]>) => {
        if (!node[0]) {
            return
        }
        let file_id: string = node[0][0];
        let file_content: Array<[string, ContentNode]> = node[0][1];
        let nested_file_content: Array<SlateNode> = normalize_content_tree(file_content);
        // let visited = [];
        // file_content.map((node: [string, ContentNode]) => {
        //     if (!visited.includes(node[0]) && !node[1].parent[0]) {
        //         visited.push(node[0])
        //         let slate_node: SlateNode = nesting(node, file_content, visited)
        //         nested_file_content.push(slate_node)
        //     }
        // })
        data[file_id] = nested_file_content

    })
    return data
}