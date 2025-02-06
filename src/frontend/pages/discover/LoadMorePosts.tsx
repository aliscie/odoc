import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { useBackendContext } from "../../contexts/BackendContext";
import { RootState } from "../../redux/reducers";

const POSTS_PER_PAGE = 20;

const LoadMorePosts = () => {
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(null);
  const theme = useTheme();
  const dispatch = useDispatch();
  const { posts } = useSelector((state: RootState) => state.filesState);
  const { backendActor } = useBackendContext();

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        const target = entries[0];

        if (target.isIntersecting && !loading && hasMore) {
          try {
            setLoading(true);

            const fetchedPosts = await backendActor.get_posts(
              posts.length,
              posts.length + POSTS_PER_PAGE,
            );

            if (fetchedPosts.length === 0) {
              setHasMore(false);
            } else {
              dispatch({
                type: "ADD_POSTS",
                posts: fetchedPosts,
              });
            }
          } catch (error) {
            console.error("Error fetching more posts:", error);
          } finally {
            setLoading(false);
          }
        }
      },
      {
        root: null,
        rootMargin: "20px",
        threshold: 1.0,
      },
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [loading, hasMore, dispatch, backendActor]);

  return (
    <Box
      ref={loadingRef}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 3,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      {loading ? (
        <CircularProgress size={24} />
      ) : !hasMore ? (
        <Typography variant="body2">No more posts found</Typography>
      ) : null}
    </Box>
  );
};

export default LoadMorePosts;
