import PostComponent from "../../components/genral/post_component";
import {Grid} from "@mui/material";
import React from "react";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import {actor} from "../../App";
import {ContentNode, Post} from "../../../declarations/user_canister/user_canister.did";
import {randomId} from "@mui/x-data-grid-generator";
import {useSelector} from "react-redux";
import {useSnackbar} from "notistack";
import serialize_file_contents from "../../data_processing/serialize/serialize_file_contents";
import {LoadingButton} from "@mui/lab";
import PostTags from "./tags_component";


function CreatePost(props: any) {
    let post_id = randomId();
    const {profile} = useSelector((state: any) => state.filesReducer);
    const [post, setPost] = React.useState<Post>({
        'id': post_id,
        'creator': profile.id,
        'date_created': BigInt(0),
        'votes_up': [],
        'tags': [],
        'content_tree': [],
        'votes_down': [],
    });

    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    let [isEnter, setEnter] = React.useState(false);
    let [loading, setLoad] = React.useState(false);
    let [changes, setChanges] = React.useState<any>(null);

    const handleCreatePost = async () => {
        let de_changes: Array<Array<[string, Array<[string, ContentNode]>]>> = serialize_file_contents(changes)
        let content_tree: Array<[string, ContentNode]> = de_changes[0][0][1]
        let new_post = {...post, content_tree: content_tree};
        setLoad(true)
        let res = actor && await actor.save_post(new_post)
        setLoad(false)
        if ("Ok" in res) {
            // TODo Why new posts does not show up
            props.setPosts((pre) => {
                let new_posts = [];
                if (pre.length > 0) {
                    new_posts = pre
                }
                new_post = {...new_post, creator: {name: profile.name, id: profile.id}};
                return [new_post, ...new_posts];
            });
            enqueueSnackbar("Post created", {variant: "success"});
            setChanges(null);
        } else {
            enqueueSnackbar("Error creating post. " + res.Err, {variant: "error"});
        }
    }
    let CreateButtons = (props: any) => <>
        <LoadingButton
            // disabled={loading}
            loading={loading}
            onClick={handleCreatePost}
        ><AddCircleOutlineIcon/></LoadingButton>
        <IconButton><MoreTimeIcon/></IconButton>
        <PostTags
            post={post}
            setTags={(updatedTags) => {
                setPost(prevPost => ({...prevPost, tags: updatedTags.map(tag => tag.title)}));
            }}/>
    </>;


    function onChange(changes: any) {
        let new_change = {};
        new_change[''] = changes;
        setChanges(new_change)
    }


    return (
        <Grid
            onMouseEnter={() => setEnter(true)}
            onMouseLeave={() => setEnter(false)}

            item
            sx={{
                my: 1,
                mx: 'auto',
                p: 2,
                // marginLeft: '20%',
                // marginRight: '20%',
                // marginBottom: '20%',
                opacity: isEnter ? 1 : 0.2,
                // height: '10%', // adjust the value accordingly

            }}
        >
            < PostComponent
                key={changes} // Use the key to force a re-render
                buttons={<CreateButtons/>}
                post={post}
                onChange={onChange}
            />


        </Grid>
    )
}

export default CreatePost;