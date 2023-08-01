import SpreadSheet from "../contracts/spread_sheet";
import * as React from "react";
import MentionComponent from "./mention_component";
import {Table, TableBody, TableCell, TableRow} from "@mui/material";
import ContractView from "../views/contract_view";

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
            return <TableCell {...attributes}>{children}</TableCell>
        case "mention":
            return <MentionComponent {...props}/>
        case "payment_contract":
            return <ContractView {...props.element} />;
        case "accumulate_contract":
            return <SpreadSheet {...props.element} />;
        case "custom_contract":
            return <SpreadSheet {...props.element} />;
        default:
            return null
        // return (<Tag
        //     style={{margin: 0}}
        //     {...props}
        //     placeholder={"Enter somthing or hit @ for mentions or / for inserting components"}
        //     {...attributes}>{children}</Tag>)
    }
    return null;
}
