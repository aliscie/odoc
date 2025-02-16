import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Collapse,
  useTheme,
  Avatar,
  Fade,
  Fab,
  Badge,
  Zoom,
  TextField,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';

const ChatDialog = forwardRef(({
  initialMessages = [],
  onChange,
  isThinking = false,
  onSubmit,
}, ref) => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState(initialMessages);
  const audioRef = useRef(new Audio('/notification.mp3'));
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    addMessage: addNewMessage,
    clearInput: () => setInputValue(''),
    focusInput: () => inputRef.current?.focus(),
    getMessages: () => messages,
  }), [messages]);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  // Only update messages when initialMessages prop changes
  useEffect(() => {
    if (JSON.stringify(initialMessages) !== JSON.stringify(messages)) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  const playNotification = useCallback(() => {
    audioRef.current.play().catch(error => {
      console.error('Error playing notification sound:', error);
    });
  }, []);

  const addNewMessage = useCallback((sender, content) => {
    const newMessage = {
      id: Date.now(),
      sender,
      content,
      timestamp: new Date(),
    };

    setMessages(prev => {
      const updatedMessages = [...prev, newMessage];
      onChange?.(updatedMessages);
      return updatedMessages;
    });

    if (sender === 'ai' && !isVisible) {
      setUnreadCount(prev => prev + 1);
      playNotification();
    }
  }, [isVisible, onChange, playNotification]);

  const handleToggleVisibility = useCallback(() => {
    setIsVisible(prev => {
      if (!prev) {
        setUnreadCount(0);
      }
      return !prev;
    });
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (inputValue.trim() && !isThinking) {
      addNewMessage('user', inputValue.trim());
      await onSubmit?.(inputValue.trim());
      setInputValue('');
    }
  }, [inputValue, isThinking, addNewMessage, onSubmit]);

  const handleKeyPress = useCallback(async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      await handleSubmit(e);
    }
  }, [handleSubmit]);

  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

  return (
    <>
      <Zoom in={!isVisible}>
        <Fab
          color="primary"
          aria-label="chat"
          onClick={handleToggleVisibility}
          sx={{
            position: 'fixed',
            right: theme.spacing(2),
            bottom: theme.spacing(10),
            zIndex: 1000,
          }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <ChatIcon />
          </Badge>
        </Fab>
      </Zoom>

      <Fade in={isVisible}>
        <Paper
          elevation={3}
          sx={{
            position: 'fixed',
            right: theme.spacing(2),
            bottom: theme.spacing(10),
            width: 320,
            maxHeight: '500px',
            borderRadius: '12px',
            overflow: 'hidden',
            zIndex: 1000,
          }}
        >
          <Box
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Chat History
            </Typography>
            <Box>
              <IconButton
                size="small"
                onClick={() => setIsExpanded(prev => !prev)}
                sx={{ color: theme.palette.primary.contrastText }}
              >
                {isExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
              </IconButton>
              <IconButton
                size="small"
                onClick={handleToggleVisibility}
                sx={{ color: theme.palette.primary.contrastText, ml: 1 }}
              >
                <ExpandMoreIcon />
              </IconButton>
            </Box>
          </Box>

          <Collapse in={isExpanded}>
            <Box
              sx={{
                height: '300px',
                overflowY: 'auto',
                p: 2,
                backgroundColor: theme.palette.background.default,
              }}
            >
              {messages.map((message) => (
                <Fade in key={message.id}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      mb: 2,
                      flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: message.sender === 'user'
                          ? theme.palette.primary.main
                          : theme.palette.secondary.main,
                      }}
                    >
                      {message.sender === 'user' ? <PersonIcon /> : <SmartToyIcon />}
                    </Avatar>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 1.5,
                        maxWidth: '70%',
                        backgroundColor: message.sender === 'user'
                          ? theme.palette.primary.light
                          : theme.palette.background.paper,
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="body2">
                        {message.content}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          mt: 0.5,
                          color: theme.palette.text.secondary,
                        }}
                      >
                        {message.timestamp?.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Typography>
                    </Paper>
                  </Box>
                </Fade>
              ))}
              <div ref={messagesEndRef} />
            </Box>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                p: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <TextField
                inputRef={inputRef}
                fullWidth
                multiline
                maxRows={4}
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isThinking}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="submit"
                        disabled={!inputValue.trim() || isThinking}
                        color="primary"
                        edge="end"
                      >
                        {isThinking ? (
                          <CircularProgress size={24} />
                        ) : (
                          <SendIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Collapse>
        </Paper>
      </Fade>
    </>
  );
});

ChatDialog.displayName = 'ChatDialog';

export default ChatDialog;
