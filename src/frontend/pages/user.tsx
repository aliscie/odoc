import ProfilePage from "./profile";
import React, { useEffect, useState } from "react";
import { useBackendContext } from "../contexts/BackendContext";
import { useSearchParams } from "react-router-dom";
import { Principal } from "@dfinity/principal";
import FriendshipButton from "../components/FriendshipButton";
import { useSelector } from "react-redux";

function UserProfile() {
  const [searchParams] = useSearchParams();
  const { backendActor } = useBackendContext();
  const [user, setUser] = useState(null);
  const [profileHistory, setProfileHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { profile, profile_history, wallet, friends } = useSelector(
    (state: any) => state.filesState,
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = searchParams.get("id");
        console.log({ userId2: userId });
        if (!userId || !backendActor) return;

        const userData = await backendActor.get_user(userId);
        const userHistory = await backendActor.get_user_profile(
          Principal.fromText(userId),
        );

        setUser(userData.Ok);
        setProfileHistory(userHistory.Ok);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [searchParams, backendActor]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  const handleSendRequest = async () => {
    try {
      if (!backendActor) return;
      await backendActor.send_friend_request(searchParams.get("id") || "");
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const handleAcceptRequest = async () => {
    try {
      if (!backendActor) return;
      await backendActor.accept_friend_request(searchParams.get("id") || "");
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleRejectRequest = async () => {
    try {
      if (!backendActor) return;
      await backendActor.reject_friend_request(searchParams.get("id") || "");
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  const handleCancelRequest = async () => {
    try {
      if (!backendActor) return;
      await backendActor.cancel_friend_request(searchParams.get("id") || "");
    } catch (error) {
      console.error("Error canceling friend request:", error);
    }
  };

  const handleUnfriend = async () => {
    try {
      if (!backendActor) return;
      await backendActor.unfriend(searchParams.get("id") || "");
    } catch (error) {
      console.error("Error unfriending:", error);
    }
  };

  return (
    <div>
      <FriendshipButton
        profile={profile}
        user={user} // The viewed user's profile
        friends={friends} // Pass the friends list here
        onSendRequest={handleSendRequest}
        onAcceptRequest={handleAcceptRequest}
        onRejectRequest={handleRejectRequest}
        onCancelRequest={handleCancelRequest}
        onUnfriend={handleUnfriend}
      />
      <ProfilePage friends={friends} profile={user} history={profileHistory} />
    </div>
  );
}

export default UserProfile;
