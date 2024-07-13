import * as React from "react";
import {useState} from "react";
import {useSnackbar} from "notistack";
import LoadingButton from '@mui/lab/LoadingButton';

interface LoaderButtonProps {
    successMessage?: string,
    onClick: any,
    children: any;
    disabled?: boolean;
}

function LoaderButton(props: LoaderButtonProps) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    let [loading, setLoading] = useState(false);

    async function handleClick() {
        setLoading(true)
        let res = props.onClick && await props.onClick()
        if ("Ok" in res) {
            props.successMessage && enqueueSnackbar(props.successMessage, {variant: "success"});
        } else {
            enqueueSnackbar(res.Err, {variant: "error"});
        }
        setLoading(false)

    }

    return (<LoadingButton
        color={props.color}
        loading={loading}
        disabled={props.disabled}
        // loadingPosition="start"
        // startIcon={<SaveIcon/>}
        onClick={handleClick}
        variant="text"

    >
        {props.children}
    </LoadingButton>)
}

export default LoaderButton;