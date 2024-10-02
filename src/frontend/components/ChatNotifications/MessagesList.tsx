import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Typography } from "@mui/material";
import { Message } from "../../../declarations/backend/backend.did";
import ChatSendMessage from "../ChatSendMessage";
import MessageComponent from "./Message";
import { RootState } from "../../redux/reducers";
import MessagesGroupOption from "./groupOptions";

const MessagesList: React.FC = () => {
  const { current_chat_id, chats } = useSelector(
    (state: RootState) => state.chatsState,
  );

  const [messages, setMessages] = useState<Message[]>([]);

  const currentChat = chats.find((chat) => chat.id === current_chat_id);

  useEffect(() => {
    if (currentChat) {
      setMessages(currentChat.messages || []);
    }
  }, [currentChat]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <MessagesGroupOption currentChat={currentChat} />

      <Box sx={{ flex: 1, overflowY: "auto", padding: 2 }}>
        {messages.length > 0 ? (
          messages.map((message) => {
            return (
              <MessageComponent
                key={message.id}
                current_chat_id={current_chat_id!}
                {...message}
              />
            );
          })
        ) : currentChat ? (
          <CircularProgress />
        ) : (
          <Typography type={"info"}>No messages yet.</Typography>
        )}
        <ChatSendMessage />
      </Box>
    </Box>
  );
};

export default MessagesList;
