import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import {Avatar, Typography} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {handleRedux} from "../../redux/main";
import {Chat, Message, User} from "../../../declarations/user_canister/user_canister.did";
import formatTimestamp from "../../utils/time";
import useGetUser from "../../utils/get_user_by_principal";
import useGetChats from "./use_get_chats";
import {Principal} from "@dfinity/principal";
import {convertToBlobLink} from "../../data_processing/image_to_vec";
import {actor} from "../../App";

// interface MessageNotificationProp {
//
// }

function MessageNotification(props: Message) {
    let {getChats, getPrivateChat} = useGetChats()

    const {profile} = useSelector((state: any) => state.filesReducer);
    const {current_chat_id, chats} = useSelector((state: any) => state.chatsReducer);
    let chat = chats.find((chat: Chat) => chat.id === props.chat_id);


    let {getUser, getUserByName} = useGetUser();
    const [sender, setSender] = React.useState<User | null>(null);
    React.useEffect(() => {
        (async () => {
            await getChats(); // TODO find a unified way to getChats maybe on app init
            // Note on app init we are making too much requests and we are loading too much data
            // not all users will need chats every day use so load chats only when needed
            if (props.sender.toString() === profile.id) {
                let user = await getUser(chat.admins[0].toString());
                setSender(user)
            } else {
                let user = await getUser(props.sender.toString());
                setSender(user)
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
                dispatch(handleRedux("UPDATE_NOTIFICATION", {message:props}))
                let res = actor && await actor.message_is_seen(props)
                console.log({res})
            }
        }}
        alignItems="flex-start">
        {sender && <ListItemAvatar>
            <Avatar alt={sender.name} src={convertToBlobLink(sender.photo)}/>
        </ListItemAvatar>}
        <ListItemText
            primary={sender && sender.name}
            secondary={
                <React.Fragment>
                    <Typography
                        sx={{display: 'inline'}}
                        component="span"
                        variant="body2"
                        color="text.primary"
                    >
                        {formatTimestamp(props.date)}
                    </Typography>
                    {props.message}
                </React.Fragment>
            }
        />
    </ListItem>
}

export default MessageNotification;