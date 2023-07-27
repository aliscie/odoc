import * as React from "react";
import {useState} from "react";
import {Button, Typography} from "@mui/material";
import DialogOver from "../../genral/daiolog_over";
import SendIcon from '@mui/icons-material/Send';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import {actor} from "../../../backend_connect/ic_agent";
import {useSnackbar} from "notistack";
import {Payment} from "../../../../declarations/user_canister/user_canister.did";
import {useDispatch} from "react-redux";
import {handleRedux} from "../../../redux/main";

function ReleaseButton({contract}: { contract: Payment }) {
    const [loading, setLoading] = useState(false);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const dispatch = useDispatch();

    const handleRelease = async () => {
        setLoading(true)
        let res = await actor.release_payment(contract.contract_id);
        console.log({res})
        setLoading(false)
        if ("Ok" in res) {
            let new_contract = {
                contract_id: contract.contract_id,
                canceled: false,
                released: true,
            }
            dispatch(handleRedux("UPDATE_CONTRACT", {contract: new_contract}))
        } else {
            enqueueSnackbar(res.Err, {variant: "error"})
        }

    };

    let Dialog = (props: any) => {
        return <> <Typography variant={'subtitle2'}>Confirmation</Typography>
            <Typography>
                Are you sure you want to release?
            </Typography>
            <div>
                <Button onClick={props.handleCancel} color="primary">
                    No
                </Button>
                <Button onClick={() => {
                    handleRelease()
                    props.handleClick()
                }} color="primary" autoFocus>
                    Yes
                </Button>
            </div>
        </>
    }
    let children = contract.released ? <DoneAllIcon color={"success"}/> : <SendIcon/>
    return (
        <DialogOver
            size={"small"}
            // color={"success"}
            disabled={contract.released}
            variant="text"
            DialogContent={Dialog}>
            {loading ? <span className={"loader"}></span> : children}

        </DialogOver>
    );
}

export default ReleaseButton