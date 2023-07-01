import {randomString} from "../data_samples";

function denormalize_file_contents(content: any[], data: any[] = []) {
    content.forEach((item) => {
        const children = item.children
            ? item.children.map((child: any) => {
                let id = randomString();
                return {id, ...child};
            })
            : [];
        let id = randomString();
        data.push([
            id,
            {
                id,
                _type: item.type || "",
                data: item.data || [],
                text: item.text || "",
                parent: item.parent ? [String(item.parent.id)] : [],
                children: children.map((child: any) => String(child.id)),
            },
        ]);

        if (item.children) {
            denormalize_file_contents(item.children, data);
        }
    });

    return data;
}


export default denormalize_file_contents;