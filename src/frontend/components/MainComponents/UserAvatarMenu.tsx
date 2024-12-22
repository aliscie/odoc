import React, { useState } from 'react';
import { 
  Avatar, 
  IconButton, 
  Menu, 
  MenuItem, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Rating,
  TextField,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Person, Message, Star } from '@mui/icons-material';
import { useBackendContext } from '../../contexts/BackendContext';
import { useSnackbar } from 'notistack';

interface UserAvatarMenuProps {
  user: {
    id: string;
    name: string;
    photo?: Uint8Array;
  };
  onMessageClick?: () => void;
}

const UserAvatarMenu: React.FC<UserAvatarMenuProps> = ({ user, onMessageClick }) => {
  const navigate = useNavigate();
  const { backendActor } = useBackendContext();
  const { enqueueSnackbar } = useSnackbar();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate(`/user?id=${user.id}`);
    handleClose();
  };

  const handleMessage = () => {
    if (onMessageClick) {
      onMessageClick();
    }
    handleClose();
  };

  const handleReviewClick = () => {
    setReviewOpen(true);
    handleClose();
  };

  const handleReviewSubmit = async () => {
    try {
      const result = await backendActor?.rate_user(user.id, {
        rating,
        comment,
        date: BigInt(Date.now())
      });

      if (result?.Ok) {
        enqueueSnackbar('Review submitted successfully', { variant: 'success' });
      } else if (result?.Err) {
        enqueueSnackbar(result.Err, { variant: 'error' });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      enqueueSnackbar('Failed to submit review', { variant: 'error' });
    }
    setReviewOpen(false);
    setRating(0);
    setComment('');
  };

  const getPhotoSrc = (photoData?: Uint8Array) => {
    try {
      return photoData && photoData.length > 0
        ? `data:image/jpeg;base64,${Buffer.from(photoData).toString('base64')}`
        : '';
    } catch (e) {
      console.error('Error converting photo:', e);
      return '';
    }
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <Avatar 
          src={getPhotoSrc(user.photo)}
          alt={user.name}
        >
          {user.name?.charAt(0) || 'A'}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleProfile}>
          <Person sx={{ mr: 1 }} /> Profile
        </MenuItem>
        <MenuItem onClick={handleMessage}>
          <Message sx={{ mr: 1 }} /> Message
        </MenuItem>
        <MenuItem onClick={handleReviewClick}>
          <Star sx={{ mr: 1 }} /> Review
        </MenuItem>
      </Menu>

      <Dialog open={reviewOpen} onClose={() => setReviewOpen(false)}>
        <DialogTitle>Review {user.name}</DialogTitle>
        <DialogContent>
          <Typography component="legend">Rating</Typography>
          <Rating
            value={rating}
            onChange={(_, newValue) => setRating(newValue || 0)}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Comment"
            fullWidth
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewOpen(false)}>Cancel</Button>
          <Button onClick={handleReviewSubmit}>Submit Review</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserAvatarMenu;
