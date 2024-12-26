import React, { useState, useEffect } from "react";
import {
  styled,
  ThemeProvider,
  createTheme,
  keyframes,
} from "@mui/material/styles";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  Avatar,
  InputAdornment,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Heart,
  ThumbsDown,
  MessageCircle,
  Share2,
  Send,
  Hash,
  Search,
  MoreVertical,
  Image as ImageIcon,
  Smile,
  Filter,
} from "lucide-react";

// Animation keyframes
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
`;

const shine = keyframes`
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
`;

const shimmer = keyframes`
  0% { transform: translateX(-50%); }
  100% { transform: translateX(50%); }
`;

// Theme
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4F46E5",
    },
  },
});

// Styled Components
const FeedWrapper = styled("div")({
  minHeight: "100vh",
  width: "100%",
  maxWidth: "100vw",
  // background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #000000 100%)",
  padding: "2rem",
  overflowX: "hidden",
  "& *": {
    boxSizing: "border-box",
    maxWidth: "100%",
  },
});

const Container = styled("div")({
  maxWidth: "1200px",
  margin: "0 auto",
  width: "100%",
});

const CreatePostCard = styled(Card)({
  background: "rgba(17, 24, 39, 0.85)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(139, 92, 246, 0.2)",
  borderRadius: "1rem",
  marginBottom: "2rem",
  overflow: "visible",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)",
    animation: `${shimmer} 2s linear infinite`,
  },
});

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "1rem",
    background: "rgba(255, 255, 255, 0.05)",
    "& fieldset": {
      borderColor: "rgba(139, 92, 246, 0.2)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(139, 92, 246, 0.3)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "rgba(139, 92, 246, 0.5)",
    },
  },
});

const PostActionButton = styled(IconButton)({
  color: "#E9D5FF",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.1)",
    color: "#A855F7",
  },
});

const PostCard = styled(Card)({
  background: "rgba(17, 24, 39, 0.75)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(139, 92, 246, 0.2)",
  borderRadius: "1rem",
  marginBottom: "1rem",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
  },
});

const TagChip = styled("span")({
  background: "rgba(139, 92, 246, 0.2)",
  color: "#E9D5FF",
  padding: "0.25rem 0.75rem",
  borderRadius: "9999px",
  fontSize: "0.875rem",
  margin: "0.25rem",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "rgba(139, 92, 246, 0.3)",
    transform: "translateY(-1px)",
  },
});

// Sample data structure
const samplePosts = [
  {
    id: 1,
    author: {
      name: "John Doe",
      avatar: "/api/placeholder/32/32",
    },
    content: "Just made my first transaction on ODoc! 🚀",
    tags: ["#crypto", "#defi"],
    likes: 24,
    dislikes: 2,
    comments: [
      {
        id: 1,
        author: "Jane Smith",
        content: "Congrats! How was the experience?",
        replies: [
          {
            id: 1,
            author: "John Doe",
            content: "Super smooth and fast!",
          },
        ],
      },
    ],
    shares: 5,
    timestamp: "2h ago",
  },
  // Add more sample posts...
];

interface CreatePostProps {
  onPostSubmit: (post: any) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostSubmit }) => {
  const [newPost, setNewPost] = useState("");

  const extractTags = (content: string) => {
    const tags = content.match(/#\w+/g);
    return tags || [];
  };

  const handleSubmit = () => {
    if (!newPost.trim()) return;

    const newPostObj = {
      id: Date.now(),
      author: {
        name: "Current User",
        avatar: "/api/placeholder/32/32",
      },
      content: newPost,
      tags: extractTags(newPost),
      likes: 0,
      dislikes: 0,
      comments: [],
      shares: 0,
      timestamp: "Just now",
    };

    onPostSubmit(newPostObj);
    setNewPost("");
  };

  return (
    <CreatePostCard>
      <CardContent>
        <StyledTextField
          fullWidth
          multiline
          rows={3}
          placeholder="What's on your mind?"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <IconButton>
              <ImageIcon color="#E9D5FF" />
            </IconButton>
            <IconButton>
              <Smile color="#E9D5FF" />
            </IconButton>
            <IconButton>
              <Hash color="#E9D5FF" />
            </IconButton>
          </Box>
          <Button
            variant="contained"
            endIcon={<Send />}
            onClick={handleSubmit}
            sx={{
              borderRadius: "9999px",
              background: "linear-gradient(90deg, #6366F1, #8B5CF6)",
              "&:hover": {
                background: "linear-gradient(90deg, #4F46E5, #7C3AED)",
              },
            }}
          >
            Post
          </Button>
        </Box>
      </CardContent>
    </CreatePostCard>
  );
};

interface ViewPostComponentProps {
  post: any;
  onLike: (postId: string) => void;
}

const ViewPostComponent: React.FC<ViewPostComponentProps> = ({ post, onLike }) => {
  return (
    <PostCard>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar src={post.author.avatar} sx={{ mr: 2 }} />
          <Box>
            <Box sx={{ fontWeight: "bold", color: "#E9D5FF" }}>
              {post.author.name}
            </Box>
            <Box sx={{ fontSize: "0.875rem", color: "#A78BFA" }}>
              {post.timestamp}
            </Box>
          </Box>
          <IconButton sx={{ ml: "auto" }}>
            <MoreVertical color="#E9D5FF" size={20} />
          </IconButton>
        </Box>

        <Box sx={{ mb: 2, color: "#E9D5FF" }}>{post.content}</Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {post.tags.map((tag) => (
            <TagChip key={tag}>{tag}</TagChip>
          ))}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            color: "#A78BFA",
          }}
        >
          <PostActionButton onClick={() => onLike(post.id)}>
            <Heart size={20} fill={post.liked ? "#A855F7" : "none"} />
            <Box component="span" sx={{ ml: 1, fontSize: "0.875rem" }}>
              {post.likes}
            </Box>
          </PostActionButton>

          <PostActionButton>
            <ThumbsDown size={20} />
            <Box component="span" sx={{ ml: 1, fontSize: "0.875rem" }}>
              {post.dislikes}
            </Box>
          </PostActionButton>

          <PostActionButton>
            <MessageCircle size={20} />
            <Box component="span" sx={{ ml: 1, fontSize: "0.875rem" }}>
              {post.comments.length}
            </Box>
          </PostActionButton>

          <PostActionButton>
            <Share2 size={20} />
            <Box component="span" sx={{ ml: 1, fontSize: "0.875rem" }}>
              {post.shares}
            </Box>
          </PostActionButton>
        </Box>

        {/* Comments Section */}
        {post.comments.length > 0 && (
          <Box
            sx={{
              mt: 2,
              pl: 2,
              borderLeft: "2px solid rgba(139, 92, 246, 0.2)",
            }}
          >
            {post.comments.map((comment) => (
              <Box key={comment.id} sx={{ mb: 2 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", mb: 1 }}
                >
                  <Box
                    sx={{
                      fontWeight: "bold",
                      color: "#E9D5FF",
                      fontSize: "0.875rem",
                    }}
                  >
                    {comment.author}
                  </Box>
                </Box>
                <Box sx={{ color: "#E9D5FF", fontSize: "0.875rem" }}>
                  {comment.content}
                </Box>
                {/* Replies */}
                {comment.replies.map((reply) => (
                  <Box
                    key={reply.id}
                    sx={{ ml: 4, mt: 1, fontSize: "0.875rem" }}
                  >
                    <Box sx={{ fontWeight: "bold", color: "#E9D5FF" }}>
                      {reply.author}
                    </Box>
                    <Box sx={{ color: "#E9D5FF" }}>{reply.content}</Box>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </PostCard>
  );
};

const SocialFeed = () => {
  const [posts, setPosts] = useState(samplePosts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePostSubmit = (newPostObj: any) => {
    setPosts([newPostObj, ...posts]);
  };

  const handleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post,
      ),
    );
  };

  const handleComment = (postId, comment) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: post.comments.length + 1,
                  author: "Current User",
                  content: comment,
                  replies: [],
                },
              ],
            }
          : post,
      ),
    );
  };

  const filterPosts = () => {
    return posts.filter((post) => {
      const matchesSearch =
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => post.tags.includes(tag));
      return matchesSearch && matchesTags;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <FeedWrapper>
        <Container>
          {/* Create Post Section */}
          <CreatePost onPostSubmit={handlePostSubmit} />

          {/* Search and Filter Section */}
          <Box sx={{ mb: 4 }}>
            <StyledTextField
              fullWidth
              placeholder="Search posts..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="#E9D5FF" />
                  </InputAdornment>
                ),
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {Array.from(new Set(posts.flatMap((post) => post.tags))).map(
                (tag) => (
                  <TagChip
                    key={tag}
                    onClick={() =>
                      setSelectedTags((prev) =>
                        prev.includes(tag)
                          ? prev.filter((t) => t !== tag)
                          : [...prev, tag],
                      )
                    }
                    style={{
                      background: selectedTags.includes(tag)
                        ? "rgba(139, 92, 246, 0.4)"
                        : undefined,
                    }}
                  >
                    {tag}
                  </TagChip>
                ),
              )}
            </Box>
          </Box>

          {/* Posts Feed */}
          {filterPosts().map((post) => (
            <ViewPostComponent 
              key={post.id}
              post={post}
              onLike={handleLike}
            />
          ))}
        </Container>
      </FeedWrapper>
    </ThemeProvider>
  );
};

export default SocialFeed;
