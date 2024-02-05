import React, {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {FEChat, Message} from "../../../declarations/user_canister/user_canister.did";
import CircularProgress from '@mui/material/CircularProgress';
import SendMessageBox from "./send_message";
import MessageComponent, {FrontendMessage} from "./message";
import {Paper} from "@mui/material";
import {Popper} from "@mui/base";

interface MessagesListProps {
}


function MessagesList(props: MessagesListProps) {
    const {current_chat_id, chats} = useSelector((state: any) => state.chatsReducer);
    const [messages, setMessages] = useState<Message[]>([]);
    const [noMessages, setNoM] = useState<boolean>(current_chat_id === "chat_id");
    useEffect(() => {
        if (chats && chats.length > 0 && current_chat_id !== "chat_id") {
            const currentChat = chats.find((chat: FEChat) => chat.id === current_chat_id);
            currentChat && setMessages(currentChat.messages || [])
            currentChat && setNoM(false)
        }
    }, [chats, current_chat_id]);

    return (
        <div>
            {noMessages && <div>No messages, yet.</div>}
            <div style={{maxHeight: "200px", width: '400px', overflowY: "scroll"}}>
                {messages.length > 0 ? (
                    messages.map((message: FrontendMessage) => (
                        <MessageComponent current_chat_id={current_chat_id} {...message} />
                    ))
                ) : (
                    !noMessages && <CircularProgress/>
                )}
            </div>


            <SendMessageBox/>
        </div>
    );
}

export default MessagesList;
