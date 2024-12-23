import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Paper,
  Box
} from '@mui/material';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}

interface Chat {
  id: string;
  name: string;
  messages: Message[];
  members: string[];
  admins: string[];
}

interface ChatsComponentProps {
  chats: Chat[];
}

const ChatsComponent: React.FC<ChatsComponentProps> = ({ chats }) => {
  return (
    <Paper elevation={3} sx={{ maxWidth: 600, mx: 'auto', mt: 2, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Chats
      </Typography>
      <List>
        {chats.map((chat) => (
          <ListItem
            key={chat.id}
            alignItems="flex-start"
            sx={{
              mb: 1,
              '&:hover': {
                backgroundColor: 'action.hover',
                cursor: 'pointer'
              }
            }}
          >
            <ListItemAvatar>
              <Avatar>{chat.name[0].toUpperCase()}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={chat.name}
              secondary={
                <Box>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {chat.messages[chat.messages.length - 1]?.content || 'No messages'}
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    {chat.messages[chat.messages.length - 1]?.timestamp || ''}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {`${chat.members.length} members`}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ChatsComponent;
