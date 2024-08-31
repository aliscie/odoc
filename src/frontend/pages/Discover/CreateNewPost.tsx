import {Divider, Grid} from "@mui/material";
import React from "react";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import {ContentNode, Post} from "../../../declarations/backend/backend.did";
import {randomId} from "@mui/x-data-grid-generator";
import {useSelector} from "react-redux";
import {useSnackbar} from "notistack";
import {LoadingButton} from "@mui/lab";
import PostComponent from "../../components/MuiComponents/PostComponent";
import {useBackendContext} from "../../contexts/BackendContext";
import PostTags from "./TagsComponent";
import serializeFileContents from "../../DataProcessing/serialize/serializeFileContents";

function CreatePost(props: any) {
    let post_id = randomId();
    const {profile} = useSelector((state: any) => state.filesState);
    const [post, setPost] = React.useState<Post>({
        id: post_id,
        creator: profile ? profile.id : "",
        date_created: BigInt(0),
        votes_up: [],
        tags: [],
        content_tree: [],
        votes_down: [],
    });

    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    let [isEnter, setEnter] = React.useState(false);
    let [loading, setLoad] = React.useState(false);
    let [changes, setChanges] = React.useState<any>(null);
    const {backendActor} = useBackendContext();
    const handleCreatePost = async () => {

        let de_changes: Array<Array<[string, Array<[string, ContentNode]>]>> = serializeFileContents(changes);
        let content_tree: Array<[string, ContentNode]> = de_changes[0][0][1];
        let new_post = {...post, content_tree: content_tree};
        setLoad(true);
        let res = await backendActor?.save_post(new_post);
        setLoad(false);
        if ("Ok" in res) {
            props.setPosts((pre) => {
                let new_posts = [];
                if (pre.length > 0) {
                    new_posts = pre;
                }
                new_post = {
                    ...new_post,
                    creator: {name: profile.name, id: profile.id},
                };
                return [new_post, ...new_posts];
            });
            enqueueSnackbar("Post created", {variant: "success"});
            setChanges(null);
        } else {
            enqueueSnackbar("Error creating post. " + res.Err, {variant: "error"});
        }
    };
    let CreateButtons = (props: any) => (
        <>
            <LoadingButton
                // disabled={loading}
                loading={loading}
                onClick={handleCreatePost}
            >
                <AddCircleOutlineIcon/>
            </LoadingButton>
            <IconButton>
                <MoreTimeIcon/>
            </IconButton>
            <PostTags
                post={post}
                setTags={(updatedTags) => {
                    setPost((prevPost) => ({
                        ...prevPost,
                        tags: updatedTags.map((tag) => tag.title),
                    }));
                }}
            />
        </>
    );

    function onChange(changes: any) {
        let new_change = {};
        new_change[""] = changes;
        setChanges(new_change);
    }

    return (
        <Grid
            onMouseEnter={() => setEnter(true)}
            onMouseLeave={() => setEnter(false)}
            item
            sx={{
                my: 1,
                mx: "auto",
                p: 2,
                // marginLeft: '20%',
                // marginRight: '20%',
                // marginBottom: '20%',
                opacity: isEnter ? 1 : 0.2,
                // height: '10%', // adjust the value accordingly
            }}
        >
            <PostComponent
                is_owner={true}
                s
                key={changes} // Use the key to force a re-render
                buttons={<CreateButtons/>}
                post={post}
                onChange={onChange}
            />
            <Divider/>
        </Grid>
    );
}

export default CreatePost;
