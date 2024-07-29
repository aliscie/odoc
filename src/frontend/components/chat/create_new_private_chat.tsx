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

function useCreatePrivateChat () {
    const createNewPrivateChat = async () => {
        dispatch(handleRedux("TOP_DIALOG", top_dialog))
    }

    return {
        onClick: createNewPrivateChat,
        content: "+ Start Private Chat",
    }   

}

export default useCreatePrivateChat;
