import React, { useState, useCallback } from "react";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Rating as UiRating,
} from "@mui/material";
import ChatWindow from "../../components/Chat/chatWindow";
import { useNavigate } from "react-router-dom";
import { Person, Message, Star } from "@mui/icons-material";
import CircularProgress from '@mui/material/CircularProgress';
import { useBackendContext } from "../../contexts/BackendContext";
import { useSnackbar } from "notistack";
import { Principal } from "@dfinity/principal";
import { Rating } from "../../../declarations/backend/backend.did";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import { randomString } from "../../DataProcessing/dataSamples";

interface UserAvatarMenuProps {
  user: {
    id: string;
    name: string;
    photo?: Uint8Array;
  };
  onMessageClick?: () => void;
}

const UserAvatarMenu: React.FC<UserAvatarMenuProps> = ({
  user,
  onMessageClick,
}) => {
  const navigate = useNavigate();
  const { backendActor } = useBackendContext();
  const { enqueueSnackbar } = useSnackbar();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate(`/user?id=${user.id}`);
    handleClose();
  };

  const [activeChat, setActiveChat] = useState<any>(null);
  const [chatPosition, setChatPosition] = useState({ x: 0, y: 0 });
  const { chats } = useSelector((state: RootState) => state.chatsState);
  const { profile } = useSelector((state: RootState) => state.filesState);

  const handleMessage = useCallback(() => {
    // Use the already selected chats and profile
    const existingChat = chats.find((chat) =>
      chat.members.some(
        (member) =>
          member.toString() === user.id || member.__principal__ === user.id,
      ),
    );

    if (!activeChat && existingChat) {
      const position = {
        x: window.innerWidth - 350,
        y: window.innerHeight - 450,
      };
      setChatPosition(position);

      const filteredMessages = existingChat.messages.filter((message) => {
        const senderId =
          message.sender instanceof Principal
            ? message.sender.toString()
            : message.sender.__principal__;

        const isCurrentUser = senderId === profile?.id;
        return !isCurrentUser || message.seen_by?.length > 0;
      });

      setActiveChat({
        ...existingChat,
        messages: filteredMessages,
      });
    } else if (!activeChat) {
      const chatId = `chat-${user.id}`;
      const newChat = {
        id: chatId,
        name: user.name,
        messages: [],
        members: [user.id],
        admins: [user.id],
      };

      const position = {
        x: window.innerWidth - 350,
        y: window.innerHeight - 450,
      };
      setChatPosition(position);
      setActiveChat(newChat);
    }

    handleClose();
  }, [user, activeChat, handleClose, chats, profile]);

  const handleCloseChat = useCallback(() => {
    setActiveChat(null);
  }, []);

  const handleChatPositionChange = useCallback(
    (chatId: string, position: { x: number; y: number }) => {
      setChatPosition(position);
    },
    [],
  );

  const handleSendMessage = async (chatId: string, message: string) => {
    try {
      if (onMessageClick) {
        await onMessageClick();
      }

      const newMessage: Message = {
        id: randomString(),
        date: BigInt(Date.now() * 1e6),
        sender: Principal.fromText(profile.id),
        seen_by: [],
        message,
        chat_id: chatId,
      };

      const result = await backendActor?.send_message(
        [Principal.fromText(user.id)],
        newMessage,
      );
      // console.log({ result });

      if (result?.Ok) {
        enqueueSnackbar("Message sent successfully", { variant: "success" });
      } else if (result?.Err) {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      enqueueSnackbar(error.message || "Failed to send message", {
        variant: "error",
      });
    }
  };

  const handleReviewClick = () => {
    setReviewOpen(true);
    handleClose();
  };

  const handleReviewSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Convert user.id string to Principal
      const userPrincipal = Principal.fromText(user.id);

      const ratingData: Rating = {
        id: randomString(),
        rating: rating,
        comment: comment,
        date: Date.now() * 1e6,
        user_id: Principal.fromText(user.id),
      };

      const result = await backendActor?.rate_user(userPrincipal, ratingData);

      if (result?.Ok) {
        enqueueSnackbar("Review submitted successfully", {
          variant: "success",
        });
      } else if (result?.Err) {
        enqueueSnackbar(result.Err, { variant: "error" });
      }
    } catch (error) {
      // console.error('Error submitting review:', error);
      enqueueSnackbar("Failed to submit review " + error, { variant: "error" });
    } finally {
      setIsSubmitting(false);
      setReviewOpen(false);
      setRating(0);
      setComment("");
    }
  };

  const getPhotoSrc = (photoData?: Uint8Array) => {
    try {
      return photoData && photoData.length > 0
        ? `data:image/jpeg;base64,${Buffer.from(photoData).toString("base64")}`
        : "";
    } catch (e) {
      console.error("Error converting photo:", e);
      return "";
    }
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <Avatar src={getPhotoSrc(user.photo)} alt={user.name}>
          {user.name?.charAt(0) || "A"}
        </Avatar>
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleProfile}>
          <Person sx={{ mr: 1 }} /> Profile
        </MenuItem>
        <MenuItem onClick={handleMessage}>
          <Message sx={{ mr: 1 }} /> Message
        </MenuItem>
        <MenuItem onClick={handleReviewClick}>
          <Star sx={{ mr: 1 }} /> Review
        </MenuItem>
      </Menu>

      <Dialog open={reviewOpen} onClose={() => setReviewOpen(false)}>
        <DialogTitle>Review {user.name}</DialogTitle>
        <DialogContent>
          <Typography component="legend">Rating</Typography>
          <UiRating
            value={rating}
            onChange={(_, newValue) => setRating(newValue || 0)}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Comment"
            fullWidth
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setReviewOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleReviewSubmit}
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </DialogActions>
      </Dialog>

      {activeChat && (
        <ChatWindow
          user={user}
          chat={activeChat}
          onClose={handleCloseChat}
          position={chatPosition}
          onPositionChange={handleChatPositionChange}
          onSendMessage={handleSendMessage}
        />
      )}
    </>
  );
};

export default UserAvatarMenu;
