import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import VideoPlayer from "./videoPlayer";
import VideoList from "./videoList";

interface Tutorial {
  title: string;
  videoUrl: string;
  description: string;
  checkCondition?: (state: any) => boolean;
}

const tutorials: Tutorial[] = [
  {
    title: "What is odoc",
    videoUrl: "https://www.youtube.com/embed/Sf1YE-2rYvo",
    description:
      "Unlock the Power of Freedom: Save Time, Resources, and Gain Control with Odoc",
    checkCondition: (state: any) => {
      const { wallet } = state.filesState;
      return wallet?.exchanges?.length > 0;
    },
  },
  {
    title: "Internet identity",
    videoUrl: "https://www.youtube.com/embed/Lg-0q5oEenk",
    description: "A guide to using Internet Identity for authentication",
    checkCondition: (state: any) => {
      const { isLoggedIn } = state.uiState;
      return isLoggedIn;
    },
  },
  {
    title: "Make friends",
    videoUrl: "https://www.youtube.com/embed/f0RVw6RJxos",
    description: "Social networking guide for Odoc",
    checkCondition: (state: any) => {
      const { isLoggedIn } = state.uiState;
      const { profile, all_friends } = state.filesState;
      return (
        isLoggedIn &&
        profile?.id &&
        all_friends.filter((f: any) => f.id !== profile?.id).length > 0
      );
    },
  },
  {
    title: "Make payments",
    videoUrl: "https://www.youtube.com/embed/XnOF1i1Een8",
    description: "Step-by-step guide for ODOC payments and documents",
    checkCondition: (state: any) => {
      const { wallet } = state.filesState;
      return wallet?.exchanges?.length > 0;
    },
  },
];

const GettingStarted = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography
          variant="h3"
          gutterBottom
          align="center"
          sx={{
            mb: 4,
            [theme.breakpoints.down("sm")]: {
              fontSize: "2rem",
            },
          }}
        >
          Getting Started with ODOC
        </Typography>

        <Card
          sx={{
            mb: 2,
            boxShadow: theme.shadows[2],
          }}
        >
          <CardContent>
            {isMobile ? (
              <Box>
                <Box sx={{ mb: 3 }}>
                  <VideoList
                    videos={tutorials}
                    selectedIndex={selectedVideoIndex}
                    onSelect={setSelectedVideoIndex}
                  />
                </Box>
                <Box>
                  <VideoPlayer video={tutorials[selectedVideoIndex]} />
                </Box>
              </Box>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <VideoList
                    videos={tutorials}
                    selectedIndex={selectedVideoIndex}
                    onSelect={setSelectedVideoIndex}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <VideoPlayer video={tutorials[selectedVideoIndex]} />
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default GettingStarted;
