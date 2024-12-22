import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import {
  Comment as MessageCircleIcon,
  Favorite as HeartIcon,
  Reply as ReplyIcon,
  Send as SendIcon,
  Share as ShareIcon,
  ThumbDown as ThumbsDownIcon,
} from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import UserAvatarMenu from "../../components/MainComponents/UserAvatarMenu";

const Comment = ({ comment, onReply, level = 0 }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const handleReplySubmit = () => {
    if (!replyContent.trim()) return;
    onReply(comment.id, replyContent);
    setReplyContent("");
    setShowReplyInput(false);
  };

  return (
    <Box sx={{ ml: level * 3, mb: 2 }}>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          <UserAvatarMenu user={comment.user} size="small" />
          <Box>
            <Typography variant="subtitle2">{comment.user.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {comment.timestamp}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {comment.content}
        </Typography>
        <Button
          size="small"
          startIcon={<ReplyIcon />}
          onClick={() => setShowReplyInput(!showReplyInput)}
        >
          Reply
        </Button>
      </Paper>

      {showReplyInput && (
        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Write a reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <IconButton onClick={handleReplySubmit} color="primary">
            <SendIcon />
          </IconButton>
        </Box>
      )}

      {comment.replies?.map((reply) => (
        <Comment
          key={reply.id}
          comment={reply}
          onReply={onReply}
          level={level + 1}
        />
      ))}
    </Box>
  );
};

const SearchField = ({ searchQuery, setSearchQuery }) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <TextField
          fullWidth
          placeholder="Search posts by content or user..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <Box sx={{ color: "text.secondary", mr: 1 }}>
                <SearchIcon />
              </Box>
            ),
          }}
        />
      </CardContent>
    </Card>
  );
};

const SocialPosts = () => {
  const currentUser = {
    id: 1,
    name: "John Doe",
    username: "johndoe",
    avatarUrl: null,
  };

  const [posts, setPosts] = useState([
    {
      id: 1,
      content: "This is my first post!",
      likes: 0,
      dislikes: 0,
      comments: [],
      isLiked: false,
      isDisliked: false,
      user: {
        id: 2,
        name: "Jane Smith",
        username: "janesmith",
        avatarUrl: null,
      },
    },
  ]);

  const [newPostContent, setNewPostContent] = useState("");
  const [commentInputs, setCommentInputs] = useState({});
  const [showComments, setShowComments] = useState({});

  const handleNewPost = () => {
    if (!newPostContent.trim()) return;

    setPosts([
      {
        id: Date.now(),
        content: newPostContent,
        likes: 0,
        dislikes: 0,
        comments: [],
        isLiked: false,
        isDisliked: false,
        user: currentUser,
      },
      ...posts,
    ]);
    setNewPostContent("");
  };

  const [searchQuery, setSearchQuery] = useState("");

  // Add this function after other handler functions
  const filteredPosts = posts.filter(
    (post) =>
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.user.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleLike = (postId) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          if (post.isLiked) {
            return { ...post, likes: post.likes - 1, isLiked: false };
          } else {
            if (post.isDisliked) {
              return {
                ...post,
                likes: post.likes + 1,
                dislikes: post.dislikes - 1,
                isLiked: true,
                isDisliked: false,
              };
            }
            return { ...post, likes: post.likes + 1, isLiked: true };
          }
        }
        return post;
      }),
    );
  };

  const handleDislike = (postId) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          if (post.isDisliked) {
            return { ...post, dislikes: post.dislikes - 1, isDisliked: false };
          } else {
            if (post.isLiked) {
              return {
                ...post,
                likes: post.likes - 1,
                dislikes: post.dislikes + 1,
                isLiked: false,
                isDisliked: true,
              };
            }
            return { ...post, dislikes: post.dislikes + 1, isDisliked: true };
          }
        }
        return post;
      }),
    );
  };

  const handleShare = (postId) => {
    alert("Share functionality would go here!");
  };

  const toggleComments = (postId) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleComment = (postId) => {
    if (!commentInputs[postId]?.trim()) return;

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [
              ...post.comments,
              {
                id: Date.now(),
                content: commentInputs[postId],
                timestamp: new Date().toLocaleString(),
                replies: [],
                user: currentUser,
              },
            ],
          };
        }
        return post;
      }),
    );

    setCommentInputs((prev) => ({
      ...prev,
      [postId]: "",
    }));
  };

  const handleReply = (postId, commentId, replyContent) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const updatedComments = addReplyToComment(post.comments, commentId, {
            id: Date.now(),
            content: replyContent,
            timestamp: new Date().toLocaleString(),
            replies: [],
            user: currentUser,
          });
          return { ...post, comments: updatedComments };
        }
        return post;
      }),
    );
  };

  const addReplyToComment = (comments, commentId, reply) => {
    return comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply],
        };
      }
      if (comment.replies?.length) {
        return {
          ...comment,
          replies: addReplyToComment(comment.replies, commentId, reply),
        };
      }
      return comment;
    });
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <UserAvatarMenu user={currentUser} />
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="What's on your mind?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
          </Box>
          <Button variant="contained" fullWidth onClick={handleNewPost}>
            Post
          </Button>
        </CardContent>
      </Card>

      <SearchField searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {filteredPosts.map((post) => (
        <Card key={post.id} sx={{ mb: 2 }}>
          <CardHeader
            avatar={<UserAvatarMenu user={post.user} />}
            title={post.user.name}
            subheader={`@${post.user.username}`}
          />
          <CardContent>
            <Typography variant="body1">{post.content}</Typography>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  startIcon={<HeartIcon />}
                  onClick={() => handleLike(post.id)}
                  color={post.isLiked ? "primary" : "inherit"}
                >
                  {post.likes}
                </Button>
                <Button
                  startIcon={<ThumbsDownIcon />}
                  onClick={() => handleDislike(post.id)}
                  color={post.isDisliked ? "error" : "inherit"}
                >
                  {post.dislikes}
                </Button>
                <Button
                  startIcon={<MessageCircleIcon />}
                  onClick={() => toggleComments(post.id)}
                >
                  {post.comments.length}
                </Button>
              </Box>
              <IconButton onClick={() => handleShare(post.id)}>
                <ShareIcon />
              </IconButton>
            </Box>

            {showComments[post.id] && (
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Write a comment..."
                    value={commentInputs[post.id] || ""}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                  />
                  <IconButton
                    onClick={() => handleComment(post.id)}
                    color="primary"
                  >
                    <SendIcon />
                  </IconButton>
                </Box>

                <Box sx={{ mt: 2 }}>
                  {post.comments.map((comment) => (
                    <Comment
                      key={comment.id}
                      comment={comment}
                      onReply={(commentId, content) =>
                        handleReply(post.id, commentId, content)
                      }
                    />
                  ))}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default SocialPosts;
