import * as React from "react";
import {Button, Typography} from "@mui/material";
import DialogOver from "../../genral/daiolog_over";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import {useSnackbar} from "notistack";
import {actor} from "../../../App";

function ConfirmButton({
                           confirmed,
                           onClick,
                           sender,
                           id
                       }: { confirmed: boolean, onClick: () => void, sender: string, id: string }) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [is_confirmed, setConform] = React.useState(confirmed);

    const handleConfirm = async () => {
        let loader = enqueueSnackbar(<>Confirming...<span className="loader"/></>);
        let res = actor && await actor.conform_payment(id)
        closeSnackbar(loader);
        if ('Ok' in res) {
            enqueueSnackbar("Confirmed successfully", {variant: "success"});
            setConform(true)
            onClick();
        } else {
            enqueueSnackbar(res.Err, {variant: "error"});
        }
    };

    let Dialog = (props: any) => {
        return <> <Typography variant={'h4'}>Conformation</Typography>
            <Typography>
                Conforming this contract will insure your right to receive the future payment. And means you are
                accepted this contract.
            </Typography>
            <div>
                <Button onClick={props.handleCancel} color="primary">
                    Cancel
                </Button>
                <Button onClick={async () => {
                    await handleConfirm()
                    props.handleClick()
                }} color="primary" autoFocus>
                    I accept the contract
                </Button>
            </div>
        </>
    }


    return (
        <DialogOver
            size={"small"}
            disabled={is_confirmed}
            variant="text"
            DialogContent={Dialog}>
            {is_confirmed ? <VerifiedUserIcon color={"success"}/> : "Conform"}
        </DialogOver>
    );
}

export default ConfirmButton