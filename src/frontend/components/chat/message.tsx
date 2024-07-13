import {useSelector} from "react-redux";
import useGetChats from "./use_get_chats";
import {FEChat, UserFE} from "../../../declarations/backend/backend.did";
import {ListItem, ListItemText, Tooltip, Typography} from "@mui/material";
import React from "react";
import formatTimestamp, {formatRelativeTime} from "../../utils/time";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import {Principal} from "@dfinity/principal";

export interface FrontendMessage {
    'id': string,
    'date': bigint,
    'sender': Principal,
    'seen_by': Array<Principal>,
    'message': string,
    'chat_id': string,
    'is_saving'?: boolean,
    current_chat_id?: string
}

function MessageComponent(message: FrontendMessage) {

    const {profile} = useSelector((state: any) => state.filesReducer);
    const {chats} = useSelector((state: any) => state.chatsReducer);
    let {getOther} = useGetChats()

    let curr_chat = chats.length > 0 && chats.find((chat: FEChat) => chat.id === message.current_chat_id);
    let other_user: undefined | UserFE = curr_chat && getOther(curr_chat)

    return <ListItem
        key={message.id}
        // onClick={() => dispatch(handleRedux("OPEN_CHAT", {current_chat_id: current_chat_id}))}
        alignItems="flex-start"
    >
        {/* Uncomment if you want to include an avatar */}
        {/* <ListItemAvatar>
              <Avatar alt="User Avatar" src="/static/images/avatar/1.jpg" />
            </ListItemAvatar> */}
        <ListItemText
            primary={<Typography
                sx={{display: 'inline'}}
                component="span"
                variant="body2"
                color="text.primary"
            >
                {message.sender.toString() === profile.id ? "You: " : `${other_user && other_user.name}: `}{message.message}{" "}
            </Typography>}
            secondary={
                <React.Fragment>

                    <Typography
                        sx={{display: 'inline'}}
                        component="span"
                        variant="caption"
                        color="text.secondary"
                    >
                        <Tooltip title={formatTimestamp(message.date)}>
                            {formatRelativeTime(message.date)}
                        </Tooltip>

                        {message.is_saving ? <DoneIcon fontSize="small"/> : <DoneAllIcon fontSize="small"/>}
                    </Typography>

                </React.Fragment>
            }
        />
    </ListItem>
}

export default MessageComponent;