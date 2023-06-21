import {Chip} from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";
import SpreadSheet from "../spread_sheet/spread_sheet";
import * as React from "react";
import MentionComponent from "./mention_component";

export function EditorRenderer(props: any) {

    const {element, attributes = {}, children} = props;
    let Tag = element.type || "p"
    console.log('----------', {Tag, props, data: element.data})
    switch (Tag) {
        case "mention":
            console.log({e: props.element.character});
            return <MentionComponent {...props}/>
        case "table":
            return <SpreadSheet {...props.element} />;
        default:
            return (<Tag
                style={{margin: 0}}
                {...props}
                placeholder={"enter somthing..."}
                {...attributes}>{children}</Tag>)
    }
}
