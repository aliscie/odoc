// components/Comment.tsx
import React, { useState, useRef } from 'react';
import {
 Box,
 IconButton,
 Typography,
 Menu,
 MenuItem,
} from '@mui/material';
import { Heart, MoreVertical, Reply, ThumbsDown } from 'lucide-react';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { formatRelativeTime } from '../../utils/time';
import EditorComponent from '../../components/EditorComponent';
import { deserializeContentTree } from '../../DataProcessing/deserlize/deserializeContents';
import UserAvatarMenu from '../../components/MainComponents/UserAvatarMenu';
import { useBackendContext } from '../../contexts/BackendContext';
import serializeFileContents from '../../DataProcessing/serialize/serializeFileContents';
import { Post, PostUser } from '../../../declarations/backend/backend.did';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CommentForm from './CommentForm';

const CommentContainer = styled(Box)(({ theme }) => ({
 padding: theme.spacing(2),
 borderRadius: theme.spacing(1),
 backgroundColor: theme.palette.mode === 'dark' ? 'rgba(17, 24, 39, 0.6)' : 'rgba(255, 255, 255, 0.6)',
 border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(79, 70, 229, 0.2)'}`,
 marginBottom: theme.spacing(2),
}));

const CommentActionButton = styled(IconButton)(({ theme }) => ({
 color: theme.palette.mode === 'dark' ? '#E9D5FF' : '#6366F1',
 padding: theme.spacing(0.5),
 '&:hover': {
   backgroundColor: theme.palette.mode === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(79, 70, 229, 0.1)',
 },
 '&.Mui-disabled': {
   opacity: 0.8,
   color: theme.palette.mode === 'dark' ? '#9CA3AF' : '#4B5563',
   '& span': {
     color: theme.palette.mode === 'dark' ? '#E5E7EB' : '#1F2937',
     fontWeight: 500,
   },
 },
}));

interface ICommentProps {
 post: PostUser;
 allPosts: PostUser[];
 onUpdate: () => void;
}

