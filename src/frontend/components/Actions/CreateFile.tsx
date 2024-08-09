import { handleRedux } from "../../redux/store/handleRedux";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import { fileContentSample, randomString } from "../../DataProcessing/dataSamples";
import {Button, Tooltip} from "@mui/material";
import {FileNode} from "../../../declarations/backend/backend.did";
import PostAddIcon from '@mui/icons-material/PostAdd';
import {AddBox} from "@mui/icons-material";

const CreateFile = () => {
    const {profile} = useSelector((state: any) => state.filesState);
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
            workspace: "Default",
        };
        dispatch(handleRedux("ADD_FILE", {new_file: file}))
        dispatch(handleRedux("ADD_CONTENT", {id, content: fileContentSample}))
        // dispatch(handleRedux("FILE_CHANGES", {change: file}));
        // closeSnackbar(loading)
        // enqueueSnackbar('New file is created!', {variant: "success"});
    };


    // return (<InputOption   title={"note page"} tooltip={"hit enter to create"} onEnter={handleCreateFile}/>)
    return (
        <Tooltip title="Create a new document" arrow>
            <Button onClick={() => handleCreateFile()}>
                <AddBox/>
            </Button>
        </Tooltip>
    );
}
export default CreateFile