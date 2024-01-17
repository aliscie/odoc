import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import {Avatar, Typography} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {handleRedux} from "../../redux/main";
import SendMessageBox from "./send_message";
import {Message} from "../../../declarations/user_canister/user_canister.did";
import formatTimestamp from "../../utils/time";

interface MessageNotificationProp {

}

function MessagesList(props: MessageNotificationProp) {
    // const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {current_chat_id, current_user, chats} = useSelector((state: any) => state.chatsReducer);
    // const [chats, setChatList] = React.useState<Chat[]>(chats);

    const dispatch = useDispatch();
    console.log({
            current_chat_id
        }
    )
    let messages = current_user && chats.length > 0 && chats.find(chat => chat.id === current_chat_id)?.messages;


    let list = messages && messages.map((message: Message) => <ListItem

        onClick={() => {
            dispatch(handleRedux("OPEN_CHAT", {current_chat_id: 'chat_id'}))
        }}
        alignItems="flex-start">
        <ListItemAvatar>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg"/>
        </ListItemAvatar>
        <ListItemText
            // primary="Username"
            secondary={
                <React.Fragment>
                    <Typography
                        sx={{display: 'inline'}}
                        component="span"
                        variant="body2"
                        color="text.primary"
                    >
                        {formatTimestamp(message.date)}
                    </Typography>
                    {message.message}
                </React.Fragment>
            }
        />
    </ListItem>);

    return <div>{list}
        <SendMessageBox/>
    </div>
}

export default MessagesList;