import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FEChat, Message } from '../../../declarations/backend/backend.did';
import CircularProgress from '@mui/material/CircularProgress';
import SendMessageBox from './SendMessageBox';
import MessageComponent, { FrontendMessage } from './message';
import GroupAvatars from './HelperComponent/avats_list';
import { Box, Typography, Input, Button } from '@mui/material';

interface MessagesListProps {}

const MessagesList: React.FC<MessagesListProps> = () => {
  const { current_file, files_content, profile } = useSelector((state: any) => state.filesReducer);
  const { current_chat_id, chats } = useSelector((state: any) => state.chatsReducer);
  const [messages, setMessages] = useState<Message[]>([]);
  const [noMessages, setNoM] = useState<boolean>(current_chat_id === 'chat_id');

  const currentChat = chats.find((chat: FEChat) => chat.id === current_chat_id);

  useEffect(() => {
    if (chats && chats.length > 0 && current_chat_id !== 'chat_id') {
      if (currentChat) {
        setMessages(currentChat.messages || []);
        setNoM(false);
      }
    }
  }, [chats, current_chat_id]);

  const is_group = currentChat && currentChat.name !== 'private_chat';
  const is_admin = currentChat && currentChat.admins.some((admin) => admin.id === profile.id);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {is_group && is_admin && (
        <Typography variant="subtitle1" component="div">
          <Input defaultValue={currentChat && currentChat.name} />
        </Typography>
      )}
      {is_group && <GroupAvatars chat={currentChat} />}
      {noMessages && <Button>No messages yet.</Button>}
      <Box sx={{ flex: 1, overflowY: 'auto', padding: 2 }}>
        {messages.length > 0 ? (
          messages.map((message: FrontendMessage) => (
            <MessageComponent key={message.id} current_chat_id={current_chat_id} {...message} />
          ))
        ) : (
          !noMessages && <CircularProgress />
        )}
      </Box>
    </Box>
  );
};

export default MessagesList;
