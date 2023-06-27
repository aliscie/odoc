import {handleRedux} from "../../redux/main";
import React from "react";
import {useDispatch} from "react-redux";
import {useSnackbar} from "notistack";
import InputOption from "../genral/input_option";
import {actor} from "../../backend_connect/ic_agent";
import {file_data} from "../../data_processing/data_samples";

const PaymentContract = () => {
    const dispatch = useDispatch();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const handleCreateFile = async (value: string) => {
        let loading = enqueueSnackbar(<span>Creating agreement... <span
            className={"loader"}/></span>, {variant: "info"});
        // let file_data = await backend.create_agreement(value)
        var res = await actor.create_payment_contract(value)
        let payment_contract_content = file_data[1]
        // file_data = file_data[0]
        console.log({payment_contract_content, file_data})
        // file_data.id = randomString();
        dispatch(handleRedux("ADD", {data: file_data}))
        dispatch(handleRedux("ADD_CONTENT", {id: file_data.id, content: payment_contract_content}))
        closeSnackbar(loading)
        enqueueSnackbar('New file is created!', {variant: "success"});
    };

    return (<InputOption title={"payment contract"} tooltip={"hit enter to create"} onEnter={handleCreateFile}/>)
}
export default PaymentContract