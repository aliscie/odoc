import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FEChat, Message } from '../../../declarations/backend/backend.did';
import CircularProgress from '@mui/material/CircularProgress';
import SendMessageBox from '../ChatSendMessage/SendMessageBox';
import MessageComponent, { FrontendMessage } from './Message';
import GroupAvatars from '../Chat/HelperComponent/AvatsList';
import { Box, Typography, Input, Button } from '@mui/material';

interface MessagesListProps {}

const MessagesList: React.FC<MessagesListProps> = () => {
  const { current_file, files_content, profile } = useSelector((state: any) => state.filesState)
  const { current_chat_id, chats } = useSelector((state: any) => state.chatsState)
  const [messages, setMessages] = useState<Message[]>([]);

  const currentChat = chats.find((chat: FEChat) => chat.id === current_chat_id);

  useEffect(() => {
    if (chats && chats.length > 0 && current_chat_id !== 'chat_id') {
      if (currentChat) {
        setMessages(currentChat.messages || []);
      }
    }
  }, [chats, current_chat_id]);

  const isGroup = currentChat && currentChat.name !== 'private_chat';
  const isAdmin = currentChat && currentChat.admins.some((admin) => admin.id === profile.id);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {isGroup && isAdmin && (
        <Typography variant="subtitle1" component="div">
          <Input defaultValue={currentChat && currentChat.name} />
        </Typography>
      )}
      {isGroup && <GroupAvatars chat={currentChat} />}
      {messages.length === 0 && <Button>No messages yet.</Button>}
      <Box sx={{ flex: 1, overflowY: 'auto', padding: 2 }}>
        {messages.length > 0 ? (
          messages.map((message: Message) => (
            <MessageComponent key={message.id} current_chat_id={current_chat_id} {...message} />
          ))
        ) : (
          <CircularProgress />
        )}
      </Box>
    </Box>
  );
};

export default MessagesList;