import * as React from "react";
import {Button, DialogActions, DialogContent, DialogTitle, Paper, Typography} from "@mui/material";
import DialogOver from "../../genral/daiolog_over";
import SendIcon from '@mui/icons-material/Send';
import DoneAllIcon from '@mui/icons-material/DoneAll';

function ReleaseButton({released, onClick}: { released: boolean, onClick: () => void }) {
    const [is_released, setReleased] = React.useState(released);

    const handleConfirm = () => {
        setReleased(true)
        onClick();
    };

    let Dialog = (props: any) => {
        return <> <Typography variant={'subtitle2'}>Confirmation</Typography>
            <Typography>
                Are you sure you want to release?
            </Typography>
            <div>
                <Button onClick={props.handleCancel} color="primary">
                    No
                </Button>
                <Button onClick={() => {
                    handleConfirm()
                    props.handleClick()
                }} color="primary" autoFocus>
                    Yes
                </Button>
            </div>
        </>
    }


    return (
        <DialogOver
            size={"small"}
            // color={"success"}
            disabled={is_released}
            variant="text"
            DialogContent={Dialog}>
            {is_released ? <DoneAllIcon color={"success"}/> : <SendIcon/>}
        </DialogOver>
    );
}

export default ReleaseButton