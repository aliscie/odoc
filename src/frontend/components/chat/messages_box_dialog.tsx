import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { IconButton, Box, Dialog, DialogContent, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { handleRedux } from '../../redux/main';
import MessagesList from './MessagesList';

const MessagesDialog: React.FC = () => {
  const dispatch = useDispatch();
  const { current_chat_id } = useSelector((state: any) => state.chatsReducer);
  const is_path_chats = window.location.pathname.includes('/chats');

  const closeDialog = () => {
    dispatch(handleRedux('OPEN_CHAT', { current_chat_id: false }));
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
    <DialogContent sx={{ padding: 0, height: 'calc(100vh - 128px)' }}>
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <MessagesList />
    </Box>
    </DialogContent>
    </Dialog>
);
};

export default MessagesDialog;