import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {handleRedux} from "../../redux/main";
import {Message} from "../../../declarations/user_canister/user_canister.did";
import formatTimestamp from "../../utils/time";
import CircularProgress from '@mui/material/CircularProgress';
import {Avatar, ListItem, ListItemAvatar, ListItemText, Typography} from "@mui/material";
import SendMessageBox from "./send_message";
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import {Principal} from "@dfinity/principal";

interface MessagesListProps {
}

export interface FrontendMessage {
    'id': string,
    'date': bigint,
    'sender': Principal,
    'seen_by': Array<Principal>,
    'message': string,
    'chat_id': string,
    'is_saving'?: boolean,
}

function MessagesList(props: MessagesListProps) {
    const dispatch = useDispatch();
    const {current_chat_id, chats} = useSelector((state: any) => state.chatsReducer);
    const [messages, setMessages] = useState<Message[]>([]);
    // const [noMessages, setNoMessages] = useState(false);
    let noMessages = current_chat_id === "chat_id";
    useEffect(() => {
        if (chats && chats.length > 0 && !noMessages) {
            const currentChat = chats.find((chat: any) => chat.id === current_chat_id);
            currentChat && setMessages(currentChat.messages || [])
        }
    }, [chats, current_chat_id]);

    return (
        <div>
            {noMessages && <div>Three no messages here, yet.</div>}
            {messages.length > 0 ? (
                messages.map((message: FrontendMessage) => (
                    <ListItem
                        key={message.id}
                        // onClick={() => dispatch(handleRedux("OPEN_CHAT", {current_chat_id: current_chat_id}))}
                        alignItems="flex-start"
                        button
                    >
                        {/* Uncomment if you want to include an avatar */}
                        {/* <ListItemAvatar>
              <Avatar alt="User Avatar" src="/static/images/avatar/1.jpg" />
            </ListItemAvatar> */}
                        <ListItemText
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        sx={{display: 'inline'}}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        {message.message}
                                    </Typography>
                                    {formatTimestamp(message.date)}

                                    {message.is_saving ? <DoneIcon/> : <DoneAllIcon/>}
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                ))
            ) : (
                !noMessages && <CircularProgress/>
            )}
            <SendMessageBox/>
        </div>
    );
}

export default MessagesList;
