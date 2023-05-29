import React, {useState} from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import {ListSubheader} from "@mui/material";

interface NestedDataItem {
    content: string;
    icon?: React.ReactNode;
    children?: NestedDataItem[];
}

interface ItemProps {
    item: NestedDataItem;
    index: number;
    openItems: number[];
    handleClick: (index: number) => void;
    isChild?: boolean;
}

const Item: React.FC<ItemProps> = ({item, index, openItems, handleClick, isChild}) => {
    const isOpen = openItems.includes(index);
    const hasChildren = !!item.children;

    const handleItemClick = () => {
        handleClick(index);
    };

    return (
        <React.Fragment key={index}>
            <ListItemButton onClick={handleItemClick} sx={{pl: isChild ? 2 : 0}}>
                {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                <ListItemText primary={item.content}/>
                {hasChildren && (isOpen ? <ExpandLess/> : <ExpandMore/>)}
            </ListItemButton>
            {hasChildren && (
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {item.children.map((child, childIndex) => (
                            <Item
                                key={childIndex}
                                item={child}
                                index={index + childIndex + 1}
                                openItems={openItems}
                                handleClick={handleClick}
                                isChild // Pass the isChild prop to child items
                            />
                        ))}
                    </List>
                </Collapse>
            )}
        </React.Fragment>
    );
};

interface NestedListProps {
    title: string;
    data: NestedDataItem[];
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
                    <ListSubheader style={{background: "none", color: "white"}} component="p" id="nested-list-subheader">
                        {title}
                    </ListSubheader>
                }
                sx={{width: '100%', maxWidth: 360, margin: '5px'}} component="nav"
                aria-labelledby="nested-list-subheader">
                {data.map((item, index) => (
                    <Item key={index} item={item} index={index} openItems={openItems} handleClick={handleClick}
                          isChild={false}/>
                ))}
            </List>
        </div>
    );
};

export default NestedList;
