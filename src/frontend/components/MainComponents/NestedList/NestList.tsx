import React, { useState } from 'react';
import List from '@mui/material/List';
import Draggable from "../../MuiComponents/Draggable";
import { useDispatch } from "react-redux";
import { handleRedux } from '../../../redux/store/handleRedux';
import DocComponent from "./ListItem";

export interface NestedDataItem {
    id: string;
    name: string;
    children: number[];
}

interface NestedListProps {
    title: string;
    files: NestedDataItem[];
}

const NestedList: React.FC<NestedListProps> = ({ files }) => {
    const [openItems, setOpenItems] = useState<number[]>([]);
    const dispatch = useDispatch();

    // Toggle the open/closed state of items in the list
    const handleClick = (index: number) => {
        setOpenItems(prevOpenItems =>
            prevOpenItems.includes(index)
                ? prevOpenItems.filter(item => item !== index)
                : [...prevOpenItems, index]
        );
    };

    // Handle drop events for draggable items
    const handleDrop = async ({ draggedId, dragOverPosition, index }) => {
        dispatch(handleRedux("CHANGE_FILE_PARENT", {
            position: dragOverPosition,
            index,
            id: draggedId,
            parent: [],
        }));
    };

    return (
        <div>
            <List
                sx={{ width: '100%', maxWidth: 360, margin: '5px' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
            >
                {/* Top draggable placeholder */}
                <Draggable
                    preventDragUnder={true}
                    index={0}
                    onDrop={handleDrop}
                >
                    <div style={{ height: '5px', width: '100%' }}></div>
                </Draggable>

                {/* Render root-level items in the list */}
                {files?.map((item, index) => (
                    item.parent && item.parent.length === 0 && (
                        <DocComponent
                            key={item.id}
                            data={files}
                            item={item}
                            index={index}
                            openItems={openItems}
                            handleClick={handleClick}
                            isChild={false}
                        />
                    )
                ))}

                {/* Bottom draggable placeholder */}
                <Draggable
                    preventDragUnder={true}
                    index={-1}
                    onDrop={handleDrop}
                >
                    <div style={{ height: '5px', width: '100%' }}></div>
                </Draggable>
            </List>
        </div>
    );
};

export default NestedList;
