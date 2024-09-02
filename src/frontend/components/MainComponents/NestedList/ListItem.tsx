import React from "react";
import {Link} from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import {useDispatch, useSelector} from "react-redux";
import {handleRedux} from "../../../redux/store/handleRedux";
import DeleteFile from "../../Actions/DeleteFile";
import Draggable from "../../MuiComponents/Draggable";
import ShareIcon from "@mui/icons-material/Share";
import ChangeWorkSpace from "../../Actions/ChangeWorkSpaceFile";
import ContextMenu from "../../MuiComponents/ContextMenu";
import {NestedDataItem} from "./nestList";

interface ItemProps {
    data: Record<number, NestedDataItem>;
    item: NestedDataItem;
    index: number;
    openItems: number[];
    handleClick: (index: number) => void;
    isChild?: boolean;
}

const DocComponent: React.FC<ItemProps> = ({
                                               data,
                                               item,
                                               index,
                                               openItems,
                                               handleClick,
                                               path = null,
                                               pl = 1,
                                           }) => {
    // Get the user's profile from the Redux store
    const {profile} = useSelector((state: any) => state.filesState);

    const dispatch = useDispatch();

    // Define the ID for the HTML element representing this file
    const htmlFileId = `file${item.id}`;
    const isOpen = openItems.includes(index);
    const hasChildren = item.children.length > 0;

    // Handle item click event
    const handleItemClick = () => {
        handleClick(index);
        dispatch(handleRedux("CURRENT_FILE", {file: item}));
    };

    // Construct the path for the Link component
    let itemPath = path ? path : item.id.toString();
    itemPath = itemPath.replace(/\s+/g, "_").toLowerCase().replaceAll(".", "");

    // Context menu options for the item
    const contextMenuOptions = [
        {content: <DeleteFile item={item}/>, preventClose: true},
        {content: <ChangeWorkSpace item={item}/>},
    ];

    // Handle drop event for draggable items
    const handleDrop = async ({
                                  draggedId,
                                  targetId,
                                  dragOverPosition,
                                  index,
                              }) => {
        const dragged = data[draggedId];
        const target = data[targetId];

        let parent = [targetId];
        if (dragOverPosition === "under") {
            parent = target.parent;
        } else if (dragOverPosition === "above") {
            parent = target.parent;
            index--;
        }

        dispatch(
            handleRedux("CHANGE_FILE_PARENT", {
                position: dragOverPosition,
                id: draggedId,
                parent,
                index,
            }),
        );
    };

    return (
        <>
            <Link to={itemPath}>
                <ContextMenu options={contextMenuOptions}>
                    <Draggable index={index} id={item.id} onDrop={handleDrop}>
                        <ListItemButton
                            id={htmlFileId}
                            onClick={handleItemClick}
                            sx={{pl}}
                        >
                            {hasChildren && (isOpen ? <ExpandLess/> : <ExpandMore/>)}
                            <ListItemText
                                primary={
                                    <>
                                        {item.name || "Untitled"}
                                        {profile && item.author !== profile.id && (
                                            <ShareIcon fontSize="small"/>
                                        )}
                                    </>
                                }
                            />
                        </ListItemButton>
                    </Draggable>
                </ContextMenu>
            </Link>
            {
                hasChildren && (
                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {item.children.map((childId, childIndex) => {
                                const childItem = data[childId];
                                if (childItem) {
                                    return (
                                        <DocComponent
                                            path={`${itemPath}/${childItem.id}`}
                                            key={childItem.id}
                                            data={data}
                                            item={childItem}
                                            index={index + childIndex + 1}
                                            openItems={openItems}
                                            handleClick={handleClick}
                                            pl={pl + 3}
                                        />
                                    );
                                }
                                return null;
                            })}
                        </List>
                    </Collapse>
                )
            }
        </>
    )
        ;
};

export default DocComponent;
