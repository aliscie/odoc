import React from 'react';
import './styles/LandingPage.css';
import PostComponent from "../components/genral/post_component";
import {Grid} from "@mui/material";
import {useSelector} from "react-redux";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import {useSnackbar} from "notistack";
import {actor} from "../App";


const AllUsers = () => {

        const {enqueueSnackbar, closeSnackbar} = useSnackbar();
        const {users, id} = useSelector((state: any) => state.filesReducer);

        async function handleFriedReq(user) {
            let loading = enqueueSnackbar(<span>sending friend request... <span
                className={"loader"}/></span>, {variant: "info"});
            let friend_request = actor && await actor.send_friend_request(user)
            closeSnackbar(loading)
            if (friend_request.Err) {
                enqueueSnackbar(friend_request.Err, {variant: "error"});
            }
            if (friend_request.Ok) {
                enqueueSnackbar("Friend request sent", {variant: "success"});
            }
        }

        let Buttons = (props: any) => <><IconButton aria-label="add to favorites">
            <FavoriteIcon/>
        </IconButton>
            <IconButton aria-label="share">
                <ShareIcon/>
            </IconButton>
            {id != props.user[0] && <IconButton onClick={() => handleFriedReq(props.user[0])} aria-label="Request friend">
                <GroupAddIcon/>
            </IconButton>}</>;

        return (
            <Grid>
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
                                buttons={<Buttons user={user}/>}
                                user={user[1]}
                                // content={}
                            />
                        </Grid>)
                    })
                }

            </Grid>

        );
    }
;

export default AllUsers;
