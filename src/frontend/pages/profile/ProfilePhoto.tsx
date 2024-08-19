import React from 'react';
import { Avatar, IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';

interface ProfilePhotoProps {
    photo: string;
    onAvatarClick: () => void;
    onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfilePhoto: React.FC<ProfilePhotoProps> = ({ photo, onAvatarClick, onPhotoChange }) => {
    console.log('Profile photo:', photo); 
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <input
                type="file"
                id="photo"
                accept="image/*"
                onChange={onPhotoChange}
                style={{ display: 'none' }}
            />
            <IconButton component="span" onClick={(e) => e.stopPropagation()}>
                <Avatar
                    alt="Profile Photo"
                    src={photo}
                    style={{ width: 128, height: 128, marginBottom: 16 }}
                    onClick={onAvatarClick}
                />
            </IconButton>
            <IconButton
                aria-label="edit"
                component="span"
                style={{
                    position: 'absolute',
                    bottom: 20,
                    right: 300,
                    backgroundColor: 'white',
                    borderRadius: '50%',
                }}
                onClick={() => document.getElementById('photo')?.click()}
            >
                <Edit />
            </IconButton>
        </div>
    )
};
   

export default ProfilePhoto;
