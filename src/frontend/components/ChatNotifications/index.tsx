import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import GroupIcon from "@mui/icons-material/Group";
import { Principal } from "@dfinity/principal";
import { handleRedux } from "../../redux/store/handleRedux";
import { FEChat, Message, User } from "../../../declarations/backend/backend.did";
import useGetChats from "../Chat/utils/useGetChats";
import { convertToBlobLink } from "../../DataProcessing/imageToVec";
import MessageComponent from "./Message";
import { useBackendContext } from "../../contexts/BackendContext";

function ChatNotification(props: Message) {
    const { backendActor } = useBackendContext();
    const dispatch = useDispatch();
    const { getChats } = useGetChats();

    const { profile } = useSelector((state: any) => state.filesState);
    const { current_chat_id, chats } = useSelector((state: any) => state.chatsState);

    const chat = chats.find((chat: FEChat) => chat.id === props.chat_id);
    const isGroupChat = chat && chat.name !== "private_chat";
    const [sender, setSender] = useState<User | null>(null);

    useEffect(() => {
        (async () => {
            await getChats(); 
            if (props.sender.toText() === profile.id) {
                setSender(chat?.admins[0] || null);
            } else {
                setSender(chat?.creator || null);
            }
        })();
    }, [chats, getChats, props.sender, profile.id, chat]);

    const handleChatClick = async () => {
        dispatch(handleRedux("OPEN_CHAT", {
            current_chat_id: props.chat_id,
            current_user: Principal.fromText(sender?.id.toString() || "")
        }));
    
        if (!props.seen_by.includes(Principal.fromText(profile.id))) {
            props.seen_by.push(Principal.fromText(profile.id));
            dispatch(handleRedux("UPDATE_NOTIFICATION", { message: props }));
    
            if (backendActor) {
                await backendActor.message_is_seen(props);
            } else {
                console.error("backendActor is null. Unable to mark the message as seen.");
            }
        }
    };
    

    return (
        <ListItem alignItems="flex-start" onClick={handleChatClick}>
            {isGroupChat && <GroupIcon />}
            {!isGroupChat && sender && (
                <ListItemAvatar>
                    <Avatar alt={sender.name} src={convertToBlobLink(sender.photo)} />
                </ListItemAvatar>
            )}
            <MessageComponent current_chat_id={props.chat_id} {...props} />
        </ListItem>
    );
}

export default ChatNotification;
