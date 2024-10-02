import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { handleRedux } from "../../redux/store/handleRedux";
import MessagesList from "../ChatNotifications/MessagesList";
import { Box, Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";

interface Message {
  text: string;
  isCurrentUser: boolean;
}

const MessagesDialogBox: React.FC = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { current_chat_id } = useSelector((state: any) => state.chatsState);

  const [messages, setMessages] = useState<Message[]>([]);

  const isPathChats = window.location.pathname.includes("/chats");
  const isOpen = !isPathChats && Boolean(current_chat_id);

  const closeDialog = () => {
    try {
      dispatch(handleRedux("OPEN_CHAT", { current_chat_id: false }));
    } catch (error) {
      enqueueSnackbar("Failed to close the dialog", { variant: "error" });
      console.log("Error closing dialog:", error);
    }
  };

  // const handleSend = (message: string) => {
  //   if (message.trim()) {
  //     setMessages((prevMessages) => [
  //       ...prevMessages,
  //       { text: message, isCurrentUser: true },
  //     ]);
  //   } else {
  //     enqueueSnackbar("Message cannot be empty", { variant: "warning" });
  //   }
  // };
  let actions = [
    <IconButton key="close" onClick={closeDialog}>
      <CloseIcon color="action" />
    </IconButton>,
    <IconButton key="expand" component={Link} to="/chats" onClick={closeDialog}>
      <OpenInFullIcon color="action" />
    </IconButton>,
  ];

  return (
    <Dialog
      open={isOpen}
      onClose={closeDialog}
      PaperProps={{
        style: {
          borderRadius: "16px",
          padding: "16px",
          position: "relative", // Ensure relative positioning for the Box components inside
        },
      }}
    >
      <Box sx={{ padding: "16px", position: "relative" }}>
        {actions && actions[0] && (
          <Box sx={{ position: "absolute", top: 8, right: 8 }}>
            {actions[0]}
          </Box>
        )}
      </Box>
      <DialogContent sx={{ padding: "0" }}>
        <MessagesList messages={messages} />
      </DialogContent>
      {actions && actions[1] && (
        <Box
          sx={{
            padding: "8px 16px",
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          {actions[1]}
        </Box>
      )}
    </Dialog>
  );
};

export default MessagesDialogBox;
