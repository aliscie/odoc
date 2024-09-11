import React from "react";
import { useSelector } from "react-redux";
import { FEChat, UserFE } from "../../../declarations/backend/backend.did";
import {
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
  Box,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { Principal } from "@dfinity/principal";
import useGetChats from "../Chat/utils/useGetChats";
import formatTimestamp, { formatRelativeTime } from "../../utils/time";

export interface FrontendMessage {
  id: string;
  date: bigint;
  sender: Principal;
  seen_by: Array<Principal>;
  message: string;
  chat_id: string;
  is_saving?: boolean;
  current_chat_id?: string;
}

const MessageComponent: React.FC<FrontendMessage> = (message) => {
  const { profile } = useSelector((state: any) => state.filesState);
  const { chats } = useSelector((state: any) => state.chatsState);
  const { getOther } = useGetChats();

  const currentChat =
    chats.length > 0 &&
    chats.find((chat: FEChat) => chat.id === message.chat_id);
  const otherUser: undefined | UserFE = currentChat && getOther(currentChat);

  const isCurrentUser = message.sender.toString() === profile.id;

  return (
    <ListItem
      key={message.id}
      alignItems="flex-start"
      sx={{
        display: "flex",
        justifyContent: isCurrentUser ? "flex-end" : "flex-start",
      }}
    >
      <Box
        sx={{
          maxWidth: "180px",
             whiteSpace: 'normal',
          overflow: "hidden",
          backgroundColor: isCurrentUser ? "primary.main" : "info.main",
          color: isCurrentUser ? "white" : "black",
          borderRadius: 2,
          padding: 1,
          marginBottom: 1,
        }}
      >
        <ListItemText
          primary={
            <Typography
              sx={{ display: "inline" }}
              component="span"
              variant="body2"
              color="text.primary"
            >
              {isCurrentUser ? "You: " : `${otherUser?.name || "User"}: `}
              {message.message}
            </Typography>
          }
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="caption"
                color="text.secondary"
              >
                <Tooltip title={formatTimestamp(message.date)}>
                  <React.Fragment>
                    {formatRelativeTime(Number(message.date))}
                  </React.Fragment>
                </Tooltip>
                {message.is_saving ? (
                  <DoneIcon fontSize="small" />
                ) : (
                  <DoneAllIcon fontSize="small" />
                )}
              </Typography>
            </React.Fragment>
          }
        />
      </Box>
    </ListItem>
  );
};

export default MessageComponent;
