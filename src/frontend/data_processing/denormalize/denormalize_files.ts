interface ContentNode {
    id: number;
    _type: string;
    text: string;
    children: ContentNode[];
}

interface DataMap {
    [id: number]: ContentNode;
}

export function convertDataBack(nodes: any): any {
    const data: any = {};

    function traverse(node: any): number[] {
        const children: number[] = [];
        if (node.children && node.children.length > 0) {
            for (const child of node.children) {
                const childId = Object.keys(data).length + 1;
                const childAny = {
                    id: childId,
                    _type: child._type,
                    text: child.text,
                    children: traverse(child),
                };
                children.push(childId);
                data[childId] = childAny;
            }
        }
        return children;
    }

    // const node = nodes[key];
    // const nodeId = node.id;
    const newAny = {
        id: Number(nodes.id),
        parent: nodes.parent ? BigInt(Number(nodes.parent)) : [],
        _type: nodes.type || "",
        text: nodes.text || "",
        children: traverse(nodes.children) || [],
        data: nodes.data || null,
    };
    data[nodes.id] = newAny;

    return data;
}


export function convertAllDataBack(data) {
    const convertedData = [];

    for (const fileId in data) {
        const fileContent = data[fileId];
        const convertedContent = {};

        for (const content of fileContent) {
            const convertedNode = convertDataBack(content);
            convertedContent[fileId] = convertedNode;
        }

        convertedData.push(convertedContent);
    }

    return convertedData;
}

