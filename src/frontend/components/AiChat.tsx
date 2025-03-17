import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  CircularProgress, 
  Alert,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface AiChatProps {
  title?: string;
  initialMessages?: Message[];
  infoMessage?: string;
  loading?: boolean;
  onSendMessage: (message: string) => void;
}

// Sound notification function
const playNotificationSound = () => {
  const audio = new Audio('/notification.mp3');
  audio.play().catch(error => {
    console.warn('Failed to play notification sound:', error);
  });
};

const AiChat: React.FC<AiChatProps> = ({ 
  title = "AI Assistant", 
  initialMessages = [], 
  infoMessage = "How can I help you today?",
  loading = false,
  onSendMessage 
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const prevMessagesLengthRef = useRef(initialMessages.length);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // Play sound when assistant sends a new message
    if (messages.length > prevMessagesLengthRef.current) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.sender === 'assistant') {
        playNotificationSound();
      }
    }
    
    prevMessagesLengthRef.current = messages.length;
  }, [messages]);

  // Update messages when initialMessages prop changes
  useEffect(() => {
    setMessages(initialMessages);
    prevMessagesLengthRef.current = initialMessages.length;
  }, [initialMessages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    onSendMessage(inputMessage);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: isMobile ? 2 : 3, 
        maxWidth: '100%', 
        width: { xs: '100%', sm: '600px', md: '800px' }, 
        margin: '0 auto', 
        borderRadius: 2,
        bgcolor: theme.palette.background.paper
      }}
    >
      <Typography variant="h5" gutterBottom>{title}</Typography>
      
      {messages.length === 0 && (
        <Alert 
          severity="info" 
          sx={{ mb: 2 }}
        >
          {infoMessage}
        </Alert>
      )}
      
      <Box sx={{ 
        height: { xs: '300px', sm: '350px', md: '400px' }, 
        overflowY: 'auto', 
        mb: 2, 
        p: 1 
      }}>
        <List>
          {messages.map((message) => (
            <ListItem 
              key={message.id} 
              sx={{ 
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 1
              }}
            >
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  maxWidth: { xs: '90%', sm: '80%' },
                  backgroundColor: message.sender === 'user' 
                    ? theme.palette.primary.light 
                    : theme.palette.mode === 'dark' 
                      ? theme.palette.grey[800] 
                      : theme.palette.grey[100],
                  color: message.sender === 'user' 
                    ? theme.palette.primary.contrastText 
                    : theme.palette.text.primary
                }}
              >
                <ListItemText 
                  primary={message.content}
                  secondary={message.timestamp.toLocaleTimeString()}
                  secondaryTypographyProps={{
                    color: theme.palette.text.secondary
                  }}
                  sx={{ 
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                />
              </Paper>
            </ListItem>
          ))}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress size={24} color="primary" />
            </Box>
          )}
        </List>
        <div ref={messagesEndRef} />
      </Box>
      
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          multiline
          maxRows={isMobile ? 3 : 4}
          size="small"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleSendMessage}
                  disabled={loading || !inputMessage.trim()}
                  color="primary"
                  edge="end"
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    <SendIcon />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[300],
              },
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default AiChat;