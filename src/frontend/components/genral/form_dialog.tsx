import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Typography }from '@mui/material';

export default function FormDialog(props: { open: boolean, title: string, description: string, inputFields: any, actions: any}) {
    // const [open, setOpen] = React.useState(props.open);

    // const handleClickOpen = () => {
    //     setOpen(true);
    // };

    const handleClose = () => {
        // setOpen(false);
    };
    return (
        <Dialog
            PaperProps={{
                style: {},
            }}
            open={props.open}
            onClose={handleClose}
        >
            <Box sx={{ padding: '16px', position: 'relative' }}>
                <Typography variant="h6" component="div" sx={{ textAlign: 'center', marginBottom: '8px' }}>
                    {props.title}
                </Typography>
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                    {props.actions && props.actions[0]}
                </Box>
            </Box>
            <DialogContent>
                {props.inputFields}
            </DialogContent>
            <Box sx={{ padding: '8px 16px', display: 'flex', justifyContent: 'flex-start' }}>
                {props.actions && props.actions[1]}
            </Box>
        </Dialog>
    );
}