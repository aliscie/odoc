import React, {useEffect} from 'react';
import './styles/LandingPage.css';
import {Button, Divider, Grid} from "@mui/material";
import {useSelector} from "react-redux";
import CreatePost from "./discover/create_new_post";
import {actor} from "../App";
import {PostUser} from "../../declarations/backend/backend.did";
import {useSnackbar} from "notistack";
import FilterPosts from "./discover/posts_filters";
import ViewPost from "./discover/view_update_post";

const Discover = () => {
        const {searchValue} = useSelector((state: any) => state.uiReducer);
        const {isLoggedIn, Anonymous} = useSelector((state: any) => state.filesReducer);

        const [posts, setPosts] = React.useState<| Array<PostUser>>([]); //TODO use redux for this
        const [current_page, setPage] = React.useState<number>(0);
        const {enqueueSnackbar} = useSnackbar();
        useEffect(() => {
            let timeoutId: NodeJS.Timeout;

            const delayedSearch = async () => {
                // TODO later add a Button for deep search_popper in cuz query can cost cycles.
                if (searchValue.length > 0) {
                    let res: undefined | Array<PostUser> = actor && await actor.search_posts(searchValue);
                    res && setPosts(res);
                } else {
                    setPage(0)
                    setPosts([])
                    await set_posts()
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

            // TODO store posts in local storage prevent the need to call teh backend everytime after search.
            posts.length > 0 && setPage(posts.length);
            let res: undefined | Array<PostUser> = actor && await actor.get_posts(BigInt(current_page), BigInt(current_page + 10))

            if (res && res.length > 0) {
                // TODO make sure there will be no repeated posts due to the filter.
                //  After filtering setPosts may take the same posts again.
                setPosts((pre) => {
                    return posts.length == 0 ? [...res] : [...pre, ...res]
                })
            } else if (res && res.length == 0) {
                enqueueSnackbar("There are no more posts to load.", {variant: "info"})
            } else {
                enqueueSnackbar("undefined Error getting posts.", {variant: "error"})
            }
        }

        useEffect(() => {

            (async () => {
                await set_posts()
            })()
        }, [])


        return (
            <Grid

                sx={{
                    marginLeft: '20%',
                    marginRight: '20%',
                }}
            >
                {isLoggedIn && !Anonymous && <CreatePost setPosts={setPosts}/>}
                <Divider/>
                <FilterPosts initPosts={posts} setPage={setPage} setPosts={setPosts}/>
                {
                    posts && posts.map((post: PostUser) => {

                        return (<Grid item
                                      sx={{
                                          my: 1,
                                          // mx: 'auto',
                                      }}
                        >
                            <ViewPost posts={posts} setPosts={setPosts} post={post}/>
                        </Grid>)
                    })
                }

                <Button
                    onClick={async () => {
                        await set_posts()
                    }}
                >Load more</Button>

            </Grid>

        );
    }
;

export default Discover;
