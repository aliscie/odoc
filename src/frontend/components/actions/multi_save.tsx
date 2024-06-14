import {Tooltip} from "@mui/material";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {handleRedux} from "../../redux/main";
import {useSnackbar} from "notistack";
import {ContentNode, CPayment, FileNode, StoredContract} from "../../../declarations/backend/backend.did";
import serialize_file_contents from "../../data_processing/serialize/serialize_file_contents";
import {actor} from "../../App";
import {LoadingButton} from "@mui/lab";
import {Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button} from '@mui/material';
import {logger} from "../../dev_utils/log_data";

function MultiSaveButton(props: any) {

    const dispatch = useDispatch();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    let {changes} = useSelector((state: any) => state.filesReducer);
    let is_files_saved = Object.keys(changes.contents).length === 0 && Object.keys(changes.files).length === 0 && Object.keys(changes.contracts).length === 0;
    const [loading, setLoading] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(0);

    let serialized_content: Array<Array<[string, Array<ContentNode>]>> = serialize_file_contents(changes.contents)
    let serialized_contracts: Array<StoredContract> = Object.values(changes.contracts);
    let files: Array<FileNode> = Object.values(changes.files);
    let delete_contracts: Array<string> = changes.delete_contracts || [];


    async function confirm() {
        setOpenDialog(0);
        setLoading(true);
        let loading = enqueueSnackbar(<span>Process saving... <span className={"loader"}/></span>,);
        let res = actor && await actor.multi_updates(files, serialized_content, serialized_contracts, delete_contracts);
        setLoading(false);
        if (res.Ok.includes("Error") || res.Err) {
            enqueueSnackbar(res.Ok, {variant: "error"});
        }
        closeSnackbar(loading);
        if (res?.Err) {
            enqueueSnackbar(res.Err, {variant: "error"});
        } else {
            enqueueSnackbar("Saved!", {variant: "success"});
            dispatch(handleRedux("RESOLVE_CHANGES"));
        }
    }

    async function handleClick() {
        let total = 0;
        let payments: Array<CPayment> = [];


        // get the promoses with status.Realsed === null and push them to payments
        serialized_contracts.forEach((contract: StoredContract) => {
            if (contract.CustomContract) {
                contract.CustomContract.promises.forEach((promise: CPayment) => {
                    if (promise.status.Released === null) {
                        total += promise.amount;
                        payments.push(promise);
                    }
                });
            }
        });
        if (total > 0) {
            setOpenDialog(total);
        } else {
            await confirm();
        }
    }


    let tip_for_saved = "Your changes saved to the blockchain.";
    let tip_for_changed = <span>You need to save</span>;
    return <>

        <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(0)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Confirm"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to release {openDialog} USDT?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenDialog(0)} color="primary">
                    Cancel
                </Button>
                <Button
                    onClick={confirm}
                    color="primary" autoFocus>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>

        <Tooltip arrow leaveDelay={200} title={is_files_saved ? tip_for_saved : tip_for_changed}>
            <LoadingButton
                // style={{color: "var(--color)"}}
                loading={loading}
                color="warning"
                variant={!is_files_saved ? "contained" : "text"}
                disabled={is_files_saved}
                onClick={handleClick}
            >SAVE</LoadingButton>
        </Tooltip></>
}

export default MultiSaveButton;