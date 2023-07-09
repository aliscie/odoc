import * as React from "react";
import {useState} from "react";
import {useSnackbar} from "notistack";
import LoadingButton from '@mui/lab/LoadingButton';


function LoaderButton(props: any) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    let [loading, setLoading] = useState(false);

    async function handleClick() {
        setLoading(true)
        let res = props.onClick && await props.onClick()
        if ("Ok" in res) {
        } else {
            enqueueSnackbar(res.Err, {variant: "error"});
        }
        setLoading(false)

    }

    return (<LoadingButton
        loading={loading}
        // loadingPosition="start"
        // startIcon={<SaveIcon/>}
        onClick={handleClick}
        variant="text"
    >
        {props.children}
    </LoadingButton>)
}

export default LoaderButton;