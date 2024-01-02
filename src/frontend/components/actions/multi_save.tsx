import {Tooltip} from "@mui/material";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {handleRedux} from "../../redux/main";
import {useSnackbar} from "notistack";
import {ContentNode, FileNode, StoredContract} from "../../../declarations/user_canister/user_canister.did";
import serialize_file_contents from "../../data_processing/serialize/serialize_file_contents";
import denormalize_contract from "../../data_processing/serialize/serialize_contracts";
import {actor} from "../../App";
import {LoadingButton} from "@mui/lab";
import {logger} from "../../dev_utils/log_data";

function MultiSaveButton(props: any) {
    const dispatch = useDispatch();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    let {changes} = useSelector((state: any) => state.filesReducer);
    let is_files_saved = Object.keys(changes.contents).length === 0 && Object.keys(changes.files).length === 0 && Object.keys(changes.contracts).length === 0;
    const [loading, setLoading] = React.useState(false);

    async function handleClick() {
        setLoading(true);

        let serialized_content: Array<Array<[string, Array<[string, ContentNode]>]>> = serialize_file_contents(changes.contents)
        // This seems has no issue, so the issue probably in the backend
        // logger({
        //     serialized_content
        // })
        let contracts: Array<StoredContract> = denormalize_contract(changes.contracts);

        let loading = enqueueSnackbar(<span>Creating note page... <span className={"loader"}/></span>,);
        let files: Array<FileNode> = Object.values(changes.files);

        let delete_contracts: Array<String> = changes.delete_contracts || [];

        let res = actor && await actor.multi_updates(files, serialized_content, contracts, delete_contracts);
        closeSnackbar(loading)
        if (res.Err) {
            enqueueSnackbar(res.Err, {variant: "error"});
        } else {
            enqueueSnackbar("Saved!", {variant: "success"});
            dispatch(handleRedux("RESOLVE_CHANGES"));
        }
        setLoading(false);
    }


    let tip_for_saved = "Your changes saved to the blockchain.";
    let tip_for_changed = <span>You need to save</span>;
    return <Tooltip arrow leaveDelay={200} title={is_files_saved ? tip_for_saved : tip_for_changed}>
        <LoadingButton
            // style={{color: "var(--color)"}}
            loading={loading}
            color="warning"
            variant={!is_files_saved ? "contained" : "text"}
            disabled={is_files_saved}
            onClick={handleClick}
        >SAVE</LoadingButton>
    </Tooltip>
}

export default MultiSaveButton;