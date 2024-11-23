import { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  IconButton,
  Avatar,
  Paper,
  Typography,
  Container,
  Stack,
} from "@mui/material";
import { styled } from "@mui/system";
import { FiSend } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";

const ChatContainer = styled(Paper)(({ theme }) => ({
  height: "80vh",
  display: "flex",
  flexDirection: "column",
  borderRadius: theme.spacing(2),
  overflow: "hidden"
}));

const MessageContainer = styled(Box)({
  flex: 1,
  overflow: "auto",
  padding: "20px"
});

const MessageBubble = styled(Box)(({ isOutgoing }) => ({
  display: "flex",
  alignItems: "flex-start",
  marginBottom: "16px",
  flexDirection: isOutgoing ? "row-reverse" : "row"
}));

const MessageContent = styled(Paper)(({ isOutgoing }) => ({
  padding: "12px 16px",
  borderRadius: "20px",
  maxWidth: "70%",
  marginLeft: isOutgoing ? 0 : "12px",
  marginRight: isOutgoing ? "12px" : 0,
  backgroundColor: isOutgoing ? "#0084ff" : "#f0f0f0",
  color: isOutgoing ? "#fff" : "#000"
}));

const InputContainer = styled(Box)({
  padding: "16px",
  borderTop: "1px solid rgba(0, 0, 0, 0.12)",
  display: "flex",
  alignItems: "center",
  gap: "12px"
});

const TypingIndicator = styled(Box)({
  display: "flex",
  alignItems: "center",
  padding: "8px 16px",
  color: "#666"
});

const ChatBox = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey! How are you?",
      isOutgoing: false,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
    },
    {
      id: 2,
      text: "I'm doing great! Thanks for asking.",
      isOutgoing: true,
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36"
    },
    {
      id: 3,
      text: "Would you like to grab coffee sometime?",
      isOutgoing: false,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
    }
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        text: newMessage,
        isOutgoing: true,
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36"
      }]);
      setNewMessage("");

      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [...prev, {
            id: prev.length + 1,
            text: "Thanks for the message!",
            isOutgoing: false,
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
          }]);
        }, 2000);
      }, 1000);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Container maxWidth="md">
      <ChatContainer elevation={3}>
        <MessageContainer>
          <Stack spacing={2}>
            {messages.map((message) => (
              <MessageBubble key={message.id} isOutgoing={message.isOutgoing}>
                <Avatar
                  src={message.avatar}
                  alt={message.isOutgoing ? "User" : "Contact"}
                  sx={{ width: 32, height: 32 }}
                />
                <MessageContent isOutgoing={message.isOutgoing}>
                  <Typography variant="body1">{message.text}</Typography>
                </MessageContent>
              </MessageBubble>
            ))}
          </Stack>
          {isTyping && (
            <TypingIndicator>
              <BsThreeDots size={24} />
              <Typography variant="body2" sx={{ ml: 1 }}>
                Contact is typing...
              </Typography>
            </TypingIndicator>
          )}
          <div ref={messagesEndRef} />
        </MessageContainer>
        <InputContainer>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            multiline
            maxRows={4}
            size="small"
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            aria-label="Send message"
          >
            <FiSend />
          </IconButton>
        </InputContainer>
      </ChatContainer>
    </Container>
  );
};

export default ChatBox;
