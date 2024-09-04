import React from "react";
import { CircularProgress } from "@mui/material";
import UserAvatar from "../../components/MainComponents/UserAvatar";
import { useSelector } from "react-redux";

interface ProfilePhotoProps {
  photo: string;
  onAvatarClick: () => void;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfilePhoto: React.FC<ProfilePhotoProps> = ({
  photo,
  onAvatarClick,
  onPhotoChange,
  loading,
}) => {
  const { profile_history } = useSelector((state: any) => state.filesState);

  return (
    <div
      onClick={() =>
        !loading && document.getElementById("upload-photo")?.click()
      }
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {loading ? (
        <CircularProgress size={200} />
      ) : (
        <>
          <input
            type="file"
            id="upload-photo"
            accept="image/*"
            onChange={onPhotoChange}
            style={{ display: "none" }}
          />
          <UserAvatar
            actions_rate={profile_history ? profile_history.actions_rate : 0}
            photo={photo}
            onClick={onAvatarClick}
            style={{ width: 200, height: 200 }}
          />
        </>
      )}
    </div>
  );
};

export default ProfilePhoto;
