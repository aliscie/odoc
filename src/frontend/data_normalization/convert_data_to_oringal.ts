import {logger} from "../dev_utils/log_data";

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


/// data examples
let files = {
    "0": [{"id": 0, "type": "", "children": [{"id": 1, "type": "", "text": "child is here.d"}]}],
    "1": [{"id": 2, "type": "", "children": [{"id": 3, "type": "", "text": "child is here."}]}, {
        "id": 10,
        "type": "",
        "children": [{
            "id": 11,
            "type": "",
            "children": [{"id": 13, "type": "", "text": "one"}, {"text": "one", "id": "11"}]
        }]
    }, {"id": 12, "type": ""}],
    "2": [{"id": 4, "type": "", "children": [{"id": 5, "type": "", "text": "child is here."}]}, {
        "id": 14,
        "type": ""
    }, {
        "id": 15,
        "type": "",
        "children": [{
            "id": 16,
            "type": "",
            "children": [{"id": 17, "type": "", "text": "child"}, {"text": "child", "id": "16"}]
        }]
    }],
    "3": [{"id": 6, "type": "", "children": [{"id": 7, "type": "", "text": "child is here."}]}, {
        "id": 8,
        "type": "",
        "children": [{"id": 9, "type": "", "text": "1"}]
    }]
}

let updates = [{
    "2": [{
        "14": {
            "id": 14,
            "_type": "",
            "data": null,
            "text": "child",
            "children": [],
            "parent": 11
        }
    }, {
        "17": {
            "id": 17,
            "_type": "",
            "data": null,
            "text": "child",
            "children": [],
            "parent": 16
        }
    }, {
        "16": {
            "id": 16,
            "_type": "",
            "data": null,
            "text": "child",
            "children": [17],
            "parent": 15
        }
    }, {
        "5": {
            "id": 5,
            "_type": "",
            "data": null,
            "text": "child is here.",
            "children": [],
            "parent": 4
        }
    }, {
        "15": {
            "id": 15,
            "_type": "",
            "data": null,
            "text": "",
            "children": [16],
            "parent": null
        }
    }, {"4": {"id": 4, "_type": "", "data": null, "text": "", "children": [5], "parent": null}}]
}, {
    "1": [{
        "2": {
            "id": 2,
            "_type": "",
            "data": null,
            "text": "",
            "children": [3],
            "parent": null
        }
    }, {
        "12": {
            "id": 12,
            "_type": "",
            "data": null,
            "text": "one",
            "children": [],
            "parent": 9
        }
    }, {
        "11": {
            "id": 11,
            "_type": "",
            "data": null,
            "text": "one",
            "children": [13],
            "parent": 10
        }
    }, {
        "3": {
            "id": 3,
            "_type": "",
            "data": null,
            "text": "child is here.",
            "children": [],
            "parent": 2
        }
    }, {
        "13": {
            "id": 13,
            "_type": "",
            "data": null,
            "text": "one",
            "children": [],
            "parent": 11
        }
    }, {"10": {"id": 10, "_type": "", "data": null, "text": "", "children": [11], "parent": null}}]
}, {
    "3": [{
        "7": {
            "id": 7,
            "_type": "",
            "data": null,
            "text": "child is here.",
            "children": [],
            "parent": 6
        }
    }, {"8": {"id": 8, "_type": "", "data": null, "text": "", "children": [9], "parent": null}}, {
        "6": {
            "id": 6,
            "_type": "",
            "data": null,
            "text": "",
            "children": [7],
            "parent": null
        }
    }, {"9": {"id": 9, "_type": "", "data": null, "text": "1", "children": [], "parent": 8}}]
}, {
    "0": [{
        "0": {
            "id": 0,
            "_type": "",
            "data": null,
            "text": "",
            "children": [1],
            "parent": null
        }
    }, {"1": {"id": 1, "_type": "", "data": null, "text": "child is here.", "children": [], "parent": 0}}]
}]