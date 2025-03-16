import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Paper, Typography, List, ListItem, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { AnthropicAgent } from './AnthropicAgent';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [agent] = useState(() => new AnthropicAgent());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);
    
    try {
      const response = await agent.sendMessage(inputValue);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Paper elevation={2} sx={{ 
      width: '100%', 
      maxWidth: '800px', 
      margin: '0 auto', 
      p: 3, 
      borderRadius: 2 
    }}>
      <Typography variant="h5" gutterBottom>AI Assistant</Typography>
      
      <Box sx={{ 
        height: '400px', 
        overflowY: 'auto', 
        p: 2, 
        mb: 2, 
        border: '1px solid #e0e0e0', 
        borderRadius: 1 
      }}>
        <List>
          {messages.map(message => (
            <ListItem 
              key={message.id} 
              sx={{ 
                display: 'flex', 
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                p: 0.5
              }}
            >
              <Box sx={{ 
                p: 1.5, 
                borderRadius: 2, 
                maxWidth: '80%',
                bgcolor: message.sender === 'user' ? 'primary.main' : '#f5f5f5',
                color: message.sender === 'user' ? 'white' : 'text.primary',
                wordBreak: 'break-word'
              }}>
                {message.content}
              </Box>
            </ListItem>
          ))}
        </List>
        <div ref={messagesEndRef} />
      </Box>
      
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          disabled={loading}
          size="small"
        />
        <Button 
          variant="contained" 
          endIcon={<SendIcon />} 
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || loading}
        >
          Send
        </Button>
      </Box>
      
      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, color: 'text.secondary' }}>
          <CircularProgress size={16} />
          <Typography variant="body2">Thinking...</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ChatBot;