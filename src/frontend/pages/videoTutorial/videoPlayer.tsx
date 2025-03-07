import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import useIsInViewport from "./useViewPort";
let isStareted = false;
const VideoPlayer = (props: { video: Tutorial; startTime?: number }) => {
  let { video, startTime } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const isInViewport = useIsInViewport(containerRef, 0.5);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  // Construct URL without autoplay
  const baseUrl = video.videoUrl;
  const separator = baseUrl.includes("?") ? "&" : "?";
  const videoSrc = `${baseUrl}${separator}autoplay=0&mute=0&enablejsapi=1`;

  useEffect(() => {
    const iframe = videoRef.current;
    if (!iframe || !isIframeLoaded) return;

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
    const playVideo = () => {
      if (isInViewport) {
        if (typeof startTime === "number" && !isStareted) {
          postMessageToPlayer("seekTo", [startTime, true]);
          isStareted = true;
        }
        postMessageToPlayer("playVideo");
        postMessageToPlayer("setVolume", [100]);
      } else {
        postMessageToPlayer("pauseVideo");
      }
    };
    playVideo();
    setTimeout(() => {
      playVideo();
    }, 1500);

    return () => {
      postMessageToPlayer("pauseVideo");
    };
  }, [videoRef.current, isInViewport, isIframeLoaded, video, startTime]); // Added startTime to deps

  return (
    <Box
      ref={containerRef}
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          paddingTop: isMobile ? "65%" : "40%", // Increased from 42.25% to 65% for mobile
          mb: 2,
        }}
      >
        <Box
          component="iframe"
          ref={videoRef}
          src={videoSrc}
          onLoad={() => setIsIframeLoaded(true)}
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
