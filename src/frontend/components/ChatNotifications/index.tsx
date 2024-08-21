import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import {Avatar} from "@mui/material";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {FEChat, Message, User} from "../../../declarations/backend/backend.did";
import useGetChats from "../Chat/utils/useGetChats";
import {Principal} from "@dfinity/principal";
import {convertToBlobLink} from "../../DataProcessing/imageToVec";
import MessageComponent from "./message";

import GroupIcon from "@mui/icons-material/Group"
import {useBackendContext} from "../../contexts/BackendContext";
import {handleRedux} from "../../redux/store/handleRedux";

// interface MessageNotificationProp {
//
// }


function ChatNotification(props: Message) {
    let {getChats, getPrivateChat} = useGetChats()

    const {profile} = useSelector((state: any) => state.filesState);
    const {current_chat_id, chats} = useSelector((state: any) => state.chatsState);
    let chat = chats.find((chat: FEChat) => chat.id === props.chat_id);
    let is_group = chat && chat.name != "private_chat"
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
    const {backendActor} = useBackendContext();
    return <ListItem

        onClick={async () => {
            dispatch(handleRedux("OPEN_CHAT",
                {
                    current_chat_id: props.chat_id,
                    current_user: Principal.fromText(sender.id.toString())
                }
            ))
            if (!props.seen_by.includes(Principal.fromText(profile.id))) {
                props.seen_by.push(Principal.fromText(profile.id))
                dispatch(handleRedux("UPDATE_NOTIFICATION", {message: props}))
                let res = await backendActor.message_is_seen(props)
            }
        }}
        alignItems="flex-start">
        {is_group && <GroupIcon/>}
        {sender && !is_group && <ListItemAvatar>
            <Avatar alt={sender.name} src={convertToBlobLink(sender.photo)}/>
        </ListItemAvatar>}
        <MessageComponent current_chat_id={props.chat_id}  {...props}/>
    </ListItem>
}

export default ChatNotification;
