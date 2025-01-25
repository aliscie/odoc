import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { PostUser } from "../../../declarations/backend/backend.did";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";

interface Props {
  post: PostUser;
  onUpdate: (PostUser) => void;
}

const CommentList: React.FC<Props> = ({ post, onUpdate }) => {
  const { posts } = useSelector((state: RootState) => state.filesState);
  const [comments, setComments] = useState<PostUser[]>([]);

  useEffect(() => {
    const commentPosts = post.children
      .map((childId) => posts.find((p) => p.id === childId))
      .filter(
        (comment): comment is PostUser =>
          comment !== undefined && comment.is_comment,
      );
    setComments(commentPosts);
  }, [post.children, posts]);

  const handleCommentSubmit = async (data) => {
    await onUpdate(data);
  };

  return (
    <Box key={post.children.length} sx={{ mt: 3 }}>
      <CommentForm postId={post.id} onCommentSubmit={onUpdate} />
      {comments.map((comment) => (
        <Comment
          key={posts.length}
          post={comment}
          onUpdate={handleCommentSubmit}
        />
      ))}
    </Box>
  );
};

export default CommentList;
