import React, {useRef, useState} from "react";
import {handleRedux} from "../../redux/main";
import {useDispatch, useSelector} from "react-redux";
import {MenuItem, Select, TextField} from "@mui/material";
import MultiAutoComplete from "../genral/multi_autocompelte";
import {actor} from "../../App";
import {Chat, Message, WorkSpace} from "../../../declarations/backend/backend.did";
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
    const {all_friends, profile, workspaces} = useSelector((state: any) => state.filesReducer);

    const options = all_friends && all_friends.map((f) => {
        return {title: f.name, id: Principal.fromText(f.id)}
    });

    const dispatch = useDispatch();

    // Initialize refs for TextField values
    const nameRef = useRef('');

    const handleChange = (ref) => (event) => {
        ref.current = event.target.value;
    };

    const work_spaces = workspaces && workspaces.map((w: WorkSpace) => w.name);

    // Define the form content
    let current_user = {title: profile && profile.name, id: profile && Principal.fromText(profile.id)};
    const [admins, setAdmins] = useState([current_user]);
    const [members, setMember] = useState();
    // Define the top dialog properties
    const top_dialog = {
            open: true,
            handleSave: async () => {
                if (nameRef.current.length === 0) {
                    enqueueSnackbar("Name is required", {variant: "error"});
                    return false;
                }
                ;
                let chat_id = randomString();
                let message: Message = {
                    'id': randomString(),
                    'date': BigInt(Date.now()),
                    'sender': Principal.fromText(profile.id),
                    'seen_by': [Principal.fromText(profile.id)],
                    'message': profile.name + " Just create a new chat group named " + nameRef.current,
                    'chat_id': chat_id,
                }
                let chat: Chat = {
                    'id': chat_id,
                    'creator': Principal.fromText(profile.id),
                    'members': members.map(m => m.id),
                    'messages': [message],
                    'name': nameRef.current,
                    'admins': admins.map(a => a.id),
                    'workspace': "",
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
                <MultiAutoComplete
                    label="admins"
                    onChange={(event: any, values: any) => {
                        // TODO check profile.id in v.id.toText() of values
                        if (false) {
                            setAdmins([...values, current_user])
                        } else {
                            setAdmins(values)
                        }
                        ;

                    }}
                    value={admins}
                    options={options}
                    multiple={true}/>

                <MultiAutoComplete
                    label="members"
                    onChange={(event: any, value: any) => {
                        setMember(value)
                    }}
                    value={members}
                    options={options}
                    multiple={true}/>


                <p/>
                <Select onChange={(e) => {
                    console.log(e.target.value)
                }}>
                    {work_spaces.map((w, i) => <MenuItem key={i} value={w}>{w}</MenuItem>)}
                </Select>

            </>,
        }
    ;
    const createNewGroup = async () => {
        dispatch(handleRedux("TOP_DIALOG", top_dialog))

    }
    return {
        onClick: createNewGroup,
        content: "+ Create New Group"

    };
}

export default useCreateChatGroup;
