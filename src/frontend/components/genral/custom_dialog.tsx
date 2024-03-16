import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import MenuItem from "@mui/material/MenuItem";

interface Props {
    children: React.ReactNode,
    content: React.ReactNode,
    handleSave: () => void,
}

export default function CustomDialog(props: Props) {
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        props.handleSave();
        setOpen(false);
    };

    return (
        <div >
            <MenuItem onClick={() => setOpen(true)}>
                {props.children}
            </MenuItem>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{
                    sx: {width: '100%'}, // Adjust the width as needed
                }}
            >
                {props.content}
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} autoFocus>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
