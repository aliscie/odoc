import React, {useState} from 'react';
import List from '@mui/material/List';
import {ListSubheader} from "@mui/material";
import DocComponent from "./list_item";
import Draggable from "../../genral/draggable";
import {handleRedux} from "../../../redux/main";
import {useDispatch} from "react-redux";


export interface NestedDataItem {
    id: string;
    name: string;
    children: number[];
}


interface NestedListProps {
    title: string;
    files: Array<NestedDataItem>;
}

const NestedList: React.FC<NestedListProps> = ({files}) => {
    const [openItems, setOpenItems] = useState<number[]>([]);

    const handleClick = (index: number) => {
        if (openItems.includes(index)) {
            setOpenItems(openItems.filter((item) => item !== index));
        } else {
            setOpenItems([...openItems, index]);
        }
    };

    const dispatch = useDispatch();
    const handleDrop: any = async (dropped, droppedOver, type) => {
        dispatch(handleRedux("CHANGE_FILE_PARENT", {id: dropped, parent: []}));
    };

    return (
        <div>
            <List

                sx={{width: '100%', maxWidth: 360, margin: '5px'}}
                component="nav"
                aria-labelledby="nested-list-subheader"
            >
                <Draggable preventDragUnder={true}
                           onDrop={handleDrop}
                >
                    <div style={{height: '5px', width: '100%'}}></div>
                </Draggable>
                {files.map((item, index) => (
                    item.parent && item.parent.length == 0 && <DocComponent
                        key={item.id}
                        data={files}
                        item={item}
                        index={index}
                        openItems={openItems}
                        handleClick={handleClick}
                        isChild={false}
                    />
                ))}
                <Draggable
                    preventDragUnder={true}
                    onDrop={handleDrop}
                >
                    <div style={{height: '5px', width: '100%'}}></div>
                </Draggable>
            </List>
        </div>
    );
};

export default NestedList;
