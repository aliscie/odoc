import BasicMenu from "./genral/basic_menu";
import React, {useEffect} from "react";
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import MessageNotification from "./chat/message_notification";
import CircularProgress from '@mui/material/CircularProgress';
import {Message} from "../../declarations/backend/backend.did";
import {useDispatch, useSelector} from "react-redux";
import {handleRedux} from "../redux/main";
import {actor} from "../App";
import {Badge} from "@mui/base";
import Button from "@mui/material/Button";
import useCreateChatGroup from "./chat/create_new_group";


interface Props {
}

function ChatsComponent(props: Props) {
    let chat_group = useCreateChatGroup();
    // console.log({"messages"})// TODO this render like 30 times
    const {profile} = useSelector((state: any) => state.filesReducer);
    let dispatch = useDispatch();

    const {chats_notifications} = useSelector((state: any) => state.chatsReducer);
    const [loading, setLoading] = React.useState(false);
    const [messages, setMessages] = React.useState(chats_notifications);
    useEffect(() => {
        (async () => {
            if (!chats_notifications || chats_notifications.length === 0) {
                setLoading(true)
                let res = actor && await actor.get_chats_notifications();
                res && setMessages(res)
                dispatch(handleRedux('SET_CHATS_NOTIFICATIONS', {messages: res}));
                setLoading(false)
            } else {
                setMessages(chats_notifications)
            }
        })()
    }, [chats_notifications]);

    let options: any = [
        {...chat_group}
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

    let not_seen_message = messages.filter((m: Message) => !m.seen_by.some(u => u.toString() === profile.id))

    return <BasicMenu
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
        <Badge
            key={not_seen_message.length} // Add key prop to force re-render
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}

            badgeContent={not_seen_message.length}
        ><ChatBubbleIcon color={not_seen_message.length > 0 ? "error" : "action"}/></Badge>

    </BasicMenu>
}

export default ChatsComponent;