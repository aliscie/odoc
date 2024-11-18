import BasicMenu from "../../components/MuiComponents/BasicMenu";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ActionsButtons from "./ActionsButtons";
import PostComponent from "../../components/MuiComponents/PostComponent";
import React, { useRef } from "react";
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
import { logger } from "../../DevUtils/logData";
import ConformationMessage from "../../components/MuiComponents/conformationButton";

interface Props {
  post: PostUser;
  setPosts: React.Dispatch<React.SetStateAction<PostUser[]>>;
  posts: PostUser[];
}

function ViewPost(props: Props) {
  const { backendActor } = useBackendContext();
  const { profile, Anonymous } = useSelector((state: any) => state.filesState);
  const postRef = useRef<PostUser>({
    id: props.post.id,
    creator: props.post.creator,
    date_created: props.post.date_created,
    votes_up: props.post.votes_up,
    tags: props.post.tags,
    content_tree: props.post.content_tree,
    votes_down: props.post.votes_down,
  });

  const [isChanged, setChanged] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleSave = async () => {
    setLoading(true);
    const res = await backendActor?.save_post({
      ...postRef.current,
      creator: postRef.current.creator.id,
      content_tree: postRef.current.content_tree,
    });
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

  const onChange = (changes: any) => {
    let new_change = {};
    new_change[""] = changes;

    const de_changes = serialize_file_contents(new_change);
    let content_tree: Array<[string, ContentNode]> = de_changes[0][0][1];
    postRef.current = { ...postRef.current, content_tree: content_tree };
    setChanged(true);
  };

  let is_owner = props.post.creator.id == profile ? profile.id : "";

  return (
    <div>
      <PostComponent
        readOnly={!profile || props.post.creator.id !== profile.id}
        is_owner={is_owner}
        editable={!Anonymous}
        onChange={onChange}
        post={postRef.current}
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
                  pure: true,
                  content: (
                    <ConformationMessage
                      message={"Yes delete it!"}
                      conformationMessage={`Are you sure you want to delete This post? `}
                      onClick={async () => {
                        handleDeletePost(props.post.id)
                      }}
                    >
                      Delete
                    </ConformationMessage>
                  ),
                  // icon: <DeleteIcon />,
                  // onClick: () => handleDeletePost(props.post.id),
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
            <PostTags
              readOnly={!profile || props.post.creator.id !== profile.id}
              label={"Tags"}
              post={props.post}
              setTags={(updatedTags) => {
                postRef.current = {
                  ...postRef.current,
                  tags: updatedTags.map((tag) => tag.title),
                };
                setChanged(true);
              }}
            />
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
