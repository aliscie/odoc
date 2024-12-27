import React, { useState } from "react";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import { keyframes } from "@mui/material/styles";
import { Box, InputAdornment, TextField } from "@mui/material";
import { Search } from "lucide-react";
import CreatePost from "./createPost";
import ViewPostComponent from "./viewPost";
import { useSelector } from "react-redux";

const SocialFeed = (props) => {
  const { isDarkMode } = useSelector((state: any) => state.uiState);
  
  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: "#4F46E5",
      },
      // background: {
      //   default: isDarkMode ? "#0F0F13" : "#FAFBFC",
      //   paper: isDarkMode ? "#18181F" : "#F5F6F8",
      // },
      text: {
        primary: isDarkMode ? "#E9D5FF" : "#1F2937",
        secondary: isDarkMode ? "#A78BFA" : "#6B7280",
      },
    },
  });

  const glowPulse = keyframes`
    0%, 100% { opacity: 1; filter: brightness(1); }
    50% { opacity: 0.8; filter: brightness(1.2); }
  `;

  const FeedWrapper = styled("div")(({ theme }) => ({
    minHeight: "100vh",
    width: "100%",
    maxWidth: "100vw",
    padding: "2rem",
    overflowX: "hidden",
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      background: "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.05) 0%, transparent 70%)",
      animation: `${glowPulse} 4s ease-in-out infinite`,
      pointerEvents: "none",
    },
    "& *": {
      boxSizing: "border-box",
      maxWidth: "100%",
    },
  }));

  const BackgroundEffect = styled("div")({
    position: "fixed",
    borderRadius: "50%",
    filter: "blur(100px)",
    opacity: 0.5,
    zIndex: -1,
    "&.top": {
      top: "5%",
      left: "5%",
      width: "30%",
      height: "30%",
      background: "rgba(79, 70, 229, 0.1)",
      animation: `${glowPulse} 4s infinite`,
    },
    "&.bottom": {
      bottom: "5%",
      right: "5%",
      width: "30%",
      height: "30%",
      background: "rgba(124, 58, 237, 0.1)",
      animation: `${glowPulse} 4s infinite 1s`,
    },
  });

  const Container = styled("div")({
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
  });

  const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "1rem",
    background: theme.palette.mode === "dark"
      ? "rgba(17, 24, 39, 0.75)"
      : "rgba(255, 255, 255, 0.75)",
    backdropFilter: "blur(10px)",
    border: `1px solid ${theme.palette.mode === "dark"
      ? "rgba(139, 92, 246, 0.2)"
      : "rgba(79, 70, 229, 0.2)"}`,
    transition: "all 0.3s ease",
    "& fieldset": {
      border: "none",
    },
    "&:hover": {
      background: theme.palette.mode === "dark"
        ? "rgba(17, 24, 39, 0.85)"
        : "rgba(255, 255, 255, 0.85)",
      border: `1px solid ${theme.palette.mode === "dark"
        ? "rgba(139, 92, 246, 0.3)"
        : "rgba(79, 70, 229, 0.3)"}`,
    },
    "&.Mui-focused": {
      background: theme.palette.mode === "dark"
        ? "rgba(17, 24, 39, 0.9)"
        : "rgba(255, 255, 255, 0.9)",
      border: `1px solid ${theme.palette.mode === "dark"
        ? "rgba(139, 92, 246, 0.5)"
        : "rgba(79, 70, 229, 0.5)"}`,
    },
  },
}));

  const [posts, setPosts] = useState(props.posts);
  // const [posts, setPosts] = useState(samplePosts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDeletePost = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handlePostSubmit = (newPostObj: any) => {
    setPosts([newPostObj, ...posts]);
  };

  // const handleLike = (postId) => {
  //   setPosts(
  //     posts.map((post) =>
  //       post.id === postId ? { ...post, likes: post.likes + 1 } : post,
  //     ),
  //   );
  // };

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
        <BackgroundEffect className="top" />
        <BackgroundEffect className="bottom" />
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
              {/*{Array.from(new Set(posts.flatMap((post) => post.tags))).map(*/}
              {/*  (tag) => (*/}
              {/*    <TagChip*/}
              {/*      key={tag}*/}
              {/*      onClick={() =>*/}
              {/*        setSelectedTags((prev) =>*/}
              {/*          prev.includes(tag)*/}
              {/*            ? prev.filter((t) => t !== tag)*/}
              {/*            : [...prev, tag],*/}
              {/*        )*/}
              {/*      }*/}
              {/*      style={{*/}
              {/*        background: selectedTags.includes(tag)*/}
              {/*          ? "rgba(139, 92, 246, 0.4)"*/}
              {/*          : undefined,*/}
              {/*      }}*/}
              {/*    >*/}
              {/*      {tag}*/}
              {/*    </TagChip>*/}
              {/*  ),*/}
              {/*)}*/}
            </Box>
          </Box>

          {/* Posts Feed */}
          {filterPosts().map((post) => (
            <ViewPostComponent
              handleDeletePost={handleDeletePost}
              key={post.id}
              post={post}
              // onLike={handleLike}
            />
          ))}
        </Container>
      </FeedWrapper>
    </ThemeProvider>
  );
};

export default SocialFeed;
