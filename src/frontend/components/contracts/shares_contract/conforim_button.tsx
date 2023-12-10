import * as React from "react";
import {Button, Typography} from "@mui/material";
import DialogOver from "../../genral/daiolog_over";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import {closeSnackbar, enqueueSnackbar, useSnackbar} from "notistack";
import {actor} from "../../../App";
import {logger} from "../../../dev_utils/log_data";
import {Share, SharesContract} from "../../../../declarations/user_canister/user_canister.did";

interface Props {
    share_contract_id: string,
    contract: SharesContract,
}

function ShareConfirmButton(props: Props) {
    let share: Share = props.contract.shares.find((share) => share.share_contract_id === props.share_contract_id);

    //  ------------- TODO why this render too many times ---------------- \\
    //                 console.log("Render ShareConfirmButton")
    // const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [is_confirmed, setConform] = React.useState(share && share.confirmed);

    const handleConfirm = async () => {
        let loader = enqueueSnackbar(<>Confirming...<span className="loader"/></>);
        let res = actor && await actor.conform_share(props.share_contract_id, props.contract.contract_id)
        closeSnackbar(loader);
        if ('Ok' in res) {
            enqueueSnackbar("Confirmed successfully", {variant: "success"});
            setConform(true)
        } else {
            enqueueSnackbar(res.Err, {variant: "error"});
        }
    };
    //
    let Dialog = (props: any) => {
        return <> <Typography variant={'h4'}>Confirmation</Typography>
            <Typography>
                Conforming this share contract will insure your right to receive the future payment. And means you are
                accepted this contract.
            </Typography>
            <div>
                <Button onClick={props.handleCancel} color="primary">
                    Cancel
                </Button>
                <Button onClick={async () => {
                    await handleConfirm()
                    props.handleClick()
                }} color="primary" autoFocus>
                    I accept the contract
                </Button>
            </div>
        </>
    }


    return (
        <DialogOver
            size={"small"}
            disabled={is_confirmed}
            variant="text"
            DialogContent={Dialog}>
            {is_confirmed ? <VerifiedUserIcon color={"success"}/> : "Conform"}
        </DialogOver>
    );
}

export default ShareConfirmButton