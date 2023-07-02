import {Button, Tooltip} from "@mui/material";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {handleRedux} from "../../redux/main";
import {actor} from "../../backend_connect/ic_agent";
import {useSnackbar} from "notistack";
import {ContentNode, FileNode, StoredContract} from "../../../declarations/user_canister/user_canister.did";
import {logger} from "../../dev_utils/log_data";
import denormalize_file_contents from "../../data_processing/denormalize/denormalize_file_contents";

function ContentSave(props: any) {
    const dispatch = useDispatch();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    let {changes} = useSelector((state: any) => state.filesReducer);
    let is_files_saved = Object.keys(changes.contents).length === 0 | Object.keys(changes.contents).length === 0 | Object.keys(changes.contents).length === 0

    async function handleClick() {
        // console.log({changes})
        // logger(changes)
        let denormalized_content = denormalize_file_contents(changes.contents)

        let loading = enqueueSnackbar(<span>Creating note page... <span className={"loader"}/></span>,);

        // here reconstruct files,content_tree and contracts
        let files: Array<FileNode> = []
        let contents: Array<Array<[string, Array<[string, ContentNode]>]>> = []
        let contracts: Array<StoredContract> = []

        let res = await actor.multi_updates(files, denormalized_content, contracts);
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
            color="primary"
            variant={!is_files_saved ? "contained" : "text"}
            disabled={is_files_saved}
            onClick={handleClick}
        >
            {/*{!is_files_saved && <WarningIcon size={"small"} color={"warning"}/>}*/}
            Save
        </Button>
    </Tooltip>
}

export default ContentSave;