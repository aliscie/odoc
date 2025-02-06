import React, { useState } from "react";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
// Reusable sidebar card component
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CreatePost from "./createPost";
import ViewPostComponent from "./viewPost";
import { useSelector } from "react-redux";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { RootState } from "../../redux/reducers";
import LoadMorePosts from "./LoadMorePosts";

const SidebarCard = ({ title, children }) => (
  <Card sx={{ mb: 2, borderRadius: 1 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {children}
    </CardContent>
  </Card>
);

const FeedWrapper = styled("div")(({ theme, isNavOpen }) => ({
  minHeight: "100vh",
  width: "100%",
  padding: theme.spacing(4),
  overflowX: "hidden",
  position: "relative",
  zIndex: 1,
  display: "grid",
  gridTemplateColumns: "1fr", // Default for mobile
  gap: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.up("md")]: {
    gridTemplateColumns: isNavOpen
      ? "minmax(0, 1fr) 280px" // Original two-column layout when nav is open
      : "280px minmax(0, 1fr) 280px", // Three-column layout when nav is closed
  },
}));

const MainContainer = styled("div")(({ theme }) => ({
  width: "100%",
  maxWidth: "800px",
  margin: "0 auto",
  "& > *": {
    marginBottom: theme.spacing(3),
  },
}));

const SocialFeed = () => {
  const { posts } = useSelector((state: RootState) => state.filesState);

  const { isLoggedIn, isDarkMode, searchValue, isNavOpen } = useSelector(
    (state) => state.uiState,
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const customTheme = createTheme({
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

  // const [posts, setPosts] = useState(props.posts);

  // const handleDeletePost = (postId) => {
  //   setPosts((prev) => prev.filter((p) => p.id !== postId));
  // };
  //
  // const handlePostSubmit = (newPostObj) => {
  //   setPosts([newPostObj, ...posts]);
  // };

  const filterPosts = React.useMemo(() => {
    const searchLower = searchValue.toLowerCase();
    return posts.filter((post) => {
      const contentTreeText = post?.content_tree
        .map((node) => node.text?.toLowerCase() || "")
        .join(" ");
      return (
        contentTreeText.includes(searchLower) ||
        post.creator?.name?.toLowerCase().includes(searchLower)
      );
    });
  }, [posts, searchValue]);

  // Sidebar content configuration
  const sidebarContent = {
    left: [
      {
        title: "Categories",
        content: ["Technology", "Design", "Development", "Career"],
        type: "list",
      },
      {
        title: "Popular Topics",
        content: ["Web Development", "UI/UX", "Mobile Apps"],
        type: "list",
      },
    ],
    right: [
      {
        title: "Top Tags",
        content: [
          "Hiring",
          "JobSpeaking",
          "Rust",
          "SNS",
          "React",
          "JavaScript",
          "TypeScript",
          "Node.js",
          "CSS",
        ],
        type: "tags",
      },
      // {
      //   title: "Top Users",
      //   content: ["John Doe", "Jane Smith", "Alex Johnson"],
      //   type: "list",
      // },
      // {
      //   title: "Video Tutorials",
      //   content: [
      //     {
      //       title: "What is odoc",
      //       videoUrl: "https://www.youtube.com/embed/Sf1YE-2rYvo",
      //       description:
      //         "Unlock the Power of Freedom: Save Time, Resources, and Gain Control with Odoc\n",
      //     },
      //     {
      //       title: "Get started",
      //       videoUrl: "https://www.youtube.com/embed/Lg-0q5oEenk",
      //       description:
      //         "A guide to using Internet Identity for authentication",
      //     },
      //
      //     {
      //       title: "Make friends",
      //       videoUrl: "https://www.youtube.com/embed/f0RVw6RJxos",
      //       description: "Social networking guide for Odoc",
      //     },
      //     {
      //       title: "Make payments",
      //
      //       videoUrl: "https://www.youtube.com/embed/XnOF1i1Een8",
      //       description: "Step-by-step guide for ODOC payments and documents",
      //     },
      //   ],
      //   type: "tutorials",
      // },
    ],
  };

  const [expandedTutorial, setExpandedTutorial] = useState(false);

  const handleTutorialChange = (panel) => (event, isExpanded) => {
    setExpandedTutorial(isExpanded ? panel : false);
  };

  const renderCardContent = (content, type) => {
    if (type === "tags") {
      return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {content.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(0, 0, 0, 0.08)",
              }}
            />
          ))}
        </Box>
      );
    }
    return (
      <List dense>
        {content.map((item) => (
          <ListItem key={item}>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    );
  };

  const Sidebar = ({ items, position }) => (
    <Box
      component="aside"
      sx={{
        display: { xs: "none", md: "block" },
        visibility: position === "left" && isNavOpen ? "hidden" : "visible",
        width: position === "left" && isNavOpen ? 0 : "280px",
        overflow: "hidden",
        transition: theme.transitions.create(["width", "visibility"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      {items.map((item, index) => (
        <SidebarCard key={index} title={item.title}>
          {renderCardContent(item.content, item.type)}
        </SidebarCard>
      ))}
    </Box>
  );

  return (
    <ThemeProvider theme={customTheme}>
      <FeedWrapper isNavOpen={isNavOpen}>
        {!isNavOpen && <Sidebar items={sidebarContent.left} position="left" />}
        <MainContainer>
          {isLoggedIn && <CreatePost />}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }} />
          </Box>
          {filterPosts
            .filter((post) => !post.is_comment)
            .map((post) => (
              <ViewPostComponent
                // setPosts={setPosts}
                posts={posts}
                // handleDeletePost={handleDeletePost}
                key={post.id}
                post={post}
              />
            ))}
          <LoadMorePosts />
        </MainContainer>
        <Sidebar items={sidebarContent.right} position="right" />
      </FeedWrapper>
    </ThemeProvider>
  );
};

export default SocialFeed;
