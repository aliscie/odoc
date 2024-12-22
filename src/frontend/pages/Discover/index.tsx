import React, { useEffect } from "react";
import "../styles/LandingPage.css";
import { Button, Divider, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import CreatePost from "./CreateNewPost";
import { PostUser } from "../../../declarations/backend/backend.did";
import { useSnackbar } from "notistack";
import FilterPosts from "./PostsFilters";
import ViewPost from "./ViewUpdatePost";
import { useBackendContext } from "../../contexts/BackendContext";


import {
  Favorite as HeartIcon,
  ThumbDown as ThumbsDownIcon,
  Share as ShareIcon,
  Comment as MessageCircleIcon,
  Send as SendIcon,
  Reply as ReplyIcon,
  Email as MailIcon,
  Person as UserIcon,
} from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";

const UserAvatar = ({ user, size = "medium" }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Avatar
        src={user.avatarUrl}
        alt={user.name}
        onClick={handleClick}
        sx={{
          width: size === "small" ? 32 : 40,
          height: size === "small" ? 32 : 40,
          cursor: "pointer",
        }}
      >
        {!user.avatarUrl && user.name.charAt(0)}
      </Avatar>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box sx={{ p: 2, width: 250 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Avatar
              src={user.avatarUrl}
              alt={user.name}
              sx={{ width: 60, height: 60, mb: 1 }}
            >
              {!user.avatarUrl && user.name.charAt(0)}
            </Avatar>
            <Typography variant="subtitle1">{user.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              @{user.username}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<UserIcon />}
              onClick={() =>
                (window.location.href = `/profile/${user.username}`)
              }
            >
              Profile
            </Button>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<MailIcon />}
              onClick={() =>
                (window.location.href = `/messages/${user.username}`)
              }
            >
              Message
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

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
          <UserAvatar user={comment.user} size="small" />
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
    <Card >
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

const Discover = () => {
  const { backendActor } = useBackendContext();
  const { searchValue } = useSelector((state: any) => state.uiState);
  const { isLoggedIn } = useSelector((state: any) => state.uiState);

  const [posts, setPosts] = React.useState<Array<PostUser>>([]);
  const [current_page, setPage] = React.useState<number>(0);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const delayedSearch = async () => {
      if (searchValue.length > 0) {
        let res: Array<PostUser> = await backendActor.search_posts(searchValue);
        res && setPosts(res);
      } else {
        setPage(0);
        setPosts([]);
        await set_posts();
      }
    };

    clearTimeout(timeoutId);
    timeoutId = setTimeout(delayedSearch, 300);

    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  async function set_posts() {
    posts.length > 0 && setPage(posts.length);
    let res: Array<PostUser> = await backendActor.get_posts(
      BigInt(current_page),
      BigInt(current_page + 10)
    );

    if (res && res.length > 0) {
      setPosts((pre) => {
        return posts.length == 0 ? [...res] : [...pre, ...res];
      });
    } else if (res && res.length == 0) {
      enqueueSnackbar("There are no more posts to load.", { variant: "info" });
    } else {
      enqueueSnackbar("undefined Error getting posts.", { variant: "error" });
    }
  }

  useEffect(() => {
    (async () => {
      await set_posts();
    })();
  }, []);

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
    <Grid
      sx={{
        marginLeft: "20%",
        marginRight: "20%",
      }}
    >
      {isLoggedIn && <CreatePost setPosts={setPosts} />}
      <Divider />
      <FilterPosts initPosts={posts} setPage={setPage} setPosts={setPosts} />
      {posts &&
        posts.map((post: PostUser) => {
          return (
            <Grid
              item
              key={post.id}
              sx={{
                my: 1,
              }}
            >
              <ViewPost setPosts={setPosts} post={post} posts={posts} />
            </Grid>
          );
        })}

      <Button
        onClick={async () => {
          await set_posts();
        }}
      >
        Load more
      </Button>
    </Grid>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <UserAvatar user={currentUser} />
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
            avatar={<UserAvatar user={post.user} />}
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

export default Discover;
