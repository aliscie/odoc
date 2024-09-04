import BasicMenu from "../../components/MuiComponents/BasicMenu";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ActionsButtons from "./ActionsButtons";
import PostComponent from "../../components/MuiComponents/PostComponent";
import React from "react";
import {
  ContentNode,
  Post,
  PostUser,
} from "../../../declarations/backend/backend.did";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import PostTags from "./TagsComponent";
import serialize_file_contents from "../../DataProcessing/serialize/serializeFileContents";
import { useBackendContext } from "../../contexts/BackendContext";
import { Typography } from "@mui/material";

interface Props {
  post: PostUser;
  setPosts: React.Dispatch<React.SetStateAction<PostUser[]>>;
  posts: PostUser[];
}

function ViewPost(props: Props) {
  const { backendActor } = useBackendContext();

  const [post, setPost] = React.useState(() => {
    const initialPost: Post = {
      id: props.post.id,
      creator: props.post.creator.id,
      date_created: props.post.date_created,
      votes_up: props.post.votes_up,
      tags: props.post.tags,
      content_tree: props.post.content_tree,
      votes_down: props.post.votes_down,
    };
    return initialPost;
  });

  const [isChanged, setChanged] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleSave = async () => {
    let new_change = {};
    new_change[""] = post.content_tree;
    const de_changes = serialize_file_contents(new_change);
    let content_tree: Array<[string, ContentNode]> = de_changes[0][0][1];
    setLoading(true);
    const res = await backendActor?.save_post({ ...post, content_tree });
    setLoading(false);
    if (res && "Ok" in res) {
      enqueueSnackbar("Post saved", { variant: "success" });
      // Optionally, update the post list in the parent component here.
    } else {
      enqueueSnackbar("Error saving post. " + res?.Err, { variant: "error" });
    }
    setChanged(false);
  };

  const handleDeletePost = async (post_id: string) => {
    const res = await backendActor?.delete_post(post_id);
    if (res) {
      enqueueSnackbar("Post deleted successfully", { variant: "success" });
      props.setPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== post_id),
      );
    } else {
      enqueueSnackbar("Error deleting post", { variant: "error" });
    }
  };

  const { profile, Anonymous } = useSelector((state: any) => state.filesState);

  const onChange = (changes: any) => {
    // let new_change = {};
    // new_change[''] = changes;

    // const normalizedChanges = serialize_file_contents(new_change);
    // console.log({normalizedChanges})
    setPost((prevPost) => ({ ...prevPost, content_tree: changes }));
    setChanged(true);
  };
  let is_owner = props.post.creator.id == profile ? profile.id : "";
  return (
    <div>
      <PostComponent
        is_owner={is_owner}
        editable={!Anonymous}
        onChange={onChange}
        post={props.post}
        headerAction={
          profile &&
          props.post.creator.id === profile.id && (
            <BasicMenu
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              options={[
                { content: "More actions in later versions." },
                {
                  content: "Delete",
                  icon: <DeleteIcon />,
                  onClick: () => handleDeletePost(props.post.id),
                },
              ]}
            >
              <MoreVertIcon />
            </BasicMenu>
          )
        }
        buttons={
          <>
            <ActionsButtons post={props.post} />
            {profile && profile.id === props.post.creator.id && (
              <>
                <Typography variant="h6" sx={{ fontWeight: "bold", mr: 2 }}>
                  Tags:
                </Typography>
                <PostTags
                  post={props.post}
                  setTags={(updatedTags) => {
                    setPost((prevPost) => ({
                      ...prevPost,
                      tags: updatedTags.map((tag) => tag.title),
                    }));
                    setChanged(true);
                  }}
                />
              </>
            )}
            {isChanged && (
              <LoadingButton loading={loading} onClick={handleSave}>
                Save
              </LoadingButton>
            )}
          </>
        }
        user={props.post.creator}
      />
    </div>
  );
}

export default ViewPost;
