import ProfilePage from "./profile";
import React, { useEffect, useState } from "react";
import { useBackendContext } from "../contexts/BackendContext";
import { useSearchParams } from "react-router-dom";

function UserProfile() {
  const [searchParams] = useSearchParams();
  const { backendActor } = useBackendContext();
  const [profile, setProfile] = useState(null);
  const [profileHistory, setProfileHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = searchParams.get('id');
        if (!userId || !backendActor) return;

        const userData = await backendActor.get_user(userId);
        const userHistory = await backendActor.get_user_history(userId);
        
        setProfile(userData);
        setProfileHistory(userHistory);
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

  return (
    <ProfilePage
      friends={[]}
      profile={profile}
      history={profileHistory}
    />
  );
}

export default UserProfile;
