import React from 'react';
import { Principal } from "@dfinity/principal";

interface FriendshipButtonProps {
  profile: any;
  user: any;
  friends: any[];
  onSendRequest: () => void;
  onAcceptRequest: () => void;
  onRejectRequest: () => void;
  onCancelRequest: () => void;
  onUnfriend: () => void;
}

const FriendshipButton: React.FC<FriendshipButtonProps> = ({
  profile,
  user,
  friends,
  onSendRequest,
  onAcceptRequest,
  onRejectRequest,
  onCancelRequest,
  onUnfriend,
}) => {
  if (!profile || !user) return null;

  const isFriend = friends.some(friend => friend.id === user.id);
  const isRequestSender = friends.some(friend => 
    friend.id === user.id && friend.status === 'pending' && friend.sender === profile.id
  );
  const isRequestReceiver = friends.some(friend => 
    friend.id === user.id && friend.status === 'pending' && friend.sender === user.id
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
        onClick={onUnfriend}
        style={secondaryButton}
      >
        Unfriend
      </button>
    );
  }

  if (isRequestSender) {
    return (
      <button 
        onClick={onCancelRequest}
        style={secondaryButton}
      >
        Cancel Request
      </button>
    );
  }

  if (isRequestReceiver) {
    return (
      <div>
        <button 
          onClick={onAcceptRequest}
          style={primaryButton}
        >
          Accept Request
        </button>
        <button 
          onClick={onRejectRequest}
          style={secondaryButton}
        >
          Reject Request
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={onSendRequest}
      style={primaryButton}
    >
      Send Friend Request
    </button>
  );
};

export default FriendshipButton;
