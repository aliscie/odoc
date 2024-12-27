import React, { useState } from "react";
import {
  createTheme,
  keyframes,
  styled,
  ThemeProvider,
} from "@mui/material/styles";
import { Box, InputAdornment, TextField } from "@mui/material";
import { Search } from "lucide-react";
import CreatePost from "./createPost";
import ViewPostComponent from "./viewPost";

// Animation keyframes

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

// Sample data structure

const SocialFeed = (props) => {
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
