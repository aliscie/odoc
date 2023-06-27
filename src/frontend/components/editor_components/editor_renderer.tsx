import SpreadSheet from "../contracts/spread_sheet";
import * as React from "react";
import MentionComponent from "./mention_component";
import PaymentContract from "../contracts/payment_contract";

export function EditorRenderer(props: any) {

    const {element, attributes = {}, children} = props;
    let Tag = element.type || "p"
    console.log('----------', {Tag, props, data: element.data})
    switch (Tag) {
        case "mention":
            // console.log({e: props.element.character.name});
            return <MentionComponent {...props}/>
        case "table":
            return <SpreadSheet {...props.element} />;
        case "payment_contract":
            return <PaymentContract {...props.element} />;
        case "accumulate_contract":
            return <SpreadSheet {...props.element} />;
        case "custom_contract":
            return <SpreadSheet {...props.element} />;
        default:
            return (<Tag
                style={{margin: 0}}
                {...props}
                placeholder={"enter somthing..."}
                {...attributes}>{children}</Tag>)
    }
}
