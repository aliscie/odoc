import * as React from 'react';
import MenuItem from "@mui/material/MenuItem";
import {useDispatch} from "react-redux";
import {handleRedux} from "../../redux/main";

interface Props {
    children: React.ReactNode,
    content: React.ReactNode,
    handleSave: () => void,
}

export default function CustomDialog(props: Props) {
    const [open, setOpen] = React.useState(false);
    const dispatch = useDispatch();

    // const handleClose = () => {
    //     setOpen(false);
    // };
    //
    // const handleSave = () => {
    //     props.handleSave();
    //     setOpen(false);
    // };
    // TOP_DIALOG

    return (
        <div >
            <MenuItem onClick={() => dispatch(handleRedux("TOP_DIALOG", {open: true, content: props.content, handleSave: props.handleSave}))}>
                {props.children}
            </MenuItem>
            {/*<Dialog*/}
            {/*    open={open}*/}
            {/*    onClose={handleClose}*/}
            {/*    aria-labelledby="alert-dialog-title"*/}
            {/*    aria-describedby="alert-dialog-description"*/}
            {/*    PaperProps={{*/}
            {/*        sx: {width: '100%'}, // Adjust the width as needed*/}
            {/*    }}*/}
            {/*>*/}
            {/*    {props.content}*/}
            {/*    <DialogActions>*/}
            {/*        <Button onClick={handleClose}>Cancel</Button>*/}
            {/*        <Button onClick={handleSave} autoFocus>Save</Button>*/}
            {/*    </DialogActions>*/}
            {/*</Dialog>*/}
        </div>
    );
}
