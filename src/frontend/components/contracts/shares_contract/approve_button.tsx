import * as React from "react";
import {useState} from "react";
import DialogOver from "../../genral/daiolog_over";
import {LoadingButton} from "@mui/lab";
import {actor} from "../../../App";
import {useDispatch, useSelector} from "react-redux";
import {Share} from "../../../../declarations/backend/backend.did";
import {useSnackbar} from "notistack";
import DoneAllIcon from "@mui/icons-material/DoneAll";

function ApproveButton({req, contract}: any) {
    const dispatch = useDispatch();
    const {
        files_content,
        current_file,
        all_friends,
        profile,
        contracts
    } = useSelector((state: any) => state.filesReducer);
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(req.approvals.map((item) => item.toString()).includes(profile.id));
    const [approvals, setApprovals] = useState(req.approvals.length);
    const {enqueueSnackbar} = useSnackbar();
    const handleApprove = async (option: any) => {
        setLoading(true);
        let response: undefined | { Ok: null } | { Err: string } = actor && await actor.approve_request(current_file.author, req.id, contract.contract_id);
        if ("Ok" in response) {
            setApprovals(approvals + 1);
            setDisabled(true);
            // const newContent = {
            //     ...contract,
            //     shares_requests: contract.shares_requests.map((item) => {
            //         if (item.id === req.id) {
            //             return {...item, approvals: [...item.approvals, profile.id]};
            //         }
            //         return item;
            //     }),
            // };
            //
            // dispatch(handleRedux("UPDATE_CONTENT", {id: current_file.id, content: newContent}));
        } else if (response) {
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

    let children = disabled ? <DoneAllIcon color={"success"}/> : false

    return (
        <DialogOver
            size={"small"}
            color={"success"}
            disabled={disabled}
            variant="text"
            DialogContent={Dialog}>
            {children || "Approve "} {approvals}/{all_share_holders.length}
        </DialogOver>
    );
}

export default ApproveButton