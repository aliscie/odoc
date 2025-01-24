import React from 'react';
import { Box } from '@mui/material';
import { PostUser } from '../../../declarations/backend/backend.did';
import Comment from './Comment';
import CommentForm from './CommentForm';

interface Props {
  post: PostUser;
  allPosts: PostUser[];
  onUpdate: () => void;
}

const CommentList: React.FC<Props> = ({ post, allPosts, onUpdate }) => (
  <Box  sx={{ mt: 3 }}>
    <CommentForm
      postId={post.id}
      onCommentSubmit={onUpdate}
    />
    {post.children.map(childId => {
      const comment = allPosts.find(p => p.id === childId);
      if (comment && comment.is_comment) {
        return (
          <Comment
            key={childId}
            post={comment}
            allPosts={allPosts}
            onUpdate={onUpdate}
          />
        );
      }
      return null;
    })}
  </Box>
);

export default CommentList;
