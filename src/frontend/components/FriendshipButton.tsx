import React from "react";
import { Principal } from "@dfinity/principal";
import { useSnackbar } from "notistack";
import { useBackendContext } from "../contexts/BackendContext";
import { useState } from "react";
import { logger } from "../DevUtils/logData";
import { useSelector } from "react-redux";

interface FriendshipButtonProps {
  profile: any;
  user: any;
  friends: any[];
}

const FriendshipButton: React.FC<FriendshipButtonProps> = ({ user }) => {
  const { Anonymous, profile, friends } = useSelector(
    (state: any) => state.filesState,
  );
  const { backendActor } = useBackendContext();
  const [isLoading, setIsLoading] = useState(false);

  const [localFriends, setLocalFriends] = useState(friends);

  const { enqueueSnackbar } = useSnackbar();

  const handleAction = async (
    action: () => Promise<any>,
    updateFunction: () => void,
  ) => {
    if (!backendActor || isLoading) return;
    setIsLoading(true);
    try {
      const result = await action();
      if (result && "Err" in result) {
        enqueueSnackbar(result.Err, { variant: "error" });
        return;
      }
      updateFunction();
    } catch (error) {
      console.error("Error performing friend action:", error);
      enqueueSnackbar("Failed to perform action", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendRequest = () =>
    handleAction(
      async () => {
        await backendActor.send_friend_request(user.id);
      },
      () => {
        const newFriend = {
          id: `${profile.id}-${user.id}`,
          sender: profile,
          receiver: user,
          confirmed: false,
        };
        setLocalFriends([...localFriends, newFriend]);
      },
    );

  const handleAcceptRequest = () =>
    handleAction(
      async () => {
        await backendActor.accept_friend_request(user.id);
      },
      () => {
        setLocalFriends(
          localFriends.map((friend) =>
            friend.sender.id === user.id || friend.receiver.id === user.id
              ? { ...friend, confirmed: true }
              : friend,
          ),
        );
      },
    );

  const handleRejectRequest = () =>
    handleAction(
      async () => {
        await backendActor.reject_friend_request(user.id);
      },
      () => {
        setLocalFriends(
          localFriends.filter(
            (friend) =>
              !(friend.sender.id === user.id || friend.receiver.id === user.id),
          ),
        );
      },
    );

  const handleCancelRequest = () =>
    handleAction(
      async () => {
        await backendActor.cancel_friend_request(user.id);
      },
      () => {
        setLocalFriends(
          localFriends.filter(
            (friend) =>
              !(
                friend.sender.id === profile.id &&
                friend.receiver.id === user.id
              ),
          ),
        );
      },
    );

  const handleUnfriend = () =>
    handleAction(
      async () => {
        await backendActor.unfriend(user.id);
      },
      () => {
        setLocalFriends(
          localFriends.filter(
            (friend) =>
              !(friend.sender.id === user.id || friend.receiver.id === user.id),
          ),
        );
      },
    );
  if (!profile || !user) return null;

  const isFriend = localFriends.some(
    (friend) =>
      (friend.sender.id === user.id || friend.receiver.id === user.id) &&
      friend.confirmed,
  );
  const isRequestSender = localFriends.some(
    (friend) =>
      friend.receiver.id === user.id &&
      !friend.confirmed &&
      friend.sender.id === profile.id,
  );
  const isRequestReceiver = localFriends.some(
    (friend) =>
      friend.sender.id === user.id &&
      friend.receiver.id === profile.id &&
      !friend.confirmed,
  );

  const buttonStyle = {
    padding: "8px 16px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.2s",
    margin: "4px",
  };

  const primaryButton = {
    ...buttonStyle,
    backgroundColor: "#1976d2",
    color: "white",
    "&:hover": {
      backgroundColor: "#1565c0",
    },
  };

  const secondaryButton = {
    ...buttonStyle,
    backgroundColor: "#dc3545",
    color: "white",
    "&:hover": {
      backgroundColor: "#c82333",
    },
  };

  if (isFriend) {
    return (
      <button
        onClick={handleUnfriend}
        style={secondaryButton}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Unfriend"}
      </button>
    );
  }

  if (isRequestSender) {
    return (
      <button
        onClick={handleCancelRequest}
        style={secondaryButton}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Cancel Request"}
      </button>
    );
  }

  if (isRequestReceiver) {
    return (
      <div>
        <button
          onClick={handleAcceptRequest}
          style={primaryButton}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Accept Request"}
        </button>
        <button
          onClick={handleRejectRequest}
          style={secondaryButton}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Reject Request"}
        </button>
      </div>
    );
  }
  logger({ friends, user, profile });
  return (
    <button
      onClick={handleSendRequest}
      style={primaryButton}
      disabled={isLoading}
    >
      {isLoading ? "Processing..." : "Send Friend Request"}
    </button>
  );
};

export default FriendshipButton;
