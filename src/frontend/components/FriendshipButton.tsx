import React from 'react';
import { Principal } from "@dfinity/principal";

import { useBackendContext } from "../contexts/BackendContext";
import { useState } from "react";
import {logger} from "../DevUtils/logData";

interface FriendshipButtonProps {
  profile: any;
  user: any;
  friends: any[];
}

const FriendshipButton: React.FC<FriendshipButtonProps> = ({
  profile,
  user,
  friends,
}) => {
  const { backendActor } = useBackendContext();
  const [isLoading, setIsLoading] = useState(false);

  const [localFriends, setLocalFriends] = useState(friends);

  const handleAction = async (action: () => Promise<any>, updateFunction: () => void) => {
    if (!backendActor || isLoading) return;
    setIsLoading(true);
    try {
      await action();
      updateFunction();
    } catch (error) {
      console.error("Error performing friend action:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendRequest = () => handleAction(
    async () => {
      await backendActor.send_friend_request(user.id);
    },
    () => {
      const newFriend = {
        id: `${profile.id}-${user.id}`,
        sender: profile,
        receiver: user,
        confirmed: false
      };
      setLocalFriends([...localFriends, newFriend]);
    }
  );

  const handleAcceptRequest = () => handleAction(
    async () => {
      await backendActor.accept_friend_request(user.id);
    },
    () => {
      setLocalFriends(localFriends.map(friend => 
        (friend.sender.id === user.id || friend.receiver.id === user.id)
          ? { ...friend, confirmed: true }
          : friend
      ));
    }
  );

  const handleRejectRequest = () => handleAction(
    async () => {
      await backendActor.reject_friend_request(user.id);
    },
    () => {
      setLocalFriends(localFriends.filter(friend => 
        !(friend.sender.id === user.id || friend.receiver.id === user.id)
      ));
    }
  );

  const handleCancelRequest = () => handleAction(
    async () => {
      await backendActor.cancel_friend_request(user.id);
    },
    () => {
      setLocalFriends(localFriends.filter(friend => 
        !(friend.sender.id === profile.id && friend.receiver.id === user.id)
      ));
    }
  );

  const handleUnfriend = () => handleAction(
    async () => {
      await backendActor.unfriend(user.id);
    },
    () => {
      setLocalFriends(localFriends.filter(friend => 
        !(friend.sender.id === user.id || friend.receiver.id === user.id)
      ));
    }
  );
  if (!profile || !user) return null;

  const isFriend = localFriends.some(friend => 
    (friend.sender.id === user.id || friend.receiver.id === user.id) && friend.confirmed
  );
  const isRequestSender = localFriends.some(friend => 
    (friend.receiver.id === user.id) && !friend.confirmed && friend.sender.id === profile.id
  );
  const isRequestReceiver = localFriends.some(friend => 
    (friend.sender.id === user.id) && !friend.confirmed && friend.receiver.id === profile.id
  );

  const buttonStyle = {
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
    margin: '4px'
  };

  const primaryButton = {
    ...buttonStyle,
    backgroundColor: '#1976d2',
    color: 'white',
    '&:hover': {
      backgroundColor: '#1565c0'
    }
  };

  const secondaryButton = {
    ...buttonStyle,
    backgroundColor: '#dc3545',
    color: 'white',
    '&:hover': {
      backgroundColor: '#c82333'
    }
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
