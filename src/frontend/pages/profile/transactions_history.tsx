import {useSnackbar} from "notistack";
import {useDispatch, useSelector} from "react-redux";
import {actor} from "../../backend_connect/ic_agent";
import {handleRedux} from "../../redux/main";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";
import {Button, Tooltip, Typography} from "@mui/material";
import {Principal} from "@dfinity/principal";
import DeleteIcon from "@mui/icons-material/Delete";
import DialogOver from "../../components/genral/daiolog_over";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import DoneAllIcon from "@mui/icons-material/DoneAll";
import SendIcon from "@mui/icons-material/Send";
import ConfirmButton from "../../components/contracts/payment_contract/confirm_button";
import CancelButton from "../../components/contracts/payment_contract/cancel_button";


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
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const dispatch = useDispatch();

    async function handleDelete() {
        let loader = enqueueSnackbar(<>Deleting...<span className="loader"/></>);
        let res = await actor.delete_payment(props.id)
        closeSnackbar(loader);
        if ('Ok' in res) {
            enqueueSnackbar("Deleted successfully", {variant: "success"});
            dispatch(handleRedux("REMOVE_CONTRACT", {id: props.id}))
        } else {
            enqueueSnackbar(String(res.Err), {variant: "error"});
        }

    }

    let DeleteDialog = (props: any) => {
        return <> <Typography variant={'subtitle2'}>Confirmation</Typography>
            <Typography>
                Are you sure you want to delete this contract?
            </Typography>
            <div>
                <Button onClick={props.handleCancel} color="primary">
                    No
                </Button>
                <Button onClick={async () => {
                    await handleDelete()
                    props.handleClick()
                }} color="primary" autoFocus>
                    Yes
                </Button>
            </div>
        </>
    }

    let receiver_id = Principal.fromText(props.receiver.toString())
    let is_sender = profile.id == props.sender.toString();
    let is_receiver = profile.id == props.receiver.toString();
    console.log({cdfadsfdsfsd:props})
    return <ListItem key={props.id}>
        <ListItemText
            primaryTypographyProps={{style: {color: "var(--color)"}}}
            secondaryTypographyProps={{style: props.canceled ? canceled_style : normal_style}}
            primary={`Sender: ${sender}`}
            secondary={`Receiver: ${receiver}, Amount: ${props.amount} ICPs`}
        />
        {!props.released && is_sender &&
            <Tooltip title={"Click here to release contract"}><Button>Release</Button></Tooltip>}

        {!props.confirmed && is_receiver &&
            <ConfirmButton sender={props.sender.toString()} confirmed={props.confirmed} id={props.id}/>}
        {props.confirmed && <VerifiedUserIcon/>}
        {!props.confirmed && is_sender && <DialogOver
            size={"small"}
            variant="text"
            DialogContent={DeleteDialog}>
            <DeleteIcon color="error"/></DialogOver>}
        {!props.canceled && is_sender &&

            <CancelButton
                contract={props}
            />}
        {props.canceled && is_receiver && <Report/>}
    </ListItem>
}

function TransactionsHistory(props: any) {
    const {profile, friends, contracts} = useSelector((state: any) => state.filesReducer);
    // const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    // const dispatch = useDispatch();


    return (
        <List dense sx={{bgcolor: 'var(--background)', color: "var(--color)", marginTop: '5%', padding: 0}}>
            <Divider textAlign="left">Transactions history</Divider>
            {Object.keys(contracts).map((key) => {
                let transaction = contracts[key]
                return <Transaction id={key} {...transaction}/>
            })}
        </List>
    );
}

export default TransactionsHistory