import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { PostUser } from '../../../declarations/backend/backend.did';
import Comment from './Comment';
import CommentForm from './CommentForm';

interface Props {
  post: PostUser;
  allPosts: PostUser[];
  onUpdate: () => void;
}

const CommentList: React.FC<Props> = ({ post, allPosts, onUpdate }) => {
  const [comments, setComments] = useState<PostUser[]>([]);

  useEffect(() => {
    const commentPosts = post.children
      .map(childId => allPosts.find(p => p.id === childId))
      .filter((comment): comment is PostUser => 
        comment !== undefined && comment.is_comment
      );
    setComments(commentPosts);
  }, [post.children, allPosts]);

  const handleCommentSubmit = async () => {
    await onUpdate();
  };

  return (
  <Box  sx={{ mt: 3 }}>
    <CommentForm
      postId={post.id}
      onCommentSubmit={onUpdate}
    />
    {comments.map(comment => (
      <Comment
        key={comment.id}
        post={comment}
        allPosts={allPosts}
        onUpdate={handleCommentSubmit}
      />
    ))}
  </Box>
  );
};

export default CommentList;
