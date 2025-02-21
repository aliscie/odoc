import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useRef } from "react";
import useIsInViewport from "./useViewPort";

const VideoPlayer = ({ video }: { video: Tutorial }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const isInViewport = useIsInViewport(containerRef, 0.5);

  // Construct URL with all required parameters
  const baseUrl = video.videoUrl;
  const separator = baseUrl.includes("?") ? "&" : "?";
  const videoSrc = `${baseUrl}${separator}autoplay=1&mute=0&enablejsapi=1&volume=100`;

  useEffect(() => {
    const iframe = videoRef.current;
    if (!iframe) return;
    const postMessageToPlayer = (action: string, params?: any) => {
      iframe.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: action,
          args: params,
        }),
        "*",
      );
    };

    if (isInViewport) {
      postMessageToPlayer("playVideo");
      postMessageToPlayer("setVolume", [100]);
    } else {
      postMessageToPlayer("pauseVideo");
    }
  }, [isInViewport]);

  return (
    <Box
      ref={containerRef}
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          paddingTop: isMobile ? "42.25%" : "40%",
          mb: 2,
        }}
      >
        <Box
          component="iframe"
          ref={videoRef}
          src={videoSrc}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            boxShadow: theme.shadows[2],
          }}
        />
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
