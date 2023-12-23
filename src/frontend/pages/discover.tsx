import React, {useEffect} from 'react';
import './styles/LandingPage.css';
import PostComponent from "../components/genral/post_component";
import {Button, Grid} from "@mui/material";
import {useSelector} from "react-redux";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AvatarChips from "../components/genral/person_chip";
import CreatePost from "../components/spesific/create_new_post";
import {actor} from "../App";
import {PostUser} from "../../declarations/user_canister/user_canister.did";
import EditorComponent from "../components/editor_components/main";
import {normalize_content_tree} from "../data_processing/normalize/normalize_contents";
import {useSnackbar} from "notistack";
import formatTimestamp from "../utils/time";
import BasicMenu from "../components/genral/basic_menu";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterPosts from "./discover/posts_filters";
import {logger} from "../dev_utils/log_data";
import ActionsButtons from "./discover/actions_buttons";

const Discover = () => {
        const {searchValue, searchTool} = useSelector((state: any) => state.uiReducer);
        const {profile, users, isLoggedIn, Anonymous} = useSelector((state: any) => state.filesReducer);

        const [posts, setPosts] = React.useState<| Array<PostUser>>([]);
        const [current_page, setPage] = React.useState<number>(0);
        const {enqueueSnackbar, closeSnackbar} = useSnackbar();

        useEffect(() => {
            let timeoutId: NodeJS.Timeout;

            const delayedSearch = async () => {
                // TODO later add a Button for deep search_popper in cuz query can cost cycles.
                let res: undefined | Array<PostUser> = actor && await actor.search_posts(searchValue);
                logger({res});
                res && setPosts(res);
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


        const handleDeletePost = async (post_id) => {
            let res = actor && await actor.delete_post(post_id);
            if (res) {
                enqueueSnackbar('Post deleted successfully', {variant: 'success'});
                setPosts(posts.filter((post) => post.id != post_id))
            } else {
                enqueueSnackbar('Error deleting post', {variant: 'error'});
            }

        }

        return (
            <Grid

                sx={{
                    marginLeft: '20%',
                    marginRight: '20%',
                }}
            >
                {isLoggedIn && !Anonymous && <CreatePost setPosts={setPosts}/>}
                <FilterPosts setPage={setPage} setPosts={setPosts}/>
                {
                    posts && posts.map((post: PostUser) => {
                        let content = normalize_content_tree(post.content_tree);
                        let date_local = formatTimestamp(post.date_created)
                        // let date_local = convertUtcToTimeZone(date_created_utc);
                        return (<Grid item
                                      sx={{
                                          my: 1,
                                          // mx: 'auto',
                                      }}
                        >
                            {content && <PostComponent
                                avatar={<AvatarChips size={"large"} user={post.creator}/>}
                                subheader={date_local}
                                headerAction={

                                    profile && post.creator.id == profile.id && <BasicMenu
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        options={[
                                            {content: "More actions in later versions."},
                                            {
                                                content: 'Delete',
                                                icon: <DeleteIcon/>,
                                                onClick: async () => await handleDeletePost(post.id)
                                            },
                                        ]}
                                    >
                                        <MoreVertIcon/>
                                    </BasicMenu>

                                }
                                // headerAction={<IconButton aria-label="settings">
                                //     <MoreVertIcon/>
                                // </IconButton>}

                                buttons={<ActionsButtons post={post}/>}
                                user={post.creator}
                                content={<EditorComponent content={content}/>}
                            />}
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
