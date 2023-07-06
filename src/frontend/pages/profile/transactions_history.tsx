import {useSnackbar} from "notistack";
import {useDispatch, useSelector} from "react-redux";
import {actor} from "../../backend_connect/ic_agent";
import {handleRedux} from "../../redux/main";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";
import {Button, Tooltip} from "@mui/material";
import {Principal} from "@dfinity/principal";


function Transaction(props: any) {
    const {profile, all_friends} = useSelector((state: any) => state.filesReducer);
    let Report = () => {
        return <Tooltip
            title={"Reporting the cancellation of this contract means you are tinging that the cancellation is mnot fair"}>
            <Button color={"warning"}>Report</Button>
        </Tooltip>
    }

    function getUser(userId: string) {
        if (userId === profile.id) {
            return profile.name;
        } else {
            const friend = all_friends.find((f) => f.id == userId.toString())
            return friend ? friend.name : null;
        }
    }

    let receiver = getUser(props.receiver.toString());
    let sender = getUser(props.sender.toString());

    let canceled_style = {
        textDecoration: 'line-through',
        color: "tomato"

    }
    let normal_style = {
        color: 'var(--secondary-text-color)'
    }

    return <ListItem key={props.id}>
        <ListItemText
            primaryTypographyProps={{style: {color: "var(--color)"}}}
            secondaryTypographyProps={{style: props.canceled ? canceled_style : normal_style}}
            primary={`Sender: ${sender}`}
            secondary={`Receiver: ${receiver}, Amount: ${props.amount} ICPs`}
        />
        {!props.released && <Tooltip title={"Click here to release contract"}><Button>Release</Button></Tooltip>}
        {!props.confirmed && props.receiver !== Principal.fromText(profile.id) && <Button>Confirm</Button>}
        {!props.canceled && props.receiver === Principal.fromText(profile.id) &&
            <Button color={"warning"}>Cancel</Button>}
        {props.canceled && props.receiver !== Principal.fromText(profile.id) && <Report/>}
    </ListItem>
}

function TransactionsHistory(props: any) {

    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const dispatch = useDispatch();

    async function handleReject(id: string) {
        let res = await actor.cancel_friend_request(id)
        if (res.Ok) {
            enqueueSnackbar("Unfriended successfully", {variant: "success"});
        } else {
            enqueueSnackbar(res.Err, {variant: "error"});
        }
        dispatch(handleRedux("REMOVE_FRIEND_REQUEST", {id: id}))
    }


    return (
        <List dense sx={{bgcolor: 'var(--background)', color: "var(--color)", marginTop: '5%', padding: 0}}>
            <Divider textAlign="left">Transactions history</Divider>
            {Object.keys(props.contracts).map((key) => {
                let transaction = props.contracts[key]
                return <Transaction {...transaction}/>
            })}
        </List>
    );
}

export default TransactionsHistory