import React, {useState, MouseEvent} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Tooltip
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {LoadingButton} from "@mui/lab";
import {useSnackbar} from "notistack";
import {ContentNode, CPayment, StoredContract} from "../../../declarations/backend/backend.did";
import {handleRedux} from "../../redux/store/handleRedux";
import serializeFileContents from "../../DataProcessing/serialize/serializeFileContents";
import {useBackendContext} from "../../contexts/BackendContext";

interface MultiSaveButtonProps {
}


interface MultiUpdateResponse {
    Ok?: string;
    Err?: string;
}

const MultiSaveButton: React.FC<MultiSaveButtonProps> = () => {
    const dispatch = useDispatch();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {backendActor} = useBackendContext();

    const changes = useSelector((state: any) => state.filesState.changes);

    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState<number>(0);

    const isFilesSaved =
        Object.keys(changes.contents).length === 0 &&
        changes.files.length === 0 &&
        Object.keys(changes.contracts).length === 0 &&
        changes.files_indexing.length === 0;

    const serializedContent = serializeFileContents(changes.contents);
    const serializedContracts = Object.values(changes.contracts) as StoredContract[];
    const deleteContracts = changes.delete_contracts || [];

    const confirm = async () => {
        setOpenDialog(0);
        setLoading(true);

        const loadingSnackbar = enqueueSnackbar(
            <span>Process saving... <span className="loader"/></span>
        );

        try {
            const res: MultiUpdateResponse = await backendActor?.multi_updates(
                changes.files,
                serializedContent,
                serializedContracts,
                deleteContracts,
                changes.files_indexing || []
            );

            if (res?.Ok && res.Ok.includes("Error")) {
                enqueueSnackbar(res.Ok, {variant: "error"});
            } else if (res?.Err) {
                enqueueSnackbar(res.Err, {variant: "error"});
            } else {
                enqueueSnackbar("Saved!", {variant: "success"});
                dispatch(handleRedux("RESOLVE_CHANGES"));
            }
        } catch (error) {
            console.log({'saveError': error})
            // enqueueSnackbar("An error occurred while saving", {variant: "error"});
        } finally {
            closeSnackbar(loadingSnackbar);
            setLoading(false);
        }
    };

    const handleClick = async () => {
        let total = 0;
        const payments: CPayment[] = [];

        serializedContracts.forEach((contract) => {
            if (contract.CustomContract) {
                contract.CustomContract.promises.forEach((promise) => {
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
    };

    const tipForSaved = "Your changes saved to the blockchain.";
    const tipForChanged = <span>You need to save</span>;

    return (
        <>
            <Dialog
                open={openDialog > 0}
                onClose={() => setOpenDialog(0)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Confirm</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to release {openDialog} USDT?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(0)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirm} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            <Tooltip arrow leaveDelay={200} title={isFilesSaved ? tipForSaved : tipForChanged}>
                <LoadingButton
                    loading={loading}
                    color="warning"
                    variant={!isFilesSaved ? "contained" : "text"}
                    disabled={isFilesSaved}
                    onClick={handleClick}
                >
                    SAVE
                </LoadingButton>
            </Tooltip>
        </>
    );
};

export default MultiSaveButton;
