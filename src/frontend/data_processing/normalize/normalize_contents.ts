import {ContentNode} from "../../../declarations/user_canister/user_canister.did";


export interface SlateNode {
    id: String;
    type?: string;
    language?: string;
    text?: string;
    children?: SlateNode[];
    data?: any[];
    parent?: string[];
}


function nesting(content_node: ContentNode, alL_contents: Array<ContentNode>, visited: any[] = []) {
    let children = content_node.children.map((child_id: string) => {
        let child: undefined | ContentNode = alL_contents.find((node: ContentNode) => node.id === child_id)
        child && visited.push(child.id)
        return child && nesting(child, alL_contents, visited)
    })

    // let item: SlateNode = {
    let item: any = {
        id: content_node.id,
        type: content_node._type,
        data: content_node.data,
        // text: content_node.text,
        // children
    };

    if (content_node.language.length > 0) {
        item['language'] = content_node.language
    }
    if (children.length > 0) {
        item['children'] = children
    } else {
        item['text'] = content_node.text
    }

    visited.push(content_node.id)
    return item

}

export function normalize_content_tree(tree: Array<ContentNode>) {
    let nested_file_content: Array<SlateNode> = [];
    let visited: Array<string> = [];
    tree.map((node: ContentNode) => {
        if (!visited.includes(node.id) && !node.parent[0]) {
            visited.push(node.id)
            let slate_node: undefined | SlateNode = nesting(node, tree, visited)
            slate_node && nested_file_content.push(slate_node)
        }
    })
    return nested_file_content
}

export function normalize_files_contents(content: undefined | Array<[string, Array<ContentNode>]>) {
    if (!content) {
        return []
    }
    if (content.length == 0) {
        return []
    }
    let data: Map<string, Array<SlateNode>> = new Map<string, Array<SlateNode>>();
    content.map((node: [string, Array<ContentNode>]) => {
        if (!node[0]) {
            return
        }
        let file_id: string = node[0];
        let file_content: Array<ContentNode> = node[1];
        let nested_file_content: Array<SlateNode> = normalize_content_tree(file_content);
        data.set(
            file_id, nested_file_content
        )
    })
    return data
}