const Comment: React.FC<ICommentProps> = ({ post, allPosts, onUpdate }) => {
 const [isReplying, setIsReplying] = useState(false);
 const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
 const [voteLoading, setVoteLoading] = useState(false);
 const [isChanged, setChanged] = useState(false);
 const { profile } = useSelector((state: any) => state.filesState);
 const { backendActor } = useBackendContext();
 const { enqueueSnackbar } = useSnackbar();
 const contentTree = useRef([]);

 const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
   setMenuAnchorEl(event.currentTarget);
 };

 const handleMenuClose = () => {
   setMenuAnchorEl(null);
 };

 const handleDelete = async () => {
   handleMenuClose();
   try {
     const result = await backendActor.delete_post(post.id);
     if (result.Ok === null) {
       onUpdate();
       enqueueSnackbar('Comment deleted successfully', { variant: 'success' });
     } else {
       enqueueSnackbar(JSON.stringify(result.Err), { variant: 'error' });
     }
   } catch (error) {
     enqueueSnackbar('Failed to delete comment: ' + error, { variant: 'error' });
   }
 };

 const handleVote = async (type: 'up' | 'down') => {
   if (profile?.id === post.creator.id) {
     enqueueSnackbar(`You can't ${type === 'up' ? 'like' : 'dislike'} your own comment`, { variant: 'error' });
     return;
   }

   setVoteLoading(true);
   try {
     const voteArray = type === 'up' ? post.votes_up : post.votes_down;
     if (voteArray.includes(profile.id)) {
       const res = await backendActor.unvote(post.id);
       if (res.Ok) {
         onUpdate();
       }
     } else {
       const res = await backendActor[`vote_${type}`](post.id);
       if (res.Ok) {
         onUpdate();
       }
     }
   } catch (error) {
     enqueueSnackbar('Failed to vote: ' + error, { variant: 'error' });
   } finally {
     setVoteLoading(false);
   }
 };

 const onSave = async () => {
   setChanged(false);
   const newPostObj: Post = {
     ...post,
     tags: [],
     content_tree: serializeFileContents(contentTree.current)[0][0][1],
     creator: profile.id,
     votes_up: post.votes_up,
     votes_down: post.votes_down,
   };

   try {
     const result = await backendActor.save_post(newPostObj);
     if (result.Ok) {
       onUpdate();
       enqueueSnackbar('Comment saved successfully', { variant: 'success' });
     } else {
       enqueueSnackbar(JSON.stringify(result.Err), { variant: 'error' });
     }
   } catch (error) {
     enqueueSnackbar('Failed to save: ' + error, { variant: 'error' });
   }
 };

 return (
   <CommentContainer>
     <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
       <UserAvatarMenu sx={{ mr: 2 }} user={post.creator} />
       <Box>
         <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
           {post.creator.name}
         </Typography>
         <Typography variant="caption" sx={{ color: '#9CA3AF' }}>
           {formatRelativeTime(Number(post.date_created))}
         </Typography>
       </Box>
       {profile?.id === post.creator.id && (
         <IconButton sx={{ ml: 'auto' }} onClick={handleMenuClick}>
           <MoreVertical size={20} />
         </IconButton>
       )}
     </Box>

     <Box sx={{ mb: 2 }}>
       <DndProvider backend={HTML5Backend}>
         <EditorComponent
           editorKey={post.id}
           readOnly={profile?.id !== post.creator.id}
           id={post.id}
           contentEditable={profile?.id === post.creator.id}
           onChange={(content) => {
             contentTree.current = { "": content };
             if (!isChanged && post.creator.id === profile?.id) {
               setChanged(true);
             }
           }}
           content={deserializeContentTree(post.content_tree)}
         />
       </DndProvider>
     </Box>

     <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
       <CommentActionButton
         onClick={() => handleVote('up')}
         disabled={!profile || profile.id === post.creator.id || voteLoading}
       >
         <Heart
           size={16}
           fill={post.votes_up.includes(profile?.id) ? '#A855F7' : 'none'}
         />
         <Box component="span" sx={{ ml: 0.5, fontSize: '0.75rem' }}>
           {post.votes_up.length}
         </Box>
       </CommentActionButton>

       <CommentActionButton
         onClick={() => handleVote('down')}
         disabled={!profile || profile.id === post.creator.id || voteLoading}
       >
         <ThumbsDown
           size={16}
           fill={post.votes_down.includes(profile?.id) ? '#A855F7' : 'none'}
         />
         <Box component="span" sx={{ ml: 0.5, fontSize: '0.75rem' }}>
           {post.votes_down.length}
         </Box>
       </CommentActionButton>

       <CommentActionButton
         onClick={() => setIsReplying(!isReplying)}
         disabled={!profile}
       >
         <Reply size={16} />
       </CommentActionButton>

       {profile?.id === post.creator.id && (
         <CommentActionButton disabled={!isChanged} onClick={onSave}>
           Save
         </CommentActionButton>
       )}
     </Box>

     <Menu
       anchorEl={menuAnchorEl}
       open={Boolean(menuAnchorEl)}
       onClose={handleMenuClose}
     >
       <MenuItem
         onClick={handleDelete}
         sx={{
           color: '#EF4444',
           '&:hover': {
             backgroundColor: 'rgba(239, 68, 68, 0.1)',
           },
         }}
       >
         Delete
       </MenuItem>
     </Menu>

     {isReplying && (
       <Box sx={{ mt: 2, ml: 4 }}>
         <CommentForm
           postId={post.id}
           onCommentSubmit={() => {
             setIsReplying(false);
             onUpdate();
           }}
           onCancel={() => setIsReplying(false)}
         />
       </Box>
     )}

     {post.children.length > 0 && (
       <Box sx={{ ml: 4, mt: 2 }}>
         {post.children.map(childId => {
           const childComment = allPosts.find(p => p.id === childId);
           if (childComment && childComment.is_comment) {
             return (
               <Comment
                 key={childId}
                 post={childComment}
                 allPosts={allPosts}
                 onUpdate={onUpdate}
               />
             );
           }
           return null;
         })}
       </Box>
     )}
   </CommentContainer>
 );
};

export default Comment;
