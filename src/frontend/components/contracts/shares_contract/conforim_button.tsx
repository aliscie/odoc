import * as React from "react";
import {Button, Typography} from "@mui/material";
import DialogOver from "../../genral/daiolog_over";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import {closeSnackbar, enqueueSnackbar} from "notistack";
import {actor} from "../../../App";
import {Share, SharesContract} from "../../../../declarations/user_canister/user_canister.did";

interface Props {
    share: Share,
    contract: SharesContract,
}

function ShareConfirmButton(props: Props) {

    //  ------------- TODO why this render too many times ---------------- \\
    //                 console.log("Render ShareConfirmButton")
    // const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [is_confirmed, setConform] = React.useState(props.share && props.share.confirmed);

    const handleConfirm = async () => {
        let loader = enqueueSnackbar(<>Confirming...<span className="loader"/></>);
        let res = actor && props.share && await actor.conform_share(props.contract.author, props.share.share_contract_id, props.contract.contract_id)
        closeSnackbar(loader);
        if ('Ok' in res) {
            enqueueSnackbar("Confirmed successfully", {variant: "success"});
            // let updated_contract: SharesContract = {
            //     ...props.contract,
            //     shares: props.contract.shares.map((share) => {
            //         if (share.share_contract_id === props.share_contract_id) {
            //             return {
            //                 ...share,
            //                 confirmed: true
            //             }
            //         } else {
            //             return share
            //         }
            //
            //     })
            // }
            // dispatch(handleRedux("UPDATE_CONTRACT", {contract: updated_contract}));
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