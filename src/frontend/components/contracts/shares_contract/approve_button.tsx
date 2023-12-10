import * as React from "react";
import {useState} from "react";
import DialogOver from "../../genral/daiolog_over";
import {LoadingButton} from "@mui/lab";
import {actor} from "../../../App";
import {useSelector} from "react-redux";
import {Share} from "../../../../declarations/user_canister/user_canister.did";
import {useSnackbar} from "notistack";

function ApproveButton({req, id, contract}: any) {
    const {
        files_content,
        current_file,
        all_friends,
        profile,
        contracts
    } = useSelector((state: any) => state.filesReducer);
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(req.approvals.map((item) => item.toString()).includes(profile.id));
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const handleApprove = async (option: any) => {
        setLoading(true);
        let response = actor && await actor.approve_request([req.id], contract.contract_id);
        // logger({response});
        if ("Ok" in response) {
            setDisabled(true);
        } else {
            enqueueSnackbar(response.Err, {variant: "error"});
        }

        setLoading(false);
    }
    let all_share_holders = [];
    req.shares.map((share: Share) => {
        if (!all_share_holders.includes(share.receiver.toString())) {
            all_share_holders.push(share.receiver.toString());
        }
    })
    let Dialog = (props: any) => {
        return <>
            <LoadingButton
                onClick={handleApprove}
                loading={loading}
                // onClick={async () => await handlePay(option)}
            >Approve now</LoadingButton>
        </>
    }
    // let children = contract.released ? <DoneAllIcon color={"success"}/> : <SendIcon/>
    return (
        <DialogOver
            size={"small"}
            color={"success"}
            disabled={disabled}
            variant="text"
            DialogContent={Dialog}>
            Approve {" " + req.approvals.length}/{all_share_holders.length}
            {/*{loading ? <span className={"loader"}></span> : children}*/}

        </DialogOver>
    );
}

export default ApproveButton