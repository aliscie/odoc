import React from 'react';
import { Button, Tooltip } from '@mui/material';
import { Share } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

interface ShareProfileButtonProps {
  profileName: string;
  profileId: string;
}

const ShareProfileButton: React.FC<ShareProfileButtonProps> = ({ profileName, profileId }) => {
    const { enqueueSnackbar } = useSnackbar();

    const handleShareProfile = async () => {
        try {
            const domain = window.location.origin;

            const shareData = {
                title: `${profileName}'s Profile`,
                text: `Check out ${profileName}'s profile on our platform.`,
                url: `${domain}/user?id=${profileId}`,
            };

            if (navigator.share) {
                await navigator.share(shareData);
            } else {
            // Fallback for browsers that don't support the Web Share API
            navigator.clipboard.writeText(shareData.url).then(() => {
                enqueueSnackbar('Profile URL copied to clipboard', { variant: 'info' });
            })};
        } catch (error) {
            console.error('Error sharing profile:', error);
            enqueueSnackbar('Error sharing profile', { variant: 'error' });
        }
    };

    return (
        <Tooltip arrow title="Share Profile">
        <Button
            variant="contained"
            color="primary"
            onClick={handleShareProfile}
            startIcon={<Share />}
            fullWidth
            sx={{ mb: 2 }}
        >
            Share Profile
        </Button>
        </Tooltip>
    );
};

export default ShareProfileButton;
