import React, {useRef, useState} from "react";
import {handleRedux} from "../../redux/main";
import {useDispatch, useSelector} from "react-redux";
import {MenuItem, Select, TextField} from "@mui/material";
import MultiAutoComplete from "../genral/multi_autocompelte";
import {actor} from "../../App";
import {Chat, Message} from "../../../declarations/user_canister/user_canister.did";
import {Principal} from "@dfinity/principal";
import {useSnackbar} from "notistack";
import {randomString} from "../../data_processing/data_samples";

interface SelectMembersProps {
    onChange: (friends: any) => void;
}

function SelectMembers(props: SelectMembersProps) {
    const {
        all_friends,
    } = useSelector((state: any) => state.filesReducer);
    const [selectedFriends, setSelectedFriends] = useState([]);
    return (<MultiAutoComplete
            onChange={(event, friends) => {
                console.log(friends);
                props.onChange(friends);
                setSelectedFriends(friends);
            }}
            value={selectedFriends}
            options={all_friends.map(friend => ({title: friend.name, id: friend.id}))}
            multiple={true}
        />
    )
}

function useCreateChatGroup() {
    const {enqueueSnackbar} = useSnackbar();
    const {current_file, files_content, profile} = useSelector((state: any) => state.filesReducer);

    const dispatch = useDispatch();

    // Initialize refs for TextField values
    const nameRef = useRef('');
    const adminsRef = useRef('');
    const membersRef = useRef('');

    // Initialize state for the Select component
    const [workspace, setWorkspace] = useState('Defualt');

    // Handler for TextField changes
    const handleChange = (ref) => (event) => {
        ref.current = event.target.value;
    };

    // Handler for Select changes
    // const handleWorkspaceChange = (event) => {
    //     console.log(event.target.value);
    //     setWorkspace(event.target.value as string);
    // };


    const workspaces = ['Workspace1', 'Workspace2', 'Workspace3']
    // Define the form content

    // Define the top dialog properties
    let top_dialog = {
            open: true,
            handleSave: async () => {
                if (nameRef.current.length === 0) {
                    enqueueSnackbar("Name is required", {variant: "error"});
                    return false;
                }

                let chat: Chat = {
                    'id': randomString(),
                    'creator': Principal.fromText(profile.id),
                    'members': [Principal.fromText(profile.id)],
                    'messages': [],
                    'name': nameRef.current,
                    'admins': [Principal.fromText(profile.id)],
                };
                let res = actor && await actor.make_new_chat_room(chat)

                if ("Ok" in res) {
                    enqueueSnackbar("Chat group created successfully", {variant: "success"});
                } else {
                    enqueueSnackbar("Error: " + res.Err, {variant: "error"});
                }
                return true;
            },
            content: <>
                <TextField name="name" label="Name" onChange={handleChange(nameRef)}/>
                <TextField name="admins" label="Admins" onChange={handleChange(adminsRef)}/>

                <p/>
                <SelectMembers onChange={(friends) => console.log(friends)}/>
                <Select onChange={(e) => {
                    console.log(e.target.value)
                }}>
                    {workspaces.map((w, i) => <MenuItem key={i} value={w}>{w}</MenuItem>)}
                </Select>

            </>,
        }
    ;
    const createNewGroup = async () => {
        dispatch(handleRedux("TOP_DIALOG", top_dialog))

    }
    return {
        onClick: createNewGroup,
        content: "Create New Group"

    };
}

export default useCreateChatGroup;
