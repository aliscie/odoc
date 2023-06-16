import React from "react";
import {Link} from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import {NestedDataItem} from "./nest_list";
import ContextMenu from "../../genral/context_menu";
import DeleteIcon from '@mui/icons-material/Delete';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import {delete_file} from "../../../backend_connect/connect";
import {backend} from "../../../backend_connect/main";
import {useDispatch} from "react-redux";
import {handleRedux} from "../../../redux/main";
import {Input} from "@mui/material";

interface ItemProps {
    data: Record<number, NestedDataItem>; // Use Record<number, NestedDataItem> instead of any
    item: NestedDataItem;
    index: number;
    openItems: number[];
    handleClick: (index: number) => void;
    isChild?: boolean;
}

const ItemComponent: React.FC<ItemProps> = ({data, item, index, openItems, handleClick, path = null, pl = 1}) => {
    const html_file_id = `file${item.id}`;
    const isOpen = openItems.includes(index);
    const hasChildren = item.children.length > 0;

    const handleItemClick = () => {
        handleClick(index);
    };

    path = path ? path : item.name;
    path = path.replace(/\s+/g, '-').toLowerCase();
    const dispatch = useDispatch();


    async function handleDeleteFile(e: any) {
        let res = await backend.delete_file(BigInt(item.id))
        dispatch(handleRedux("REMOVE", {id: item.id}))
    }

    const ref = React.useRef(null);

    async function handleRenameFile(e: any) {
        ref.current.focus()
        // select all text
        // document.execCommand('selectAll', false, null);
        console.log(ref.current.value)
    }

    async function onChange(e: any) {
        ref.current.focus()
        ref.current.value = e.target.value
        console.log(ref.current.value)
    }

    let options = [
        {
            content: "save",
            preventClose: true,
            onClick: handleRenameFile,
            icon: <Input onChange={onChange} ref={ref} autoFocus={true} placeholder={item.name}/>
        },
        {content: "delete", onClick: handleDeleteFile, icon: <DeleteIcon size={"small"}/>},
    ]

    return (
        <>
            <Link to={path}>
                <ContextMenu options={options}>
                    <ListItemButton id={html_file_id} onClick={handleItemClick} sx={{pl}}>
                        {hasChildren && (isOpen ? <ExpandLess/> : <ExpandMore/>)}
                        <ListItemText primary={item.name}/>
                    </ListItemButton>
                </ContextMenu>
            </Link>
            {hasChildren && (
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {[...item.children].map((childId, childIndex) => {
                            const childItem = data[childId];
                            if (childItem) {
                                return (
                                    <ItemComponent
                                        path={path + "/" + childItem.name}
                                        key={childItem.id}
                                        data={data}
                                        item={childItem}
                                        index={index + childIndex + 1}
                                        openItems={openItems}
                                        handleClick={handleClick}
                                        pl={pl + 3} // Pass the isChild prop to child items
                                    />
                                );
                            }
                            return null;
                        })}
                    </List>
                </Collapse>
            )}
        </>
    );
};
export default ItemComponent;