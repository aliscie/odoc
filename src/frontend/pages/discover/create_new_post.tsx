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
import deserialize_file_contents from "../../data_processing/denormalize/denormalize_file_contents";
import {LoadingButton} from "@mui/lab";
import PostTags from "./tags_component";

export const init_content = [
    {type: "p", children: [{text: ""}]},
]

function CreatePost(props: any) {
    const {profile,} = useSelector((state: any) => state.filesReducer);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    let [isEnter, setEnter] = React.useState(false);
    let [loading, setLoad] = React.useState(false);
    let [changes, setChanges] = React.useState<any>(null);
    let post_id = randomId();
    let post: Post = {
        'id': post_id,
        'creator': profile.id,
        'date_created': BigInt(Date.now()),
        'votes_up': [],
        'tags': [],
        'content_tree': [],
        'votes_down': [],
    }
    const handleCreatePost = async () => {
        let de_changes: Array<Array<[string, Array<[string, ContentNode]>]>> = deserialize_file_contents(changes)
        let content_tree: Array<[string, ContentNode]> = de_changes[0][0][1]
        post.content_tree = content_tree
        setLoad(true)
        let res = actor && await actor.save_post(post)
        setLoad(false)
        if ("Ok" in res) {
            // TODo Why new posts does not show up
            props.setPosts((pre) => [post, ...(pre || [])]);
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

        <PostTags/>
    </>;

    function handleOnInsertComponent(e: any, component: any) {
        // console.log("handleOnInsertComponent", e, component)
        // if (component.type == "payment_component") {
        //     dispatch(handleRedux("ADD_CONTENT", {id: file_data.id, content: file_content_sample}))
        // }

    }

    function onChange(changes: any) {
        let new_change = {};
        new_change[''] = changes;
        setChanges(new_change)
        // if (files_content[current_file.id] !== changes) {
        //     dispatch(handleRedux("UPDATE_CONTENT", {id: current_file.id, content: changes}));
        //     dispatch(handleRedux("CONTENT_CHANGES", {id: current_file.id, changes: changes}));
        // }
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
            <PostComponent
                key={changes?.key} // Use the key to force a re-render
                buttons={<CreateButtons/>}
                post={post}
                onChange={onChange}
                // content={<EditorComponent
                //     key={changes?.key} // Use the key to force a re-render
                //     handleOnInsertComponent={handleOnInsertComponent}
                //     onChange={onChange}
                //     content={init_content || []}
                // />}
            />


        </Grid>
    )
}

export default CreatePost;