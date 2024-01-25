import {useSelector} from "react-redux";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";
import useGetUser from "../../utils/get_user_by_principal";
import PaymentOptions from "../../components/contracts/payment_contract/payment_contract_options";


export function MyPaymentContract(props: any) {
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

    return <ListItem key={props.id}>
        <ListItemText
            primaryTypographyProps={{style: {}}}
            secondaryTypographyProps={{style: props.canceled ? canceled_style : normal_style}}
            primary={`Sender: ${sender}`}
            secondary={`Receiver: ${receiver}, Amount: ${props.amount} USDTs`}
        />
        <PaymentOptions {...props.contract}/>
    </ListItem>
}

function ContractsHistory(props: any) {
    const {contracts} = useSelector((state: any) => state.filesReducer);


    return (
        <List dense
        >
            {Object.keys(contracts).map((key) => {
                return <MyPaymentContract id={key} {...contracts[key]}/>
            })}
        </List>
    );
}

export default ContractsHistory