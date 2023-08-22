import React, {useState} from 'react';
import List from '@mui/material/List';
import {ListSubheader} from "@mui/material";
import ItemComponent from "./list_item";
import Draggable from "../../genral/draggable";


export interface NestedDataItem {
    id: string;
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
                    <ListSubheader
                        style={{background: "none", color: "white"}} component="p"
                        id="nested-list-subheader">
                        {title}
                    </ListSubheader>
                }
                sx={{width: '100%', maxWidth: 360, margin: '5px'}}
                component="nav"
                aria-labelledby="nested-list-subheader"
            >
                <Draggable preventDragUnder={true}><div style={{ height: '5px', width: '100%'}}></div></Draggable>
                {Object.values(data).map((item, index) => (
                    item.parent && item.parent.length == 0 && <ItemComponent
                        key={item.id}
                        data={data}
                        item={item}
                        index={index}
                        openItems={openItems}
                        handleClick={handleClick}
                        isChild={false}
                    />
                ))}
                <Draggable preventDragUnder={true}><div style={{ height: '5px', width: '100%'}}></div></Draggable>
            </List>
        </div>
    );
};

export default NestedList;
