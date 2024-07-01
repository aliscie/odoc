import React, {useRef} from "react";
import {handleRedux} from "../../redux/main";
import {useDispatch, useSelector} from "react-redux";
import {TextField} from "@mui/material";
import {WorkSpace} from "../../../declarations/backend/backend.did";
import {Principal} from "@dfinity/principal";
import {randomString} from "../../data_processing/data_samples";
import {actor} from "../../App";

function useCreateWorkSpace() {
    const {workspaces, profile} = useSelector((state: any) => state.filesReducer);
    const dispatch = useDispatch();

    // Initialize refs for TextField values
    const nameRef = useRef('');
    const adminsRef = useRef('');
    const membersRef = useRef('');

    // Initialize state for the Select component

    // Handler for TextField changes
    const handleChange = (ref) => (event) => {
        ref.current = event.target.value;
    };

    let new_group = <>
        <TextField name="name" label="Name" onChange={handleChange(nameRef)}/>
        <TextField disabled name="admins" label="Admins" onChange={handleChange(adminsRef)}/>
        <TextField disabled name="members" label="Members" onChange={handleChange(membersRef)}/>
        <p/>
    </>;

    // Define the top dialog properties
    let top_dialog = {
        open: true,
        handleSave: async () => {
            // let id = randomString();
            const new_workspace: WorkSpace = {
                name: nameRef.current,
                'id': randomString(),
                'files': [],
                'creator': Principal.fromText(profile.id),
                'members': [],
                'chats': [],
                'admins': [],
                // admins: adminsRef.current,
                // members: membersRef.current,
            };
            let save_work_space =   actor && await actor.save_work_space(new_workspace);
            dispatch(handleRedux("ADD_WORKSPACE", {new_workspace}))
            console.log({save_work_space});
        },
        content: new_group,
    };

    // Return the onClick function and button content
    return {
        onClick: () => dispatch(handleRedux("TOP_DIALOG", top_dialog)),
        content: "+ Create new workSpace",
    };
}

export default useCreateWorkSpace;
