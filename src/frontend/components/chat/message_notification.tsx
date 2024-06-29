import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import {Avatar} from "@mui/material";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {handleRedux} from "../../redux/main";
import {FEChat, Message, User} from "../../../declarations/backend/backend.did";
import useGetChats from "./use_get_chats";
import {Principal} from "@dfinity/principal";
import {convertToBlobLink} from "../../data_processing/image_to_vec";
import {actor} from "../../App";
import MessageComponent from "./message";

// interface MessageNotificationProp {
//
// }


function MessageNotification(props: Message) {
    let {getChats, getPrivateChat} = useGetChats()

    const {profile} = useSelector((state: any) => state.filesReducer);
    const {current_chat_id, chats} = useSelector((state: any) => state.chatsReducer);
    let chat = chats.find((chat: FEChat) => chat.id === props.chat_id);


    const [sender, setSender] = React.useState<User | null>(null);
    React.useEffect(() => {
        (async () => {
            await getChats(); // TODO find a unified way to getChats maybe on app init
            // Note on app init we are making too much requests and we are loading too much data
            // not all users will need chats every day use so load chats only when needed
            if (props.sender.toString() === profile.id) {
                setSender(chat.admins[0])
            } else {
                setSender(chat.creator)
            }

        })()
    }, [chats])

    const dispatch = useDispatch();
    return <ListItem

        onClick={async () => {
            dispatch(handleRedux("OPEN_CHAT", {
                current_chat_id: props.chat_id,
                current_user: Principal.fromText(sender.id.toString())
            }))
            if (!props.seen_by.includes(Principal.fromText(profile.id))) {
                props.seen_by.push(Principal.fromText(profile.id))
                dispatch(handleRedux("UPDATE_NOTIFICATION", {message: props}))
                let res = actor && await actor.message_is_seen(props)
            }
        }}
        alignItems="flex-start">
        {sender && <ListItemAvatar>
            <Avatar alt={sender.name} src={convertToBlobLink(sender.photo)}/>
        </ListItemAvatar>}
        <MessageComponent current_chat_id={props.chat_id}  {...props}/>
    </ListItem>
}

export default MessageNotification;