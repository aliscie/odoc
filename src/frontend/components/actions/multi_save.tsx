import {Button, Tooltip} from "@mui/material";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {handleRedux} from "../../redux/main";
import {useSnackbar} from "notistack";
import {ContentNode, FileNode, StoredContract} from "../../../declarations/user_canister/user_canister.did";
import deserialize_file_contents from "../../data_processing/denormalize/denormalize_file_contents";
import denormalize_payment_contract from "../../data_processing/denormalize/denormalize_contracts";
import {actor} from "../../App";

function MultiSaveButton(props: any) {
    const dispatch = useDispatch();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    let {changes} = useSelector((state: any) => state.filesReducer);

    let is_files_saved = Object.keys(changes.contents).length === 0 && Object.keys(changes.files).length === 0 && Object.keys(changes.contracts).length === 0;

    async function handleClick() {
        let denormalized_content: Array<Array<[string, Array<[string, ContentNode]>]>> = deserialize_file_contents(changes.contents)
        let contracts: Array<StoredContract> = denormalize_payment_contract(changes.contracts);

        let loading = enqueueSnackbar(<span>Creating note page... <span className={"loader"}/></span>,);
        let files: Array<FileNode> = Object.values(changes.files);

        let delete_contracts: Array<String> = changes.delete_contracts || [];

        let res = await actor.multi_updates(files, denormalized_content, contracts, delete_contracts);
        closeSnackbar(loading)
        if (res.Err) {
            enqueueSnackbar(res.Err, {variant: "error"});
        } else {
            enqueueSnackbar("Saved!", {variant: "success"});
            dispatch(handleRedux("RESOLVE_CHANGES"));
        }
        console.log({res})

    }


    let tip_for_saved = "Your changes saved to the blockchain.";
    let tip_for_changed = <span>You need to save</span>;
    return <Tooltip arrow leaveDelay={200} title={is_files_saved ? tip_for_saved : tip_for_changed}>
        <Button
            // style={{color: "var(--color)"}}
            color="warning"
            variant={!is_files_saved ? "contained" : "text"}
            disabled={is_files_saved}
            onClick={handleClick}
        >SAVE</Button>
    </Tooltip>
}

export default MultiSaveButton;