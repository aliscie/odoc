import BasicMenu from "../../components/genral/basic_menu";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ActionsButtons from "./actions_buttons";
import PostComponent from "../../components/genral/post_component";
import React from "react";
import {ContentNode, Post, PostUser} from "../../../declarations/user_canister/user_canister.did";
import {useSelector} from "react-redux";
import {actor} from "../../App";
import {useSnackbar} from "notistack";
import {LoadingButton} from "@mui/lab";
import serialize_file_contents from "../../data_processing/serialize/serialize_file_contents";
import PostTags from "./tags_component";

interface Props {
    post: PostUser
    setPosts: React.Dispatch<React.SetStateAction<PostUser[]>>
    posts: PostUser[]
}

function ViewPost(props: Props) {
    const [changes, setChanges] = React.useState<undefined | any>(null);
    const [tags, setTags] = React.useState([]);
    const [loading, setLoad] = React.useState(false);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    let post: Post = {
        'id': props.post.id,
        'creator': props.post.creator.id,
        'date_created': BigInt(Date.now()),
        'votes_up': [],
        'tags': tags.map((tag) => tag.title),
        'content_tree': [],
        'votes_down': [],
    }
    const handleSave = async () => {
        if (changes) {
            let de_changes: Array<Array<[string, Array<[string, ContentNode]>]>> = serialize_file_contents(changes)
            let content_tree: Array<[string, ContentNode]> = de_changes[0][0][1]
            post.content_tree = content_tree
        }

        setLoad(true)
        let res = actor && await actor.save_post(post);
        setLoad(false)
        if ("Ok" in res) {
            // TODo Why new posts does not show up
            enqueueSnackbar("Post created", {variant: "success"});
            setChanges(null);
        } else {
            enqueueSnackbar("Error creating post. " + res.Err, {variant: "error"});
        }
    }
    const handleDeletePost = async (post_id) => {
        let res = actor && await actor.delete_post(post_id);
        if (res) {
            enqueueSnackbar('Post deleted successfully', {variant: 'success'});
            props.setPosts(props.posts.filter((post) => post.id != post_id))
        } else {
            enqueueSnackbar('Error deleting post', {variant: 'error'});
        }

    }
    const {profile, users, isLoggedIn, Anonymous} = useSelector((state: any) => state.filesReducer);
    const onChange = (change) => {
        let new_change = {};
        new_change[''] = change;
        setChanges(new_change)
    }
    return (
        <div>
            <PostComponent
                onChange={onChange}
                post={props.post}
                headerAction={
                    profile && props.post.creator.id == profile.id && <BasicMenu
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

                buttons={<><ActionsButtons post={props.post}/>
                    {changes || tags.length > 0 &&
                        < LoadingButton loading={loading} onClick={handleSave}> Save </LoadingButton>}
                    {profile && profile.id == props.post.creator.id &&
                        <PostTags post={props.post} tags={tags} setTags={setTags}/>}
                </>}
                user={props.post.creator}
            />
        </div>
    )
}

export default ViewPost;