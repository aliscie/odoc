import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {FEChat, Message} from "../../../declarations/backend/backend.did";
import CircularProgress from '@mui/material/CircularProgress';
import SendMessageBox from "./send_message";
import MessageComponent, {FrontendMessage} from "./message";
import {Input} from "@mui/material";
import Button from "@mui/material/Button";
import GroupAvatars from "./helper_compnents/avats_list";

interface MessagesListProps {
}


function MessagesList(props: MessagesListProps) {
    const {current_file, files_content, profile} = useSelector((state: any) => state.filesReducer);
    const {current_chat_id, chats} = useSelector((state: any) => state.chatsReducer);
    const [messages, setMessages] = useState<Message[]>([]);
    const [noMessages, setNoM] = useState<boolean>(current_chat_id === "chat_id");
    const currentChat = chats.find((chat: FEChat) => chat.id === current_chat_id);
    useEffect(() => {
        if (chats && chats.length > 0 && current_chat_id !== "chat_id") {
            currentChat && setMessages(currentChat.messages || [])
            currentChat && setNoM(false)
        }
    }, [chats, current_chat_id]);
    let is_group = currentChat && currentChat.name != "private_chat";
    let is_admin = currentChat && currentChat.admins.filter((admin) => admin.id === profile.id).length > 0;

    return (
        <div>
            {is_group && is_admin ? <Input defaultValue={currentChat && currentChat.name}/> :
                <div>Group: {currentChat && currentChat.name}</div>}
            {/*{is_group && is_admin && <Button>update members</Button>}*/}
            {is_group && <GroupAvatars chat={currentChat}/>}
            {noMessages && <Button>No messages, yet.</Button>}
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
