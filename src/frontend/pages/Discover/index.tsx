import React, { useEffect } from "react";
import "../styles/LandingPage.css";
import { Button, Divider, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import CreatePost from "./CreateNewPost";
import { PostUser } from "../../../declarations/backend/backend.did";
import { useSnackbar } from "notistack";
import FilterPosts from "./PostsFilters";
import ViewPost from "./ViewUpdatePost";
import { useBackendContext } from "../../contexts/BackendContext";
import Box from "@mui/material/Box";

const Discover = () => {
  const { backendActor } = useBackendContext();
  const { searchValue } = useSelector((state: any) => state.uiState);
  const { isLoggedIn } = useSelector((state: any) => state.uiState);

  const [posts, setPosts] = React.useState<Array<PostUser>>([]); //TODO use redux for this
  const [current_page, setPage] = React.useState<number>(0);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const delayedSearch = async () => {
      // TODO later add a Button for deep search_popper in cuz query can cost cycles.
      if (searchValue.length > 0) {
        let res: Array<PostUser> = await backendActor.search_posts(searchValue);
        res && setPosts(res);
      } else {
        setPage(0);
        setPosts([]);
        await set_posts();
      }
    };

    // Clear the previous timeout
    clearTimeout(timeoutId);

    // Set a new timeout
    timeoutId = setTimeout(delayedSearch, 300);

    // Cleanup function
    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  async function set_posts() {
    posts.length > 0 && setPage(posts.length);
    let res: Array<PostUser> = await backendActor.get_posts(
      BigInt(current_page),
      BigInt(current_page + 10),
    );

    if (res && res.length > 0) {
      setPosts((pre) => {
        return posts.length == 0 ? [...res] : [...pre, ...res];
      });
    } else if (res && res.length == 0) {
      enqueueSnackbar("There are no more posts to load.", { variant: "info" });
    } else {
      enqueueSnackbar("undefined Error getting posts.", { variant: "error" });
    }
  }

  useEffect(() => {
    (async () => {
      await set_posts();
    })();
  }, []);

  return (
    <Box
      sx={{
        margin: "0 auto",
        padding: 2,
        maxWidth: "70%",
      }}
    >
      {isLoggedIn && (
        <Box sx={{ marginBottom: 3 }}>
          <CreatePost setPosts={setPosts} />
        </Box>
      )}
      <Divider sx={{ marginBottom: 3 }} />
      <Box sx={{ marginBottom: 3 }}>
        <FilterPosts initPosts={posts} setPage={setPage} setPosts={setPosts} />
      </Box>
      <Grid container spacing={2}>
        {posts.map((post: PostUser, index) => (
          <Grid item xs={12} key={index}>
            <ViewPost posts={posts} setPosts={setPosts} post={post} />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={async () => {
            await set_posts();
          }}
        >
          Load more
        </Button>
      </Box>
    </Box>
  );
};
export default Discover;
