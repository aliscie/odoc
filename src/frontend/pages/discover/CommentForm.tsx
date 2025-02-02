import React, {useRef, useState} from "react";
import {Box, Button} from "@mui/material";
import {useBackendContext} from "../../contexts/BackendContext";
import {useDispatch, useSelector} from "react-redux";
import {Post} from "../../../declarations/backend/backend.did";
import {deserializeContentTree} from "../../DataProcessing/deserlize/deserializeContents";
import serializeFileContents from "../../DataProcessing/serialize/serializeFileContents";
import EditorComponent from "../../components/EditorComponent";
import {randomString} from "../../DataProcessing/dataSamples";
import {handleRedux} from "../../redux/store/handleRedux";
import {RootState} from "../../redux/reducers";

interface CommentFormProps {
  postId: string;
  onCommentSubmit: () => void;
  onCancel?: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
  postId,
  onCommentSubmit,
  onCancel,
}) => {
  const { posts } = useSelector((state: RootState) => state.filesState);
  const { profile } = useSelector((state: any) => state.filesState);
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { backendActor } = useBackendContext();
  const contentTree = useRef([]);
  const [isChanged, setChanged] = useState(false);
  const [editorKey, setEditorKey] = useState(
    `new-comment-${postId}-${Date.now()}`,
  );

  if (!profile) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentTree.current || !isChanged) return;

    setIsSubmitting(true);
    try {
      const comment: Post = {
        content_tree: serializeFileContents(contentTree.current)[0][0][1],
        creator: profile.id,
        date_created: BigInt(Date.now()),
        votes_up: [],
        votes_down: [],
        children: [],
        is_comment: true,
        id: randomString(),
        parent: postId,
        tags: [],
      };

      const result = await backendActor.save_post(comment);
      if (result.Ok == null) {
        dispatch(
          handleRedux("ADD_POST", { post: { ...comment, creator: profile } }),
        );
        const parentPost = posts.find((p) => p.id === postId);
        if (parentPost) {
          parentPost.children.push(comment.id);
          dispatch(handleRedux("UPDATE_POST", { post: parentPost }));
        }
        setChanged(false);
        contentTree.current = [];
        setEditorKey(`new-comment-${postId}-${Date.now()}`);
        onCommentSubmit();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Box sx={{ mb: 2 }}>
        <EditorComponent
          editorKey={editorKey}
          readOnly={isSubmitting}
          id={`new-comment-${postId}`}
          contentEditable={!isSubmitting}
          onChange={(content) => {
            contentTree.current = { "": content };
            if (!isChanged) {
              setChanged(true);
            }
          }}
          content={deserializeContentTree([])}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
        {onCancel && (
          <Button
            onClick={onCancel}
            disabled={isSubmitting}
            sx={{
              color: "#A78BFA",
              "&:hover": {
                backgroundColor: "rgba(139, 92, 246, 0.1)",
              },
            }}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting || !isChanged}
          sx={{
            backgroundColor: "#A855F7",
            color: "white",
            "&:hover": {
              backgroundColor: "#9333EA",
            },
            "&:disabled": {
              backgroundColor: "#E9D5FF",
              color: "#9CA3AF",
            },
          }}
        >
          New Comment
        </Button>
      </Box>
    </Box>
  );
};

export default CommentForm;
