import React, { useState } from 'react';
import {Link} from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { handleRedux } from '../../redux/store/handleRedux';
import MessagesList from './MessagesList';
import MessageInput from './MessageInput';
import MessageDialog from '../genral/MessageDialog';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import SendMessageBox from './SendMessageBox';

const MessagesDialogBox = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { current_chat_id } = useSelector((state) => state.chatsState);
    const [messages, setMessages] = useState([]);
    const is_path_chats = window.location.pathname.includes('/chats');

    const closeDialog = () => {
        dispatch(handleRedux('OPEN_CHAT', { current_chat_id: false }));
    };

    const handleSend = (message) => {
        setMessages([...messages, { text: message, isCurrentUser: true }]);
    };

    return (
        <MessageDialog
            open={!is_path_chats && current_chat_id ? true : false}
            title="Messages"
            inputFields={<MessagesList messages={messages} />}
            actions={[
                <IconButton key="close" onClick={closeDialog}>
                    <CloseIcon color="action" />
                </IconButton>,
                <IconButton key="expand" component={Link} to="/chats" onClick={closeDialog}>
                    <OpenInFullIcon color="action" />
                </IconButton>
            ]}
            onClose={closeDialog}
        />
    );
};

export default MessagesDialogBox;
