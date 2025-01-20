import ProfilePage from "./profile";
// MessageMenuItem.tsx
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
        // console.log({ userId2: userId });
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
  if (!user || !profile) {
    return <></>;
  }
  return (
    <div>
      <ProfilePage
        friendButton={
          profile &&
          user.id != profile?.id && (
            <FriendshipButton profile={profile} user={user} friends={friends} />
          )
        }
        friends={friends}
        profile={user}
        history={profileHistory}
      />
    </div>
  );
}

export default UserProfile;
