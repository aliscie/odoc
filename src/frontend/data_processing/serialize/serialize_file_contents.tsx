import {randomString} from "../data_samples";
import {ContentNode} from "../../../declarations/user_canister/user_canister.did";

function de_nesting(nested: any[]) {
    let queue = []
    let data = [];
    let parent = []
    nested.forEach((rootItem) => {
        queue.push(rootItem)
        while (queue.length > 0) {

            let item = queue.pop();
            let id = item.id || randomString();
            let children: ContentNode[] = item.children ? item.children.map((child) => {
                let id = String(child.id || randomString());
                return {id, parent: [String(id)], ...child}
            }) : [];
            let obj: ContentNode = {
                id: String(id),
                _type: item.type || "",
                data: item.data || [],
                text: item.text || "",
                language: item.language || "",
                parent: parent,
                children: children.map((child) => String(child.id)),
            };

            data.push(obj);
            if (children) {
                parent = [String(id)]
                queue = queue.concat(children)
            }

        }
        parent = []

    })
    return data;
}


function serialize_file_contents(content: any[], data: Array<Array<[string, Array<ContentNode>]>> = []) {
    Object.keys(content).forEach((key) => {
        let change = [];
        let item = content[key];

        let de_nested: Array<ContentNode> = de_nesting(item)
        change = [key, de_nested]
        data.push([change])
    });

    return data;
}


export default serialize_file_contents;