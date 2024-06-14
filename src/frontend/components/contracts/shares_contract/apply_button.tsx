import * as React from "react";
import {useState} from "react";
import DialogOver from "../../genral/daiolog_over";
import {LoadingButton} from "@mui/lab";
import {actor} from "../../../App";
import {useDispatch, useSelector} from "react-redux";
import {Share, SharesContract, StoredContract} from "../../../../declarations/backend/backend.did";
import {handleRedux} from "../../../redux/main";
import {useSnackbar} from "notistack";

function ApplyButton({setData, props, req, id, contract}: any) {
    // let {} = useSharesRequests()
    const dispatch = useDispatch();

    let all_share_holders = [];
    req.shares.map((share: Share) => {
        if (!all_share_holders.includes(share.receiver.toString())) {
            all_share_holders.push(share.receiver.toString());
        }
    })


    const {
        files_content,
        current_file,
        all_friends,
        profile,
        contracts
    } = useSelector((state: any) => state.filesReducer);
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(req.is_applied);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const handleApprove = async (option: any) => {
        setLoading(true);

        let response = actor && await actor.apply_request(id, contract.contract_id, contract.author)
        setLoading(false);

        if ("Ok" in response) {
            setDisabled(true);
        } else if (response) {
            enqueueSnackbar(response.Err, {variant: "error"});
        }

        let new_contract: SharesContract = {
            ...contracts[props.children[0].id],
            shares: req.shares,
            shares_requests: contracts[props.children[0].id].shares_requests.map((item) => {
                if (item.id === req.id) {
                    return {...item, is_applied: true};
                }
                return item;
            }),
        };
        let stored_contract: StoredContract = {"SharesContract": new_contract}
        dispatch(handleRedux("UPDATE_CONTRACT", {contract: stored_contract}));
    }

    let Dialog = (props: any) => {
        return <>
            <LoadingButton
                onClick={handleApprove}
                loading={loading}
            >Apply now</LoadingButton>
        </>
    }
    return (
        <DialogOver
            size={"small"}
            color={"success"}
            disabled={disabled}
            variant="text"
            DialogContent={Dialog}
        >Apply</DialogOver>
    );
}

export default ApplyButton