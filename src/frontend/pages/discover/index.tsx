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
import CreatePost from "./createPost";
import ViewPostComponent from "./viewPost";
import {PostUser} from "../../../declarations/backend/backend.did";

// Animation keyframes
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
`;

const shine = keyframes`
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
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

export const StyledTextField = styled(TextField)({
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



export const TagChip = styled("span")({
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
const samplePosts: Array<PostUser> = [
  {
    id: "1",
    creator: {
      id: "user1",
      name: "John Doe"
    },
    date_created: BigInt(Date.now() * 1000000),
    votes_up: [],
    votes_down: [],
    tags: ["#crypto", "#defi"],
    content_tree: [
      {
        id: "node1",
        _type: "text",
        value: "",
        data: [],
        text: "Just made my first transaction on ODoc! 🚀",
        children: [],
        language: "",
        indent: BigInt(0),
        listStart: BigInt(0),
        parent: [],
        listStyleType: ""
      }
    ]
  }
];


const SocialFeed = (props) => {

  const [posts, setPosts] = useState(props.posts);
  // const [posts, setPosts] = useState(samplePosts);
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

  // const handleComment = (postId, comment) => {
  //   setPosts(
  //     posts.map((post) =>
  //       post.id === postId
  //         ? {
  //             ...post,
  //             comments: [
  //               ...post.comments,
  //               {
  //                 id: post.comments.length + 1,
  //                 author: "Current User",
  //                 content: comment,
  //                 replies: [],
  //               },
  //             ],
  //           }
  //         : post,
  //     ),
  //   );
  // };

  const filterPosts = () => {
    return posts.filter((post) => {
      // const matchesSearch =
      //   JSON.stringify(post.content_tree).toLowerCase().includes(searchTerm.toLowerCase()) ||
      //   post.creator.name.toLowerCase().includes(searchTerm.toLowerCase());
      // const matchesTags =
      //   selectedTags.length === 0 ||
      //   selectedTags.some((tag) => post.tags.includes(tag));
      return posts;
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
