import React, { useState } from 'react';
import List from '@mui/material/List';
import { ListSubheader } from "@mui/material";
import DocComponent from "./list_item";
import Draggable from "../../genral/draggable";
import { handleRedux } from "../../../redux/main";
import { useDispatch } from "react-redux";

export interface NestedDataItem {
  id: string;
  name: string;
  children: number[];
  parent?: number[];
}

interface NestedListProps {
  title: string;
  files: Array<NestedDataItem>;
}

const NestedList: React.FC<NestedListProps> = ({ files }) => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const handleClick = (index: number) => {
    if (openItems.includes(index)) {
      setOpenItems(openItems.filter((item) => item !== index));
    } else {
      setOpenItems([...openItems, index]);
    }
  };

  const dispatch = useDispatch();
    const handleDrop: any = async ({ draggedId, id, dragOverPosition, type, index }) => {
        if (draggedId !== id) {
            // Dispatch the action to update the parent or order
            if (dragOverPosition === 'middle') {
            dispatch(handleRedux('CHANGE_FILE_PARENT', { 
                draggedId, 
                newParentId: id, 
                position: dragOverPosition, 
                index 
            }));
            } else {
            dispatch(handleRedux('REORDER_ITEMS', { 
                draggedId, 
                id, 
                position: dragOverPosition 
            }));
            }
        }
    };

  return (
    <List
      sx={{ width: '100%', bgcolor: 'background.paper' }}
      component="nav"
      subheader={<ListSubheader component="div">Files</ListSubheader>}
    >
      {files.map((item, index) => (
        <Draggable
          index={index}
          id={item.id}
          key={item.id}
          onDrop={handleDrop}
        >
          <DocComponent
            key={item.id}
            index={index}
            data={files}
            item={item}
            openItems={openItems}
            handleClick={handleClick}
            pl={1}
          />
        </Draggable>
      ))}
    </List>
  );
};

export default NestedList;
