import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isCV?: boolean;
}

const JobChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [cvAnalysisResult, setCvAnalysisResult] = useState<any>(null);

  const handleSendMessage = (content: string, isCV = false) => {
    if (!content.trim()) return;
    
    const newMessage: Message = {
      id: uuidv4(),
      content,
      sender: 'user',
      isCV,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    
    if (!isCV) {
      // Simulate AI response for text messages
      setLoading(true);
      setTimeout(() => {
        const responseMessage: Message = {
          id: uuidv4(),
          content: "I'm your job assistant. I can help you with job applications and resume analysis. Upload your CV or ask me questions about job searching.",
          sender: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, responseMessage]);
        setLoading(false);
      }, 1000);
    }
  };

  const handleCVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Here you would normally process the CV file
      // For now, we'll just simulate a CV upload message
      handleSendMessage(`Uploaded CV: ${file.name}`, true);
      
      // Simulate CV analysis
      setLoading(true);
      setTimeout(() => {
        const result = {
          isComplete: Math.random() > 0.5,
          questions: ['Add more details about your skills', 'Include your education history']
        };
        
        handleCVAnalysis(result);
      }, 1500);
    }
  };

  const handleCVAnalysis = (result: any) => {
    setCvAnalysisResult(result);
    
    let responseContent = '';
    
    if (result.isComplete) {
      responseContent = "Your CV looks complete! It contains all the necessary sections and information for a strong application.";
    } else if (result.questions && result.questions.length > 0) {
      responseContent = "I've analyzed your CV and found some areas that could be improved:\n\n" + 
        result.questions.map((q: string, i: number) => `${i+1}. ${q}`).join('\n\n');
    } else if (result.error) {
      responseContent = `There was an error analyzing your CV: ${result.error}`;
    }
    
    const responseMessage: Message = {
      id: uuidv4(),
      content: responseContent,
      sender: 'assistant',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, responseMessage]);
    setLoading(false);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, maxWidth: '800px', margin: '0 auto', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>Job Application Assistant</Typography>
      
      {messages.length === 0 && (
        <Alert 
          severity="info" 
          sx={{ mb: 2 }}
        >
          Upload your CV for analysis or ask questions about job applications and career advice.
        </Alert>
      )}
      
      <Box sx={{ height: '400px', overflowY: 'auto', mb: 2, p: 1 }}>
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
                  maxWidth: '80%',
                  backgroundColor: message.sender === 'user' ? '#e3f2fd' : '#f5f5f5'
                }}
              >
                <ListItemText 
                  primary={message.content}
                  secondary={message.timestamp.toLocaleTimeString()}
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
              <CircularProgress size={24} />
            </Box>
          )}
        </List>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="outlined"
          component="label"
          disabled={loading}
        >
          Upload CV
          <input
            type="file"
            hidden
            accept=".pdf"
            onChange={handleCVUpload}
          />
        </Button>
        
        <TextField
          fullWidth
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={loading}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(inputMessage);
            }
          }}
        />
        
        <Button 
          variant="contained" 
          color="primary"
          disabled={loading || !inputMessage.trim()}
          onClick={() => handleSendMessage(inputMessage)}
        >
          Send
        </Button>
      </Box>
    </Paper>
  );
};

export default JobChat;