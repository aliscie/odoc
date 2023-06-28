function denormalize_file_contents(content, data = {}) {
    content.map((item: any) => {
        data[item.id] = {
            id: item.id,
            _type: item.type,
            data: item.data || [],
            text: item.text || "",
            parent: item.parent ? item.parent.id : null,
            children: item.children ? item.children.map((child: any) => child.id) : [],
        }
        if (item.children) {
            denormalize_file_contents(item.children, data)
        }

    })
    return data
}

export default denormalize_file_contents;