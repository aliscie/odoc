import {backend} from "../../backend_connect/main";
import {handleRedux} from "../../redux/main";
import React from "react";
import {useDispatch} from "react-redux";
import {useSnackbar} from "notistack";
import {note_page_content} from "../../data_processing/data_samples";
import InputOption from "../genral/input_option";

const CreateNote = () => {
    const dispatch = useDispatch();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const handleCreateFile = async (value: string) => {
        let loading = enqueueSnackbar(<span>Creating note page... <span
            className={"loader"}/></span>, {variant: "info"});
        let res = await backend.create_file(value)
        console.log({res})

        dispatch(handleRedux("ADD", {data: res}))
        dispatch(handleRedux("ADD_CONTENT", {id: res.id, content: note_page_content}))
        closeSnackbar(loading)
        enqueueSnackbar('New file is created!', {variant: "success"});
    };


    return (<InputOption   title={"note page"} tooltip={"hit enter to create"} onEnter={handleCreateFile}/>)
}
export default CreateNote