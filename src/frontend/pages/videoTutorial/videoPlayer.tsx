import {Box, Typography, useMediaQuery, useTheme} from "@mui/material";
import React, {useEffect, useRef} from "react";
import useIsInViewport from "./useViewPort";

const VideoPlayer = ({ video }: { video: Tutorial }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const isInViewport = useIsInViewport(containerRef, 0.5);

  useEffect(() => {
    const iframe = videoRef.current;
    if (!iframe) return;

    const postMessageToPlayer = (action: string) => {
      iframe.contentWindow?.postMessage(
        JSON.stringify({
          event: 'command',
          func: action,
        }),
        '*'
      );
    };

    if (!video.videoUrl.includes('enablejsapi=1')) {
      const separator = video.videoUrl.includes('?') ? '&' : '?';
      iframe.src = `${video.videoUrl}${separator}enablejsapi=1`;
    }

    if (!isInViewport) {
      postMessageToPlayer('pauseVideo');
    }
  }, [isInViewport, video.videoUrl]);

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
          src={video.videoUrl}
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
