import React from 'react';
import { Box, Avatar, Paper, Typography, useTheme } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { Message } from '../types';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const theme = useTheme();
  const isUser = message.sender === 'user';

  return (
    <Box
      sx={{
        display: 'flex',
        marginBottom: 2,
        alignItems: 'flex-start',
        flexDirection: isUser ? 'row-reverse' : 'row',
      }}
    >
      <Box sx={{ margin: '0 8px' }}>
        <Avatar sx={{ 
          bgcolor: isUser ? theme.palette.primary.main : theme.palette.secondary.main 
        }}>
          {isUser ? <PersonIcon /> : <SmartToyIcon />}
        </Avatar>
      </Box>
      <Paper
        elevation={1}
        sx={{
          maxWidth: '70%',
          padding: 1.5,
          borderRadius: 2,
          wordWrap: 'break-word',
          backgroundColor: isUser 
            ? theme.palette.primary.main 
            : theme.palette.background.paper,
          color: isUser 
            ? theme.palette.primary.contrastText 
            : theme.palette.text.primary,
          borderTopRightRadius: isUser ? 0 : 2,
          borderTopLeftRadius: isUser ? 2 : 0,
        }}
      >
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {message.content}
        </Typography>
        
        {message.attachments && message.attachments.length > 0 && (
          <Box sx={{ marginTop: 1, fontSize: '12px' }}>
            <Typography variant="caption" color="textSecondary">
              Attachments: {message.attachments.join(', ')}
            </Typography>
          </Box>
        )}
        
        <Box sx={{ marginTop: 0.5, textAlign: 'right' }}>
          <Typography variant="caption" color="textSecondary" sx={{ fontSize: '12px' }}>
            {message.timestamp.toLocaleTimeString()}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default MessageItem;