import * as React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";

function ReleaseButton({released, onClick}: { released: boolean, onClick: () => void }) {
    const [open, setOpen] = React.useState(false);
    const [is_released, setReleased] = React.useState(released);

    const handleClick = () => {
        setOpen(true);
    };

    const handleConfirm = () => {
        setOpen(false);
        setReleased(true)
        onClick();
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <>
            <Button
                color={"success"}
                disabled={is_released}
                onClick={handleClick}
                variant="text"
                // color={released ? 'success' : 'primary'}
            >
                {released ? 'Released' : 'Release'}
            </Button>
            <Dialog open={open} onClose={handleCancel}>
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                    Are you sure you want to release?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} color="primary" autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ReleaseButton