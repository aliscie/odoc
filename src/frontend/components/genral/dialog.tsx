import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function FormDialog(props: { open: boolean, title: string, description: string, inputFields: any, buttons: any }) {
    // const [open, setOpen] = React.useState(props.open);

    // const handleClickOpen = () => {
    //     setOpen(true);
    // };

    const handleClose = () => {
        // setOpen(false);
    };

    return (
        <div>
            <Dialog
                PaperProps={{
                    style: {
                        backgroundColor: 'var(--background-color)',
                        color: 'var(--color)',
                    },
                }}

                open={props.open} onClose={handleClose}>
                <DialogTitle>{props.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {props.description}
                    </DialogContentText>
                    {props.inputFields}
                </DialogContent>
                <DialogActions>
                    {
                        props.buttons.map(
                            (button: any) => (
                                <Button onClick={async () => {
                                    button.preventClose !== true && handleClose()
                                    button.onClick && await button.onClick()
                                }}>{button.name}</Button>
                            )
                        )
                    }
                </DialogActions>
            </Dialog>
        </div>
    );
}