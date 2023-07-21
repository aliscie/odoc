import {useState} from "react";

function Draggable(props: any) {
    let [dragging, setDragging] = useState(false);
    return (<span
        style={{
            opacity: dragging ? "0.3" : '1'
        }}
        onDragStart={(e) => {
            setDragging(true);
        }}
        onDragEnd={(e) => {
            setDragging(false);
        }}
        draggable={true}
    >{props.children}</span>)
}

export default Draggable;