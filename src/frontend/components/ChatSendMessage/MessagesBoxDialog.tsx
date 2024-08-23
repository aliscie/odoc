import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { handleRedux } from '../../redux/store/handleRedux';
import MessagesList from '../ChatNotifications/MessagesList';
import MessageDialog from '../MuiComponents/MessageDialog';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import SendMessageBox from './SendMessageBox';

interface Message {
    text: string;
    isCurrentUser: boolean;
}

const MessagesDialogBox: React.FC = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { current_chat_id } = useSelector((state: any) => state.chatsState);
    
    const [messages, setMessages] = useState<Message[]>([]);

    const isPathChats = window.location.pathname.includes('/chats');
    const isOpen = !isPathChats && Boolean(current_chat_id);

    const closeDialog = () => {
        try {
            dispatch(handleRedux('OPEN_CHAT', { current_chat_id: false }));
        } catch (error) {
            enqueueSnackbar('Failed to close the dialog', { variant: 'error' });
            console.error('Error closing dialog:', error);
        }
    };

    const handleSend = (message: string) => {
        if (message.trim()) {
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: message, isCurrentUser: true }
            ]);
        } else {
            enqueueSnackbar('Message cannot be empty', { variant: 'warning' });
        }
    };

    return (
        <MessageDialog
            open={isOpen}
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
