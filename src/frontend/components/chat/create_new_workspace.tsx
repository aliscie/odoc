import React, {useRef} from "react";
import {handleRedux} from "../../redux/main";
import {useDispatch} from "react-redux";
import {TextField} from "@mui/material";

function useCreateWorkSpace() {
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
        <TextField name="admins" label="Admins" onChange={handleChange(adminsRef)}/>
        <TextField name="members" label="Members" onChange={handleChange(membersRef)}/>
        <p/>
    </>;

    // Define the top dialog properties
    let top_dialog = {
        open: true,
        handleSave: () => {
            const group = {
                name: nameRef.current,
                admins: adminsRef.current,
                members: membersRef.current,
            };
            console.log({group});
        },
        content: new_group,
    };

    // Return the onClick function and button content
    return {
        onClick: () => dispatch(handleRedux("TOP_DIALOG", top_dialog)),
        content: "Create WorkSpace",
    };
}

export default useCreateWorkSpace;
