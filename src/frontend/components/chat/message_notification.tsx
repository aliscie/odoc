import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import {Avatar, Typography} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import {useDispatch} from "react-redux";
import {handleRedux} from "../../redux/main";

interface MessageNotificationProp {

}

function MessageNotification(props: MessageNotificationProp) {
    const dispatch = useDispatch();
    return <ListItem

        onClick={() => {
            dispatch(handleRedux("OPEN_CHAT", {current_chat_id: 'chat_id'}))
        }}
        alignItems="flex-start">
        <ListItemAvatar>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg"/>
        </ListItemAvatar>
        <ListItemText
            primary="Username"
            secondary={
                <React.Fragment>
                    <Typography
                        sx={{display: 'inline'}}
                        component="span"
                        variant="body2"
                        color="text.primary"
                    >
                        2023-01-01-01:40
                    </Typography>
                    {" — I'll be in your neighborhood doing errands this…"}
                </React.Fragment>
            }
        />
    </ListItem>
}

export default MessageNotification;