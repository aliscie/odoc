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
import {useDispatch, useSelector} from "react-redux";
import {handleRedux} from "../../../redux/main";
import DeleteFile from "../../actions/delete_file";
import Draggable from "../../genral/draggable";
import ShareIcon from '@mui/icons-material/Share';
import ChangeWorkSpace from "../../actions/change_work_space_file";

interface ItemProps {
    data: Record<number, NestedDataItem>; // Use Record<number, NestedDataItem> instead of any
    item: NestedDataItem;
    index: number;
    openItems: number[];
    handleClick: (index: number) => void;
    isChild?: boolean;
}

const DocComponent: React.FC<ItemProps> = ({data, item, index, openItems, handleClick, path = null, pl = 1}) => {
    const {contracts, profile, wallet} = useSelector((state: any) => state.filesReducer);

    const dispatch = useDispatch();

    const html_file_id = `file${item.id}`;
    const isOpen = openItems.includes(index);
    const hasChildren = item.children.length > 0;

    const handleItemClick = () => {
        handleClick(index);
        dispatch(handleRedux("CURRENT_FILE", {file: item}));
    };

    path = path ? path : item.id;
    path = path && path.replace(/\s+/g, '_').toLowerCase();
    path = path && path.replaceAll(".", "")

    let options = [
        // {
        //     content: <RenameFile item={item}/>,
        //     preventClose: true,
        // },
        {content: <DeleteFile item={item}/>,preventClose: true,},
        {content: <ChangeWorkSpace item={item}/>},
    ]

    const handleDrop: any = async (dropped, droppedOver, type) => {
        let id = dropped;
        let parent = droppedOver
        dispatch(handleRedux("CHANGE_FILE_PARENT", {id, parent: [parent]}));
    };
    return (
        <>
            <Link to={path}>
                <ContextMenu options={options}>
                    <Draggable
                        id={item.id}
                        onDrop={handleDrop}
                    >
                        <ListItemButton
                            id={html_file_id} onClick={handleItemClick} sx={{pl}}>
                            {hasChildren && (isOpen ? <ExpandLess/> : <ExpandMore/>)}
                            <ListItemText primary={<>
                                {item.name} {item.author != profile.id && <ShareIcon size={"small"}/>}
                            </>}/>
                        </ListItemButton>
                    </Draggable>
                </ContextMenu>
            </Link>
            {hasChildren && (
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {[...item.children].map((childId, childIndex) => {
                            const childItem = data[childId];
                            if (childItem) {
                                return (
                                    <DocComponent
                                        path={path + "/" + childItem.id}
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
export default DocComponent;