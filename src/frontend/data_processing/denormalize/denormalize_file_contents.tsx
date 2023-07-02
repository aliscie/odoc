import {randomString} from "../data_samples";
import {ContentNode} from "../../../declarations/user_canister/user_canister.did";

function de_nesting(nested: any[], data = []) {
    nested.forEach((item) => {
        let children: any[] = item.children ? item.children.map((child) => String(child.id)) : [];
        let obj: ContentNode = {
            id: String(item.id) || "",
            _type: item.type || "",
            data: item.data || [],
            text: item.text || "",
            parent: item.parent || [],
            children: children,
        };
        data.push([obj.id, obj]);
        if (item.children) {
            de_nesting(item.children, data)
        }
    })
    return data;
}

function denormalize_file_contents(content: any[], data: any[] = []) {
    Object.keys(content).forEach((key) => {
        let change = []
        let item = content[key];
        let de_nested = de_nesting(item)
        change = [key, de_nested]
        data.push([change])
    });

    return data;
}


export default denormalize_file_contents;