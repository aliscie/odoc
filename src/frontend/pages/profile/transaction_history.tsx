import {useSnackbar} from "notistack";
import {useDispatch, useSelector} from "react-redux";
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
import ConfirmButton from "../../components/contracts/payment_contract/confirm_button";
import CancelButton from "../../components/contracts/payment_contract/cancel_button";
import useGetUser from "../../utils/get_user_by_principal";
import {logger} from "../../dev_utils/log_data";
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

    let receiver = getUser(props.receiver.toString());
    let sender = getUser(props.sender.toString());
    console.log({})

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
    let is_sender = profile.id == props.sender.toString();
    let is_receiver = profile.id == props.receiver.toString();
    console.log({cdfadsfdsfsd: props})
    return <ListItem key={props.id}>
        <ListItemText
            primaryTypographyProps={{style: {}}}
            secondaryTypographyProps={{style: props.canceled ? canceled_style : normal_style}}
            primary={`Sender: ${sender}`}
            secondary={`Receiver: ${receiver}, Amount: ${props.amount} USDTs`}
        />
        {props.canceled && is_receiver && <Report/>}
    </ListItem>
}

function TransactionHistory(props: any) {
    const {profile, friends, contracts} = useSelector((state: any) => state.filesReducer);
    let x = [
        {
            "to": "dzkul-tmusx-sms3w-yidq6-nn66u-4pikv-twz2h-yguim-g5suo-qrhmm-nae",
            "_type": {"Deposit": null},
            "date": "",
            "from": "",
            "amount": "100"
        }
    ];


    return (
        <List dense
        >
            {props.items.map((item: any, index: number) => {
                return <ContractItem {...item} id={index} sender={item.from} receiver={item.to} />
            })}
        </List>
    );
}

export default TransactionHistory