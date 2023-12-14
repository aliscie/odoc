import {useSnackbar} from "notistack";
import {useDispatch, useSelector} from "react-redux";
import {handleRedux} from "../../redux/main";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";
import {Button, Tooltip, Typography} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DialogOver from "../../components/genral/daiolog_over";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ConfirmButton from "../../components/contracts/payment_contract/confirm_button";
import CancelButton from "../../components/contracts/payment_contract/cancel_button";
import useGetUser from "../../utils/get_user_by_principal";
import {actor} from "../../App";


export function ContractItem(props: any) {
    let {getUser} = useGetUser();

    const {profile} = useSelector((state: any) => state.filesReducer);
    let Report = () => {
        return <Tooltip
            title={"Reporting the cancellation of this contract means you are tinging that the cancellation is mnot fair"}>
            <Button color={"warning"}>Report</Button>
        </Tooltip>
    }

    let receiver = props.receiver && getUser(props.receiver.toString());
    let sender = props.sender && getUser(props.sender.toString());

    let canceled_style = {
        textDecoration: 'line-through',
        color: "tomato"

    }
    let normal_style = {}
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

    // let receiver_id = Principal.fromText(props.receiver.toString())
    let is_sender = profile.id == props.sender && props.sender.toString();
    let is_receiver = profile.id == props.receiver && props.receiver.toString();
    return <ListItem key={props.id}>
        <ListItemText
            primaryTypographyProps={{style: {}}}
            secondaryTypographyProps={{style: props.canceled ? canceled_style : normal_style}}
            primary={`Sender: ${sender && sender.name}`}
            secondary={`Receiver: ${receiver && receiver.name}, Amount: ${props.amount} USDTs`}
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

function ContractsHistory(props: any) {
    const {contracts} = useSelector((state: any) => state.filesReducer);


    return (
        <List dense
        >
            {Object.keys(contracts).map((key) => {
                return <ContractItem id={key} {...contracts[key]}/>
            })}
        </List>
    );
}

export default ContractsHistory