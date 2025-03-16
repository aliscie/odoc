import React from 'react';
import { 
  Button, TextField, Card, Divider,
  Box, useTheme
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Typography from '@mui/material/Typography';

import FileUpload from './components/FileUpload';
import MessageItem from './components/MessageItem';
import { EmptyState, LoadingIndicator } from './components/ChatUIComponents';
import { useChatLogic } from './hooks/useChatLogic';

const ChatApp: React.FC = () => {
  const {
    messages,
    inputValue,
    isLoading,
    fileList,
    messagesEndRef,
    setInputValue,
    handleSend,
    handleKeyPress,
    handleFileUpload
  } = useChatLogic();
  
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        maxWidth: '900px', 
        margin: '0 auto', 
        padding: '20px',
      }}
    >
      <Card 
        sx={{ 
          borderRadius: 2, 
          boxShadow: theme.shadows[3],
        }}
      >
        <Box sx={{ padding: 2 }}>
          <Typography variant="h5">AI Assistant Chat</Typography>
          <Divider sx={{ my: 2 }} />
          
          <Box 
            sx={{ 
              height: '500px', 
              overflowY: 'auto', 
              padding: 1, 
              marginBottom: 2, 
              backgroundColor: theme.palette.mode === 'dark' 
                ? theme.palette.background.default 
                : theme.palette.grey[50],
              borderRadius: 1,
            }}
          >
            {messages.length === 0 ? (
              <EmptyState />
            ) : (
              messages.map(msg => (
                <MessageItem key={msg.id} message={msg} />
              ))
            )}
            {isLoading && <LoadingIndicator />}
            <div ref={messagesEndRef} />
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <FileUpload 
              onChange={handleFileUpload} 
              fileList={fileList} 
            />
          </Box>
          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'flex-end', 
              gap: 1 
            }}
          >
            <TextField
              multiline
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              maxRows={4}
              fullWidth
              size="small"
              sx={{ flexGrow: 1 }}
            />
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSend}
              disabled={isLoading}
              sx={{ borderRadius: 1, minWidth: 0, p: 1 }}
            >
              <SendIcon />
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default ChatApp;