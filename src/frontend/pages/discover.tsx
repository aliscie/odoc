import React from 'react';
import './styles/LandingPage.css';
import PostComponent from "../components/genral/post_component";
import {Grid} from "@mui/material";
import {useSelector} from "react-redux";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import {useSnackbar} from "notistack";
import EditorDemo from "../components/genral/editor_demo";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AvatarChips from "../components/genral/person_chip";
import CreatePost from "../components/spesific/create_new_post";
import {actor} from "../App";

const Discover = () => {

        const {enqueueSnackbar, closeSnackbar} = useSnackbar();
        const {users, isLoggedIn, Anonymous} = useSelector((state: any) => state.filesReducer);

        async function handleFriedReq() {
            let loading = enqueueSnackbar(<span>sending friend request... <span
                className={"loader"}/></span>, {variant: "info"});
            let friend_request = await actor.send_friend_request(user[0])
            closeSnackbar(loading)
            if (friend_request.Err) {
                enqueueSnackbar(friend_request.Err, {variant: "error"});
            }
            if (friend_request.Ok) {
                enqueueSnackbar("Friend request sent", {variant: "success"});
            }
        }

        let Buttons = (props: any) => <><IconButton
            aria-label="add to favorites">
            <FavoriteIcon/>
        </IconButton>
            <IconButton
                aria-label="share">
                <ShareIcon/>
            </IconButton>
        </>;


        return (
            <Grid>
                {isLoggedIn && !Anonymous && <CreatePost/>}
                {
                    users && users.map((user: any) => {
                        return (<Grid item
                                      sx={{
                                          my: 1,
                                          mx: 'auto',
                                          p: 2,
                                          marginLeft: '20%',
                                          marginRight: '20%',
                                      }}
                        >
                            <PostComponent
                                avatar={<AvatarChips size={"large"} user={user[1]}/>}
                                subheader={"September 14, 2016"}
                                headerAction={<IconButton aria-label="settings">
                                    <MoreVertIcon/>
                                </IconButton>}
                                buttons={<Buttons user={user}/>}
                                // user={user[1]}
                                content={<EditorDemo/>}
                            />
                        </Grid>)
                    })
                }

            </Grid>

        );
    }
;

export default Discover;
