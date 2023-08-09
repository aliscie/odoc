export function updateTableContent(props: any, content: any, updater: any) {
    // props = props.props
    let table_content = props.children[0];

    let newContent = content.map((item) => {
        if (item.id === props.id) {
            let newChildren = item.children.map((child) => {
                if (child.data && child.id === table_content.id) {
                    let newData = child.data.map((data) => {
                        return {...data, Table: updater({...data.Table})};
                    });
                    return {...child, data: newData};
                }
                return child;
            });
            return {...item, children: newChildren};
        }
        return item;
    });
    return newContent;
}