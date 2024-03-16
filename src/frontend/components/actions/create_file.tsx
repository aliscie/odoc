import {handleRedux} from "../../redux/main";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {file_content_sample, randomString} from "../../data_processing/data_samples";
import {Button, Tooltip} from "@mui/material";
import {FileNode} from "../../../declarations/user_canister/user_canister.did";
import PostAddIcon from '@mui/icons-material/PostAdd';

const CreateFile = () => {
    const {profile} = useSelector((state: any) => state.filesReducer);
    const dispatch = useDispatch();
    // const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const handleCreateFile = async () => {
        // let loading = enqueueSnackbar(<span>Creating note page... <span
        //     className={"loader"}/></span>, {variant: "info"});
        // let res = await backend.create_file(value)

        let id = randomString();
        let file: FileNode = {
            id,
            name: "Untitled",
            parent: [],
            children: [],
            share_id: [],
            author: profile.id,
            users_permissions: [],
            permission: {'None': null},
            content_id: [],
        };
        dispatch(handleRedux("ADD_FILE", {data: file}))
        dispatch(handleRedux("ADD_CONTENT", {id, content: file_content_sample}))
        dispatch(handleRedux("FILE_CHANGES", {changes: file}));
        // closeSnackbar(loading)
        // enqueueSnackbar('New file is created!', {variant: "success"});
    };


    // return (<InputOption   title={"note page"} tooltip={"hit enter to create"} onEnter={handleCreateFile}/>)
    return (
        <Tooltip title="Create a new document" arrow>
            <Button onClick={() => handleCreateFile()}>
                <PostAddIcon/>
            </Button>
        </Tooltip>)
}
export default CreateFile