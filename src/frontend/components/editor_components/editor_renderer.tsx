import * as React from "react";
import MentionComponent from "./mention_component";
import {Table, TableBody, TableCell, TableRow} from "@mui/material";
import ContractView from "../views/contract_view";
import SharesContractComponent from "../contracts/shares_contract";
import SlateCustomContract from "../contracts/custom_contract/custom_contract";

export function EditorRenderer(props: any) {

    const {element, attributes = {}, children} = props;
    let Tag: string = element.type || "p"
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
        // case "data_grid":
        //     return <DataGrid {...props.element} />;
        case "shares_contract":
            return <SharesContractComponent {...props.element} />;
        case "custom_contract":
            return <SlateCustomContract {...props.element} />;

    }
    return (<Tag
        style={{margin: 0}}
        {...props}
        placeholder={"Enter something or hit @ for mentions or / for inserting components"}
        {...attributes}>{children}</Tag>)
}
