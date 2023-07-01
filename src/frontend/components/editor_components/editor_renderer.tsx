import SpreadSheet from "../contracts/spread_sheet";
import * as React from "react";
import MentionComponent from "./mention_component";
import PaymentContract from "../contracts/payment_contract/payment_contract";
import {Table, TableBody, TableCell, TableRow} from "@mui/material";

export function EditorRenderer(props: any) {

    const {element, attributes = {}, children} = props;
    let Tag = element.type || "p"
    // console.log('----------', {Tag, props, data: element.data})
    switch (Tag) {
        case 'table':
            return (
                <Table>
                    <TableBody {...attributes}>{children}</TableBody>
                </Table>
            )
        case 'table-row':
            return <TableRow {...attributes}>{children}</TableRow>
        case 'table-cell':
            return <TableCell style={{color: "var(--color)"}} {...attributes}>{children}</TableCell>
        case "mention":
            return <MentionComponent {...props}/>
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
                placeholder={"Enter somthing or hit @ for mentions or / for inserting components"}
                {...attributes}>{children}</Tag>)
    }
}
