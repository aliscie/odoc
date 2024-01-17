import BasicMenu from "./genral/basic_menu";
import React from "react";
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import MessageNotification from "./chat/message_notification";


interface Props {
}

function ChatsComponent(props: Props) {
    return <BasicMenu
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        options={[
            {content: <MessageNotification/>},
            {content: <MessageNotification/>},
            {content: <MessageNotification/>},
        ]}
    >
        <ChatBubbleIcon color={"action"}/>
    </BasicMenu>
}

export default ChatsComponent;