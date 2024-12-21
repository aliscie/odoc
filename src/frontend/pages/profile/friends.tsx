import React, { useState, useCallback } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Rating,
  Stack,
  Chip,
  IconButton, Paper, TextField, Divider,
} from "@mui/material";
import {
  Check as CheckIcon,
  Close as CloseIcon,
  PersonRemove as PersonRemoveIcon,
} from "@mui/icons-material";
import ChatWindow from "../../components/Chat/chatWindow";
interface Review {
  rating: number;
  comment: string;
  timestamp: string;
  reviewerId: string;
  reviewerName: string;
}

interface User {
  id: string;
  name: string;
  description: string;
  photo: string;
  reviews?: Review[];
  averageRating?: number;
}

interface Friend {
  id: string;
  sender: User;
  receiver: User;
  confirmed: boolean;
}

interface Chat {
  id: string;
  name: string;
  messages: Array<{
    id: string;
    sender: string;
    content: string;
    timestamp: string;
  }>;
  members: string[];
  admins: string[];
}

interface ChatWindowPosition {
  x: number;
  y: number;
}

interface FriendsListProps {
  friends: Friend[];
  currentUser: User;
  onAcceptFriend: (friendId: string) => void;
  onRejectFriend: (friendId: string) => void;
  onCancelRequest: (friendId: string) => void;
  onUnfriend: (friendId: string) => void;
  onSendMessage: (userId: string, message: string) => void;
  onRateUser: (userId: string, rating: number) => void;
}

const FriendsList: React.FC<FriendsListProps> = ({
  friends,
  currentUser,
  onAcceptFriend,
  onRejectFriend,
  onCancelRequest,
  onUnfriend,
  onSendMessage,
  onRateUser,
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [activeChats, setActiveChats] = useState<Map<string, Chat>>(new Map());
  const [chatPositions, setChatPositions] = useState<
    Map<string, ChatWindowPosition>
  >(new Map());

  const handleProfileClose = () => {
    setSelectedUser(null);
    setRating(0);
  };

  const handleSubmitReview = () => {
    if (selectedUser && rating > 0) {
      const newReview: Review = {
        rating,
        comment: review,
        timestamp: new Date().toISOString(),
        reviewerId: currentUser?.id || "",
        reviewerName: currentUser?.name || "",
      };
      onRateUser(selectedUser.id, rating);
      // Reset form
      setRating(0);
      setReview("");
    }
  };

  const handleOpenChat = useCallback(
    (user: User) => {
      const chatId = `chat-${user.id}`;
      if (!activeChats.has(chatId)) {
        const newChat: Chat = {
          id: chatId,
          name: user.name,
          messages: [],
          members: [currentUser.id, user.id],
          admins: [currentUser.id],
        };

        setActiveChats(new Map(activeChats.set(chatId, newChat)));

        // Set initial position for new chat window
        const position = {
          x: window.innerWidth - 350 - activeChats.size * 20,
          y: window.innerHeight - 450 - activeChats.size * 20,
        };
        setChatPositions(new Map(chatPositions.set(chatId, position)));
      }
      setSelectedUser(null);
    },
    [activeChats, chatPositions, currentUser && currentUser.id],
  );

  const handleCloseChat = useCallback((chatId: string) => {
    setActiveChats((prevChats) => {
      const newChats = new Map(prevChats);
      newChats.delete(chatId);
      return newChats;
    });
    setChatPositions((prevPositions) => {
      const newPositions = new Map(prevPositions);
      newPositions.delete(chatId);
      return newPositions;
    });
  }, []);

  const handleChatPositionChange = useCallback(
    (chatId: string, position: ChatWindowPosition) => {
      setChatPositions(
        (prevPositions) => new Map(prevPositions.set(chatId, position)),
      );
    },
    [],
  );

  const getFriendStatus = (friend: Friend) => {
    const isSender = friend.sender.id === currentUser?.id;
    if (friend.confirmed) {
      return {
        status: "Friends",
        actions: (
          <IconButton
            color="error"
            onClick={() => onUnfriend(friend.id)}
            title="Unfriend"
          >
            <PersonRemoveIcon />
          </IconButton>
        ),
      };
    }
    if (isSender) {
      return {
        status: "Request Sent",
        actions: (
          <IconButton
            color="warning"
            onClick={() => onCancelRequest(friend.id)}
            title="Cancel Request"
          >
            <CloseIcon />
          </IconButton>
        ),
      };
    }
    return {
      status: "Request Received",
      actions: (
        <Stack direction="row" spacing={1}>
          <IconButton
            color="success"
            onClick={() => onAcceptFriend(friend.id)}
            title="Accept"
          >
            <CheckIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => onRejectFriend(friend.id)}
            title="Reject"
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      ),
    };
  };

  return (
    <>
      <List>
        {friends.map((friend) => {
          const otherUser =
            friend.sender.id === currentUser?.id
              ? friend.receiver
              : friend.sender;
          const { status, actions } = getFriendStatus(friend);

          return (
            <ListItem key={friend.id} secondaryAction={actions}>
              <ListItemAvatar>
                <Avatar
                  src={`data:image/jpeg;base64,${otherUser.photo}`}
                  onClick={() => setSelectedUser(otherUser)}
                  sx={{ cursor: "pointer" }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={otherUser.name}
                secondary={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={status}
                      size="small"
                      color={friend.confirmed ? "success" : "default"}
                    />
                  </Stack>
                }
              />
            </ListItem>
          );
        })}
      </List>

      <Dialog
        open={!!selectedUser}
        onClose={handleProfileClose}
        maxWidth="md"
        fullWidth
      >
        {selectedUser && (
          <>
            <DialogTitle>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  src={`data:image/jpeg;base64,${selectedUser.photo}`}
                  sx={{ width: 56, height: 56 }}
                />
                <Typography variant="h6">{selectedUser.name}</Typography>
              </Stack>
            </DialogTitle>
            <DialogContent>
              <Stack spacing={3}>
                <Typography variant="body1">
                  {selectedUser.description}
                </Typography>

                <Stack spacing={2}>

                  {selectedUser.reviews?.map((review, index) => (
                    <Paper
                      key={index}
                      sx={{ p: 2, bgcolor: "background.default" }}
                    >
                      <Stack spacing={1}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="subtitle2">
                            {review.reviewerName}
                          </Typography>
                          <Rating value={review.rating} readOnly size="small" />
                        </Stack>
                        <Typography variant="body2">
                          {review.comment}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(review.timestamp).toLocaleDateString()}
                        </Typography>
                      </Stack>
                    </Paper>
                  ))}

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle1">Write a Review</Typography>
                  <Rating
                    value={rating}
                    onChange={(_, newValue) => handleRating(newValue)}
                  />
                  <TextField
                    label="Your Review"
                    multiline
                    rows={3}
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    fullWidth
                  />
                </Stack>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleProfileClose}>Close</Button>
              <Button
                onClick={handleSubmitReview}
                variant="outlined"
                color="primary"
                disabled={!rating || !review.trim()}
              >
                Submit Review
              </Button>
              <Button
                onClick={() => handleOpenChat(selectedUser)}
                variant="contained"
                color="primary"
              >
                Open Chat
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Render active chat windows */}
      {Array.from(activeChats.entries()).map(([chatId, chat]) => (
        <ChatWindow
          key={chatId}
          chat={chat}
          onClose={handleCloseChat}
          position={chatPositions.get(chatId) || { x: 0, y: 0 }}
          onPositionChange={handleChatPositionChange}
        />
      ))}
    </>
  );
};

export default FriendsList;
