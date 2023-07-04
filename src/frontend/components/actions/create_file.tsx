import {backend} from "../../backend_connect/main";
import {handleRedux} from "../../redux/main";
import React from "react";
import {useDispatch} from "react-redux";
import {useSnackbar} from "notistack";
import {file_content_sample, note_page_content, randomString} from "../../data_processing/data_samples";
import InputOption from "../genral/input_option";
import {Button} from "@mui/material";
import {FileNode} from "../../../declarations/user_canister/user_canister.did";

const CreateFile = () => {
    const dispatch = useDispatch();
    // const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const handleCreateFile = async (value: string) => {
        // let loading = enqueueSnackbar(<span>Creating note page... <span
        //     className={"loader"}/></span>, {variant: "info"});
        // let res = await backend.create_file(value)

        let id = randomString();
        let file: FileNode = {id, name: "untitled", parent: [], children: [], share_id: []};
        dispatch(handleRedux("ADD", {data: file}))
        dispatch(handleRedux("ADD_CONTENT", {id, content: file_content_sample}))
        dispatch(handleRedux("FILE_CHANGES", {id, changes: file}));
        // closeSnackbar(loading)
        // enqueueSnackbar('New file is created!', {variant: "success"});
    };


    // return (<InputOption   title={"note page"} tooltip={"hit enter to create"} onEnter={handleCreateFile}/>)
    return (<Button onClick={() => handleCreateFile("Untitled")}>New file</Button>)
}
export default CreateFile