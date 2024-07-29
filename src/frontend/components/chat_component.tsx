import BasicMenu from "./genral/basic_menu";
import React, {useState, useEffect} from "react";
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import MessageNotification from "./chat/message_notification";
import CircularProgress from '@mui/material/CircularProgress';
import {Box, Button } from "@mui/material";
import {Message} from "../../declarations/backend/backend.did";
import {useDispatch, useSelector} from "react-redux";
import {handleRedux} from "../redux/main";
import {actor} from "../App";
import {Badge} from "@mui/base";
import useCreateChatGroup from "./chat/create_new_group";
import useCreatePrivateChat from "./chat/create_new_private_chat";
import SearchBar from "./chat/search_bar";


interface Props {
}

function ChatsComponent(props: Props) {
    let chat_group = useCreateChatGroup();
    let private_chat = useCreatePrivateChat();
    // console.log({"messages"})// TODO this render like 30 times
    const {profile} = useSelector((state: any) => state.filesReducer);
    let dispatch = useDispatch();

    const {chats_notifications} = useSelector((state: any) => state.chatsReducer);
    const [loading, setLoading] = React.useState(false);
    const [messages, setMessages] = React.useState(chats_notifications);
    const [showSearch, setShowSearch] = useState(false);
    useEffect(() => {
        (async () => {
            if (chats_notifications.length === 0) {
                setLoading(true)
                let res = actor && await actor.get_chats_notifications();
                res && setMessages(res)
                dispatch(handleRedux('SET_CHATS_NOTIFICATIONS', {messages: res}));
                setLoading(false)
            } else {
                setMessages(chats_notifications)
            }
        })()
    }, []);

    let options: any = [
        {...private_chat},
        {...chat_group},   
    ]

    if (loading) {
        options.push({content: <CircularProgress/>})
    } else if (messages) {
        messages.map((message: Message) => {
            options.push({content: <MessageNotification {...message}/>})
        })
    } else {
        options.push({content: "You have no messages yet!"})
    }

    let not_seen_message = profile ? messages.filter((m: Message) => !m.seen_by.some(u => u.toString() === profile.id)) : []

    return (
        <BasicMenu
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            options={options}
        >
            <Box display="flex" alignItems="center">
                <Badge
                    onClick={() => setShowSearch(!showSearch)}
                    key={not_seen_message.length}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    badgeContent={not_seen_message.length}
                >
                    <ChatBubbleIcon color={not_seen_message.length > 0 ? "error" : "action"} />
                </Badge>
                {showSearch && <SearchBar />}
            </Box>
        </BasicMenu>
    );
}

export default ChatsComponent;