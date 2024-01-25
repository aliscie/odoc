import {PaymentContract} from "../../../../declarations/user_canister/user_canister.did";
import {useDispatch, useSelector} from "react-redux";
import {Button, Input, Tooltip, Typography} from "@mui/material";
import * as React from "react";
import {actor} from "../../../App";
import {handleRedux} from "../../../redux/main";
import {useSnackbar} from "notistack";
import DeleteIcon from "@mui/icons-material/Delete";
import DialogOver from "../../genral/daiolog_over";
import CancelButton from "./cancel_button";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ReleaseButton from "./release_button";

function PaymentOptions(payment: PaymentContract) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const dispatch = useDispatch();

    async function handleDelete() {
        let loader = enqueueSnackbar(<>Deleting...<span className="loader"/></>);
        let res = actor && await actor.delete_payment(props.id)
        closeSnackbar(loader);
        if ('Ok' in res) {
            enqueueSnackbar("Deleted successfully", {variant: "success"});
            dispatch(handleRedux("REMOVE_CONTRACT", {id: props.id}))
        } else {
            enqueueSnackbar(String(res.Err), {variant: "error"});
        }

    }

    let objectionRef = React.useRef("")

    async function handleObject() {
        let loader = enqueueSnackbar(<>Deleting...<span className="loader"/></>);
        let res = actor && await actor.object_payment(payment.contract_id, objectionRef.current);
        closeSnackbar(loader);
        if ('Ok' in res) {
            enqueueSnackbar("Than you for your report", {variant: "success"});
            // dispatch(handleRedux("REMOVE_CONTRACT", {id: payment.contract_id}))
        } else {
            enqueueSnackbar(String(res.Err), {variant: "error"});
        }

    }

    let ObjectDialog = (props: any) => {
        return <> <Typography variant={'subtitle2'}>Confirmation</Typography>
            <Typography>
                This payment is not released yet. Are you sure you want to object on that? If you think it had to be
                released you can object to notify the user and show it on his profile for the community. Please remember
                to be mindfully about your division this may negatively impact the sender.
            </Typography>
            <div>
                <Button onClick={props.handleCancel} color="primary">
                    No
                </Button>
                <Input onChange={(e) => objectionRef.current = e.target.value} placeholder={"Reason"}/>
                <Button onClick={async () => {
                    await handleObject()
                    props.handleClick()
                }} color="primary" autoFocus>
                    Yes
                </Button>
            </div>
        </>
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

    const {profile} = useSelector((state: any) => state.filesReducer);
    console.log({payment});
    if (payment.receiver && profile.id == payment.receiver.toString()) {
        if (!payment.confirmed && !payment.released) {
            return <div>
                Conform button
            </div>
        } else if (!payment.released) {
            return <DialogOver
                size={"small"}
                variant="text"
                DialogContent={ObjectDialog}>Object</DialogOver>
        }
    } else if (profile.id == payment.sender.toString()) {
        if (!payment.confirmed) {
            return <div>
                <CancelButton
                    contract={payment}
                />
                <Button color="primary">Release</Button>
                <DialogOver
                    size={"small"}
                    variant="text"
                    DialogContent={DeleteDialog}>
                    <DeleteIcon color="error"/></DialogOver>
            </div>
        } else {
            return <ReleaseButton contract={payment}/>
        }
    }

    if (payment.released) {
        return <Tooltip title={"This payment has been released"}>
            <DoneAllIcon color={"success"}/>
        </Tooltip>
    }
    console.error({payment});
    return <div>False</div>
}

export default PaymentOptions