import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { handleRedux } from '../../redux/main';
import MessagesList from './MessagesList';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import {
    IconButton,
    Box,
    Dialog,
    DialogContent,
    Typography,
} from '@mui/material';
import MessageInput from './MessageInput';

const MessagesDialog = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { current_chat_id } = useSelector((state) => state.chatsReducer);
    const [messages, setMessages] = useState([]);
    const is_path_chats = window.location.pathname.includes('/chats');

    const closeDialog = () => {
        dispatch(handleRedux('OPEN_CHAT', { current_chat_id: false }));
    };

    const handleSend = (message) => {
        setMessages([...messages, { text: message, isCurrentUser: true }]);
    };

    return (
        <Dialog
            PaperProps={{ style: {} }}
            open={!is_path_chats && current_chat_id ? true : false}
            onClose={closeDialog}
        >
            <Box sx={{ padding: '16px', position: 'relative' }}>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ textAlign: 'center', marginBottom: '8px' }}
                >
                    Messages
                </Typography>
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <IconButton onClick={closeDialog} key="close">
                        <CloseIcon color="action" />
                    </IconButton>
                    <IconButton component={Link} to="/chats" key="expand" onClick={closeDialog}>
                        <OpenInFullIcon color="action" />
                    </IconButton>
                </Box>
            </Box>
            <DialogContent sx={{ padding: 0 }}>
                <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                    <MessagesList messages={messages} />
                </Box>
            </DialogContent>
            <MessageInput onSend={handleSend} />
        </Dialog>
    );
};

export default MessagesDialog;
