import {useSnackbar} from "notistack";
import {useDispatch, useSelector} from "react-redux";
import {actor} from "../../backend_connect/ic_agent";
import {handleRedux} from "../../redux/main";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";

function TransactionsHistory(props: any) {
    const {profile} = useSelector((state: any) => state.filesReducer);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const dispatch = useDispatch();
    if (!props.friends[0]) {
        return <></>
    }


    const transactionStyle = {
        backgroundColor: 'var(--background)',
        color: 'var(--color)',
        padding: '16px',
    };


    const transactions = [
        {id: 1, sender: profile.name, receiver: 'Bob', amount: 10, canceled: false},
        {id: 2, sender: profile.name, receiver: 'David', amount: 20, canceled: true},
        {id: 3, sender: 'Eve', receiver: profile.name, amount: 15, canceled: false},
    ];


    async function handleReject(id: string) {
        let res = await actor.cancel_friend_request(id)
        if (res.Ok) {
            enqueueSnackbar("Unfriended successfully", {variant: "success"});
        } else {
            enqueueSnackbar(res.Err, {variant: "error"});
        }
        dispatch(handleRedux("REMOVE_FRIEND_REQUEST", {id: id}))
    }

    let canceled_style = {
        textDecoration: 'line-through',
        color: "tomato"

    }
    let normal_style = {
        color: 'var(--secondary-text-color)'
    }

    return (
        <List dense sx={{bgcolor: 'var(--background)', color: "var(--color)", marginTop: '5%', padding: 0}}>
            <Divider textAlign="left">Transactions history</Divider>
            {transactions.map((transaction) => (
                <ListItem key={transaction.id}>
                    <ListItemText
                        primaryTypographyProps={{style: {color: "var(--color)"}}}
                        secondaryTypographyProps={{style: transaction.canceled ? canceled_style : normal_style}}
                        primary={`Sender: ${transaction.sender}`}
                        secondary={`Receiver: ${transaction.receiver}, Amount: ${transaction.amount} ICPs`}
                    />
                </ListItem>
            ))}
        </List>
    );
}

export default TransactionsHistory