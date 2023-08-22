import {randomString} from "../data_samples";
import {ContentNode} from "../../../declarations/user_canister/user_canister.did";

function de_nesting(nested: any[], data = []) {
    nested.forEach((item) => {

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
            parent: item.parent || [],
            children: children.map((child) => String(child.id)),
        };
        data.push([String(id), obj]);
        // push data.push([String(id), obj]); at the beginning of the array data
        // data.unshift([String(id), obj]);
        if (children) {
            de_nesting(children, data)
        }
    })
    return data;
}

function deserialize_file_contents(content: any[], data: Array<Array<[string, Array<[string, ContentNode]>]>> = []) {
    Object.keys(content).forEach((key) => {
        let change = [];
        let item = content[key];

        let de_nested = de_nesting(item)
        change = [key, de_nested]
        data.push([change])
    });

    return data;
}


export default deserialize_file_contents;