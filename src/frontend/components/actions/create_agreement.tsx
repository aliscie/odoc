import {handleRedux} from "../../redux/main";
import React from "react";
import {useDispatch} from "react-redux";
import {file_data, payment_contract_content, randomString} from "../../data_processing/data_samples";
import {actor} from "../../backend_connect/ic_agent";

const PaymentContract = () => {
    const dispatch = useDispatch();
    // const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const handleCreateFile = async () => {
        // let loading = enqueueSnackbar(<span>Creating agreement... <span
        //     className={"loader"}/></span>, {variant: "info"});
        // let file_data = await backend.create_agreement(value)
        // var res = await actor.create_payment_contract('Untitled')
        // let payment_contract_content = file_data[1]
        // file_data = file_data[0]
        // console.log({payment_contract_content, file_data})
        file_data.id = randomString();
        dispatch(handleRedux("ADD", {data: file_data}))
        dispatch(handleRedux("ADD_CONTENT", {id: file_data.id, content: payment_contract_content}))
        // closeSnackbar(loading)
        // enqueueSnackbar('New file is created!', {variant: "success"});
    };

    // return (<InputOption title={"payment contract"} tooltip={"hit enter to create"} onEnter={handleCreateFile}/>)
    return (<span onClick={handleCreateFile}>payment contract</span>)
}
export default PaymentContract