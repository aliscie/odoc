import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import useIsInViewport from "./useViewPort";

const VideoPlayer = ({ video, startTime }: { video: Tutorial; startTime?: number }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ReactPlayer>(null);
  const isInViewport = useIsInViewport(containerRef, 0.5);
  const [isReady, setIsReady] = useState(false);

  const handleReady = () => {
    setIsReady(true);
  };

  useEffect(() => {
    if (!playerRef.current || !isReady) return;

    if (isInViewport) {
      playerRef.current.getInternalPlayer()?.playVideo?.() ||
        playerRef.current.getInternalPlayer()?.play?.();
    } else {
      // Use the pause method directly for better compatibility
      playerRef.current.getInternalPlayer()?.pauseVideo?.() ||
        playerRef.current.getInternalPlayer()?.pause?.();
    }
  }, [isInViewport, isReady]);
  return (
    <Box
      ref={containerRef}
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          paddingTop: isMobile ? "65%" : "56%",
          mb: 2,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            boxShadow: theme.shadows[2],
          }}
        >
          <ReactPlayer
            ref={playerRef}
            url={video.videoUrl}
            width="100%"
            height="100%"
            controls={true}
            playing={isInViewport}
            volume={1}
            onReady={handleReady}
            config={{
              youtube: {
                playerVars: {
                  start: startTime,
                  origin: window.location.origin,
                  enablejsapi: 1,
                },
              },
            }}
          />
        </Box>
      </Box>
      <Typography variant="h6" gutterBottom>
        {video.title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {video.description}
      </Typography>
    </Box>
  );
};

export default VideoPlayer;
