import React, {useState} from 'react';
import List from '@mui/material/List';
import {ListSubheader} from "@mui/material";
import ItemComponent from "./list_item";


export interface NestedDataItem {
    id: number;
    name: string;
    children: number[];
}


interface NestedListProps {
    title: string;
    data: Record<number, NestedDataItem>; // Use Record<number, NestedDataItem> instead of any
}

const NestedList: React.FC<NestedListProps> = ({title, data}) => {
    const [openItems, setOpenItems] = useState<number[]>([]);

    const handleClick = (index: number) => {
        if (openItems.includes(index)) {
            setOpenItems(openItems.filter((item) => item !== index));
        } else {
            setOpenItems([...openItems, index]);
        }
    };

    return (
        <div>
            <List
                subheader={
                    <ListSubheader style={{background: "none", color: "white"}} component="p"
                                   id="nested-list-subheader">
                        {title}
                    </ListSubheader>
                }
                sx={{width: '100%', maxWidth: 360, margin: '5px'}}
                component="nav"
                aria-labelledby="nested-list-subheader"
            >
                {Object.values(data).map((item, index) => (
                    item.parent.length == 0 && <ItemComponent
                        key={item.id}
                        data={data}
                        item={item}
                        index={index}
                        openItems={openItems}
                        handleClick={handleClick}
                        isChild={false}
                    />
                ))}
            </List>
        </div>
    );
};

export default NestedList;
