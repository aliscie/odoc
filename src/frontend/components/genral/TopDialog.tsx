import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import * as React from "react";
import {useSelector} from "react-redux";
import {useEffect} from "react";
import {LoadingButton} from "@mui/lab";

function TopDialog() {
    const {top_dialog} = useSelector((state: any) => state.filesReducer);
    // TODO why this keep re-rendring every time there are changes in the Editor?
    //     console.log({top_dialog});
    const [open, setOpen] = React.useState(top_dialog && top_dialog.open);
    useEffect(() => {
        setOpen(top_dialog && top_dialog.open);
    }, [top_dialog]);
    const handleClose = () => {
        setOpen(false);
    };
    const [loading, setLoading] = React.useState(false);
    const handleSave = async () => {
        setLoading(true);

        let res = await top_dialog.handleSave();
        setLoading(false);
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{
                sx: {width: '100%'}, // Adjust the width as needed
            }}
        >
            {top_dialog && top_dialog.content}
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <LoadingButton
                    // style={{color: "var(--color)"}}
                    loading={loading}
                    onClick={handleSave}
                >SAVE</LoadingButton>
                {/*<Button onClick={handleSave} autoFocus>Save</Button>*/}
            </DialogActions>
        </Dialog>
    );
}

export default TopDialog;