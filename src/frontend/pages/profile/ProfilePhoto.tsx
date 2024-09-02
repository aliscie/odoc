import React from "react";
import {IconButton} from "@mui/material";
import {Edit} from "@mui/icons-material";
import UserAvatar from "../../components/MainComponents/UserAvatar";
import {useSelector} from "react-redux";

interface ProfilePhotoProps {
    photo: string;
    onClick: () => void;
    onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfilePhoto: React.FC<ProfilePhotoProps> = ({
                                                       photo,
                                                       onClick,
                                                       onPhotoChange,
                                                   }) => {
    const {profile_history} = useSelector((state: any) => state.filesState);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
            }}
        >
            <input
                type="file"
                id="photo"
                accept="image/*"
                onChange={onPhotoChange}
                style={{display: "none"}}
            />

            <UserAvatar
                onClick={onClick}
                actions_rate={profile_history ? profile_history.actions_rate : 0}
                photo={photo}
                style={{width: 200, height: 200}}
            />

            <IconButton
                aria-label="edit"
                component="span"
                style={{
                    position: "absolute",
                    bottom: 20,
                    right: 300,
                    backgroundColor: "white",
                    borderRadius: "50%",
                }}
                onClick={() => document.getElementById("photo")?.click()}
            >
                <Edit/>
            </IconButton>
        </div>
    );
};

export default ProfilePhoto;
