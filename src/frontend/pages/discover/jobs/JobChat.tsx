import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  CircularProgress, 
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { AnthropicAgent } from './AnthropicAgent';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isCV?: boolean;
}

interface CVFeedback {
  feedback: string[];
}

const JobChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [agent] = useState(() => new AnthropicAgent());
  const [openCVDialog, setOpenCVDialog] = useState(false);
  const [cvText, setCvText] = useState('');

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: uuidv4(),
        content: "I'm your job assistant. I can help you with job applications and resume analysis. Share your resume details or ask me questions about job searching.",
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [messages]);

  const handleSendMessage = async (content: string, isCV = false) => {
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
      // Use AnthropicAgent for real chat responses
      setLoading(true);
      try {
        const response = await agent.sendMessage(content);
        
        const responseMessage: Message = {
          id: uuidv4(),
          content: response,
          sender: 'assistant',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, responseMessage]);
      } catch (error) {
        console.error('Error getting response from Anthropic:', error);
        
        const errorMessage: Message = {
          id: uuidv4(),
          content: "I'm sorry, I encountered an error processing your request. Please try again.",
          sender: 'assistant',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCVSubmit = async () => {
    if (!cvText.trim()) {
      return;
    }
    
    setOpenCVDialog(false);
    
    // Send the CV text as a message
    handleSendMessage(`My Resume/CV:\n\n${cvText}`, true);
    
    // Use AnthropicAgent to analyze the CV
    setLoading(true);
    
    try {
      const cvAnalysisPrompt = `I've shared my resume/CV details below. Please analyze it and provide:
1. A score out of 100%
2. Whether it's complete or not
3. Specific feedback for improvement or additional information needed for job searching

Here's my resume/CV:
${cvText}

Format your response as a structured analysis.`;

      const response = await agent.sendMessage(cvAnalysisPrompt);
      
      // Extract feedback points
      const feedbackRegex = /\d+\.\s+(.*?)(?=\d+\.|$)/gs;
      const feedbackMatches = [...response.matchAll(feedbackRegex)];
      const feedback = feedbackMatches.map(match => match[1].trim());
      
      if (feedback.length === 0) {
        // If no feedback points were extracted, create some based on the response
        const sentences = response.split(/\.\s+/);
        for (let i = 0; i < sentences.length && feedback.length < 3; i++) {
          if (sentences[i].length > 20) {
            feedback.push(sentences[i]);
          }
        }
      }
      
      const result = {
        feedback: feedback.length > 0 ? feedback : ["Consider adding more details to your resume"]
      };
      
      handleCVAnalysis(result);
    } catch (error) {
      console.error('Error analyzing CV:', error);
      
      const errorResult = {
        feedback: ["Error analyzing resume. Please try again."]
      };
      
      handleCVAnalysis(errorResult);
    }
  };

  const handleCVAnalysis = (result: CVFeedback) => {
    let responseContent = 'Here are some suggestions to improve your resume:\n\n' + 
      result.feedback.map((q: string, i: number) => `${i+1}. ${q}`).join('\n\n');
    
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
          Share your resume details for analysis or ask questions about job applications and career advice.
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
        <div ref={messagesEndRef} />
      </Box>
      
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="outlined"
          onClick={() => setOpenCVDialog(true)}
          disabled={loading}
        >
          Share Resume
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

      {/* Resume Input Dialog */}
      <Dialog 
        open={openCVDialog} 
        onClose={() => setOpenCVDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Share Your Resume Details</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Please enter your resume or CV details below. Include your experience, skills, education, and any other relevant information.
          </Alert>
          <TextField
            autoFocus
            multiline
            rows={15}
            fullWidth
            variant="outlined"
            placeholder="Enter your resume/CV details here..."
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCVDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleCVSubmit}
            variant="contained" 
            color="primary"
            disabled={!cvText.trim()}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default JobChat;
