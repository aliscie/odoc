import React, {useState} from 'react';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Button from '@mui/material/Button';
import {useDispatch, useSelector} from "react-redux";
import {Message} from "../../../declarations/user_canister/user_canister.did";
import {Principal} from "@dfinity/principal";
import {randomString} from "../../data_processing/data_samples";
import {actor} from "../../App";
import {useSnackbar} from "notistack";
import {handleRedux} from "../../redux/main";


export default function SendMessageBox() {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {current_chat_id, current_user} = useSelector((state: any) => state.chatsReducer);
    const {profile} = useSelector((state: any) => state.filesReducer);

    const [message, setMessage] = useState('');
    const dispatch = useDispatch();


    const handleInputChange = (event) => {
        setMessage(event.target.value);
    };

    const handleSendClick = async () => {
        // Handle sending the message (you can add your logic here)
        let new_message: Message = {
            'id': randomString(),
            'date': BigInt(0),
            'sender': Principal.fromText(profile.id),
            'seen_by': [],
            'message': message,
            'chat_id': current_chat_id,
        }
        let res: undefined | { Ok: string } | { Err: string } = actor && await actor.send_message([current_user], new_message);
        // TODO use ws.send_message in addition to actor.send_message because that would be faster.
        if ("Err" in res) {
            enqueueSnackbar("Error sending message: " + res.Err, {variant: "error"});
        } else {

            dispatch(handleRedux("SEND_MESSAGE", {message: new_message}))
        }
        // Clear the input field after sending the message
        setMessage('');
    };

    return (
        <div>
            <TextareaAutosize
                rowsMin={4}
                placeholder="Type your message here..."
                value={message}
                onChange={handleInputChange}
                style={{width: '100%'}}
            />
            <br/>
            <Button variant="contained" color="primary" onClick={handleSendClick}>
                Send
            </Button>
        </div>
    );
}
