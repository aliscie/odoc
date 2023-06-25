import React from 'react';
import './styles/LandingPage.css';
import PostComponent from "../components/genral/post_component";
import {Grid} from "@mui/material";
import {useSelector} from "react-redux";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import {actor} from "../backend_connect/ic_agent";
import {useSnackbar} from "notistack";
import {backend} from "../backend_connect/main";
import {handleRedux} from "../redux/main";

// function  Buttons(){
//
// }

const Discover = () => {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {users, id} = useSelector((state: any) => state.filesReducer);
    console.log({users})
    return (
        <div className="landing-page">
            <Grid container spacing={{xs: 2, md: 3}} columns={{xs: 4, sm: 8, md: 12}}>
                {
                    users && users.map((user: any) => {
                        return (<Grid item xs={2} sm={4} md={4}>
                            <PostComponent
                                buttons={<><IconButton aria-label="add to favorites">
                                    <FavoriteIcon/>
                                </IconButton>
                                    <IconButton aria-label="share">
                                        <ShareIcon/>
                                    </IconButton>
                                    {id != user[0] && <IconButton onClick={async () => {
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
                                    }} aria-label="Request friend">
                                        <GroupAddIcon/>
                                    </IconButton>}</>}
                                title={user[0]}/>
                        </Grid>)
                    })
                }

            </Grid>


        </div>
    );
};

export default Discover;
