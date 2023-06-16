import {backend} from "../../backend_connect/main";
import {handleRedux} from "../../redux/main";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useSnackbar} from "notistack";

const CreateNote = () => {
    const dispatch = useDispatch();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const handleCreatePage = async (e: any) => {
        e.target.classList.add("disabled")
        let loading = enqueueSnackbar(<span>Creating note page... <span className={"loader"}/></span>, {variant: "info"});
        let res = await backend.create_file("new page")
        e.target.classList.remove("disabled")
        dispatch(handleRedux("ADD", {data: res}))
        closeSnackbar(loading)
        enqueueSnackbar('New file is created!', {variant: "success"});
    };

    return (<span onClick={handleCreatePage}>note page</span>)
}
export default CreateNote