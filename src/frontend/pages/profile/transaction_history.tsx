import {useSnackbar} from "notistack";
import {useDispatch, useSelector} from "react-redux";
import {handleRedux} from "../../redux/main";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";
import {useEffect} from "react";
import {Button, Divider, Tooltip, Typography} from "@mui/material";
import useGetUser from "../../utils/get_user_by_principal";
import {actor} from "../../App";
import {Exchange} from "../../../declarations/user_canister/user_canister.did";
import formatTimestamp from "../../utils/time";

export function ContractItem(props: any) {
    let date_created = formatTimestamp(props.date_created)
    const {profile} = useSelector((state: any) => state.filesReducer);
    const [users, setUsers] = React.useState<any>({sender: "Null", receiver: "Null"})

    useEffect(() => {
        (async () => {
            let receiver = await getUser(props.receiver.toString());
            let sender = "ExternalWallet" == props.sender ? {name: "ExternalWallet"} : await getUser(props.sender.toString());
            setUsers({
                sender: sender ? sender.name : "Null", receiver: receiver ? receiver.name : "Null"
            })
        })();
    }, [props.receiver, props.sender]);

    let {getUser} = useGetUser();


    let Report = () => {
        return <Tooltip
            title={"Reporting the cancellation of this contract means you are tinging that the cancellation is mnot fair"}>
            <Button color={"warning"}>Report</Button>
        </Tooltip>
    }


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

    return <ListItem key={props.id}>
        <ListItem key={props.id}>
            <ListItemText
                primaryTypographyProps={{style: {}}}
                secondaryTypographyProps={{style: props.canceled ? canceled_style : normal_style}}
                primary={`Sender: ${users.sender}`}
                secondary={
                    <div>
                        <div>Receiver: {users.receiver}</div>
                        <div>Amount: {Number(props.amount)} USDTs</div>
                        <div>Date Created: {date_created}</div>
                    </div>
                }
            />
            {props.canceled && is_receiver && <Report/>}
        </ListItem>

        <Divider/>
        {props.canceled && is_receiver && <Report/>}
    </ListItem>
}

interface TranProps {
    items: Array<Exchange>
}

function TransactionHistory(props: TranProps) {
    return (
        <List dense
        >
            {props.items.map((item: any, index: number) => {
                return <ContractItem {...item} id={index} sender={item.from} receiver={item.to}/>
            })}
        </List>
    );
}

export default TransactionHistory