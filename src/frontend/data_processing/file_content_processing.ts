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
    node: { id: number; _type: string; text: string; children: number[], data: any },
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
    let res = {id: Number(node.id)}
    if (children.length > 0 && node.text.length > 0) {
        res["children"] = [...children, {text: node.text, id: node.id}];
    }


    if (children.length > 0) {
        res["children"] = children;

    } else {
        res["text"] = node.text;
    }

    if (node._type.length > 0) {
        res["type"] = node._type;
    }
    if (node.data.length > 0) {
        res["data"] = node.data;
    }
    if (node.data.length > 0 && node.children.length <= 0) {
        res["data"] = node.data;
        res["children"] = [{text: ""}];
    }
    return res
}
