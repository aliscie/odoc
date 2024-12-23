import React from "react";
import { Chip, List, ListItem, ListItemText, Stack } from "@mui/material";
import UserAvatarMenu from "../../components/MainComponents/UserAvatarMenu";
import FriendshipButton from "../../components/FriendshipButton";
import { useSelector } from "react-redux";

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

const FriendsList: React.FC<FriendsListProps> = ({ friends, currentUser }) => {
  const { Anonymous, profile } = useSelector((state: any) => state.filesState);

  return (
    <>
      <List>
        {friends.map((friend) => {
          const otherUser =
            friend.sender.id === currentUser?.id
              ? friend.receiver
              : friend.sender;
          return (
            <ListItem
              key={friend.id}
              secondaryAction={
                currentUser &&
                currentUser.id == profile.id && (
                  <FriendshipButton
                    profile={currentUser}
                    user={otherUser}
                    friends={friends}
                  />
                )
              }
            >
              <UserAvatarMenu
                user={otherUser}
                // onMessageClick={() => setSelectedUser(otherUser)}
              />
              <ListItemText
                primary={otherUser.name}
                secondary={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={otherUser.description}
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
    </>
  );
};

export default FriendsList;
