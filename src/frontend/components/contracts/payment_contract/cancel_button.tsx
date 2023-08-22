import * as React from "react";
import {Button, Input, Typography} from "@mui/material";
import DialogOver from "../../genral/daiolog_over";
import {useSnackbar} from "notistack";
import {useDispatch, useSelector} from "react-redux";
import {Payment} from "../../../../declarations/user_canister/user_canister.did";

import CancelIcon from '@mui/icons-material/Cancel';
import {handleRedux} from "../../../redux/main";
import {actor} from "../../../App";

function CancelButton({contract}: { contract: Payment }) {
    // const [is_released, setReleased] = React.useState(contract.released);
    const {contracts} = useSelector((state: any) => state.filesReducer);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    let dispatch = useDispatch();

    async function handleCancel() {
        let loader = enqueueSnackbar(<>Canceling...<span className="loader"/></>);
        let res = await actor.cancel_payment(contract.contract_id);
        closeSnackbar(loader);
        if ('Ok' in res) {
            enqueueSnackbar("Canceled successfully", {variant: "success"});
            dispatch(handleRedux("UPDATE_CONTRACT", {id: contract.contract_id, ...contract, canceled: true}))
        } else {
            enqueueSnackbar(res.Err, {variant: "error"});
        }
    }

    const handleConfirm = () => {
        // setReleased(true)
        // onClick();
        handleCancel()
    };

    let Dialog = (props: any) => {
        return <>
            <Typography variant={'subtitle2'}>Confirmation</Typography>
            <Typography>
                Are you sure you want to cancel?
            </Typography>
            {contract.confirmed && <Typography variant={'subtitle2'}>
                Canceling a confirmed contract will reduce your trust-score
                I it commanded to request canalisation from the receiver first to avoid any effect on your trust score.
            </Typography>}

            <Input
                type="multiline" required={true}
                contentEditable placeholder={"please write your reason for cancellation"}
                variant={'caption'}/>

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
            color={"warning"}
            disabled={contract.released}
            variant="text"
            DialogContent={Dialog}>
            {!(contract.canceled || contract.released) && <CancelIcon/>}
        </DialogOver>
    );
}

export default CancelButton