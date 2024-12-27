import React, { useState } from "react";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import { Box, TextField } from "@mui/material";
import CreatePost from "./createPost";
import ViewPostComponent from "./viewPost";
import { useSelector } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
const SocialFeed = (props) => {
  const { isDarkMode } = useSelector((state: any) => state.uiState);

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: "#4F46E5",
      },
      background: {
        default: isDarkMode ? "#0F0F13" : "#FAFBFC",
        paper: isDarkMode ? "#18181F" : "#F5F6F8",
      },
      text: {
        primary: isDarkMode ? "#E9D5FF" : "#1F2937",
        secondary: isDarkMode ? "#A78BFA" : "#6B7280",
      },
    },
  });

  const FeedWrapper = styled("div")(({ theme }) => ({
    minHeight: "100vh",
    width: "100%",
    maxWidth: "100vw",
    // background: theme.palette.background.default,
    padding: "2rem",
    overflowX: "hidden",
    "& *": {
      boxSizing: "border-box",
      maxWidth: "100%",
    },
  }));

  const Container = styled("div")({
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
  });

  const [posts, setPosts] = useState(props.posts);

  const handleDeletePost = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handlePostSubmit = (newPostObj: any) => {
    setPosts([newPostObj, ...posts]);
  };

  const { searchValue } = useSelector((state: any) => state.uiState);
  const filterPosts = React.useMemo(() => {
    const searchLower = searchValue.toLowerCase();
    return posts.filter((post) => {
      // Convert content_tree to a single string to search within it
      const contentTreeText = post.content_tree
        .map((node) => node.text?.toLowerCase() || '')
        .join(" ");

      return contentTreeText.includes(searchLower) ||
             post.creator?.name?.toLowerCase().includes(searchLower);
    });
  }, [posts, searchValue]);

  return (
    <ThemeProvider theme={theme}>
      <DndProvider backend={HTML5Backend}>
        <FeedWrapper>
          <Container>
            {/* Create Post Section */}
            <CreatePost onPostSubmit={handlePostSubmit} />

            {/* Search and Filter Section */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}></Box>
            </Box>

            {/* Posts Feed */}
            {filterPosts.map((post) => (
              <ViewPostComponent
                handleDeletePost={handleDeletePost}
                key={post.id}
                post={post}
                // onLike={handleLike}
              />
            ))}
          </Container>
        </FeedWrapper>
      </DndProvider>
    </ThemeProvider>
  );
};

export default SocialFeed;
