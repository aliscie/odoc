import {useSelector} from "react-redux";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";
import useGetUser from "../../utils/get_user_by_principal";
import PaymentOptions from "../../components/contracts/payment_contract/payment_contract_options";
import {PaymentContract, StoredContract} from "../../../declarations/user_canister/user_canister.did";
import SharesContractComponent from "../../components/contracts/shares_contract";


export function MyPaymentContract(props: PaymentContract) {
    let {getUser} = useGetUser();

    const {profile} = useSelector((state: any) => state.filesReducer);


    let receiver: any = props.receiver && getUser(props.receiver.toString());
    let sender: any = props.sender && getUser(props.sender.toString());
    sender = sender ? sender.name : "Unknown";
    receiver = receiver ? receiver.name : "Unknown";

    let canceled_style = {
        textDecoration: 'line-through',
        color: "tomato"

    }
    let normal_style = {}

    return <ListItem key={props.contract_id}>
        <ListItemText
            primaryTypographyProps={{style: {}}}
            secondaryTypographyProps={{style: props.canceled ? canceled_style : normal_style}}
            primary={`Sender: ${sender}`}
            secondary={`Receiver: ${receiver}, Amount: ${props.amount} USDTs`}
        />
        <PaymentOptions {...props}/>
    </ListItem>
}

function ContractsHistory(props: any) {
    const {contracts} = useSelector((state: any) => state.filesReducer);


    return (
        <List dense
        >
            {Object.keys(contracts).map((key) => {
                let contract: StoredContract = contracts[key];
                if (contract.PaymentContract) {
                    return <MyPaymentContract id={key} {...contract}/>
                } else if (contract.SharesContract) {
                    return <div>render share contract</div>
                    // return <SharesContractComponent id={key} {...contract}/>
                } else if (contract.CustomContract) {
                    return <div>render custom contract</div>
                } else {
                    return <div>Unknown</div>
                }
            })};

        </List>
    );
}

export default ContractsHistory