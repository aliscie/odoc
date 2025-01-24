// components/CommentForm.tsx
import React, { useState, useRef } from "react";
import { Box, Button } from "@mui/material";
import { useBackendContext } from "../../contexts/BackendContext";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { Post } from "../../../declarations/backend/backend.did";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { deserializeContentTree } from "../../DataProcessing/deserlize/deserializeContents";
import serializeFileContents from "../../DataProcessing/serialize/serializeFileContents";
import EditorComponent from "../../components/EditorComponent";
import { randomString } from "../../DataProcessing/dataSamples";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { backendActor } = useBackendContext();
  const { profile } = useSelector((state: any) => state.filesState);
  const { enqueueSnackbar } = useSnackbar();
  const contentTree = useRef([]);
  const [isChanged, setChanged] = useState(false);

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
      if (result.Ok) {
        await backendActor.add_child(postId, result.Ok.id);
        setChanged(false);
        onCommentSubmit();
        enqueueSnackbar("Comment posted successfully", { variant: "success" });
      }
    } catch (error) {
      enqueueSnackbar("Failed to post comment: " + error, { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Box sx={{ mb: 2 }}>
        <DndProvider backend={HTML5Backend}>
          <EditorComponent
            editorKey={`new-comment-${postId}`}
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
        </DndProvider>
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
          Comment
        </Button>
      </Box>
    </Box>
  );
};

export default CommentForm;
