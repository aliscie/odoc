import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import {Box, Typography, Input, Button} from "@mui/material";
import {FEChat, Message} from "../../../declarations/backend/backend.did";
import SendMessageBox from "../ChatSendMessage/SendMessageBox";
import MessageComponent from "./Message";
import GroupAvatars from "../Chat/HelperComponent/AvaterList";
import {logger} from "../../DevUtils/logData";

interface RootState {
    filesState: {
        current_file: string | null;
        files_content: any[];
        profile: { id: string };
    };
    chatsState: {
        current_chat_id: string | null;
        chats: FEChat[];
    };
}

const MessagesList: React.FC = () => {
    const {current_file, files_content, profile} = useSelector(
        (state: RootState) => state.filesState,
    );
    const {current_chat_id, chats} = useSelector(
        (state: RootState) => state.chatsState,
    );

    const [messages, setMessages] = useState<Message[]>([]);

    const currentChat = chats.find((chat) => chat.id === current_chat_id);

    useEffect(() => {
        if (currentChat) {
            setMessages(currentChat.messages || []);
        }
    }, [currentChat]);

    const isGroupChat = currentChat?.name !== "private_chat";
    const isAdmin = currentChat?.admins.some((admin) => admin.id === profile.id);

    return (
        <Box sx={{display: "flex", flexDirection: "column", height: "100%"}}>
            {isGroupChat && isAdmin && (
                <Typography variant="subtitle1" component="div">
                    <Input defaultValue={currentChat?.name || ""}/>
                </Typography>
            )}

            {isGroupChat && <GroupAvatars chat={currentChat}/>}

            <Box sx={{flex: 1, overflowY: "auto", padding: 2}}>
                {messages.length > 0 ? (
                    messages.map((message) => {
                        return <MessageComponent
                            key={message.id}
                            current_chat_id={current_chat_id!}
                            {...message}
                        />
                    })
                ) : currentChat ? (
                    <CircularProgress/>
                ) : (
                    <Button>No messages yet.</Button>
                )}
                <SendMessageBox/>
            </Box>
        </Box>
    );
};

export default MessagesList;
