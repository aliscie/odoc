import React, {useState} from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {ListSubheader} from "@mui/material";
import {Link} from "react-router-dom";

let is_rendered = []

interface NestedDataItem {
    id: number;
    name: string;
    children: number[];
}

interface ItemProps {
    data: Record<number, NestedDataItem>; // Use Record<number, NestedDataItem> instead of any
    item: NestedDataItem;
    index: number;
    openItems: number[];
    handleClick: (index: number) => void;
    isChild?: boolean;
}

const Item: React.FC<ItemProps> = ({data, item, index, openItems, handleClick, isChild, path = null}) => {
    const isOpen = openItems.includes(index);
    const hasChildren = item.children.length > 0;

    const handleItemClick = () => {
        handleClick(index);
    };

    path = path ? path : item.name;
    path = path.replace(/\s+/g, '-').toLowerCase();
    console.log(path)
    return (
        <React.Fragment key={item.id}>
            <Link to={path}>
                <ListItemButton onClick={handleItemClick} sx={{pl: isChild ? 2 : 0}}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.name}/>
                    {hasChildren && (isOpen ? <ExpandLess/> : <ExpandMore/>)}
                </ListItemButton>
            </Link>
            {hasChildren && (
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {[...item.children].map((childId, childIndex) => {
                            const childItem = data[childId];
                            is_rendered.push(childId)
                            if (childItem) {
                                return (
                                    <Item
                                        path={path + "/" + childItem.name}
                                        key={childItem.id}
                                        data={data}
                                        item={childItem}
                                        index={index + childIndex + 1}
                                        openItems={openItems}
                                        handleClick={handleClick}
                                        isChild // Pass the isChild prop to child items
                                    />
                                );
                            }
                            return null;
                        })}
                    </List>
                </Collapse>
            )}
        </React.Fragment>
    );
};

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
                    item.parent.length == 0 && <Item
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
