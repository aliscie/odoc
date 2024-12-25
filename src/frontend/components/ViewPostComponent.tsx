import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  Autocomplete,
} from "@mui/material";
import {
  Comment as MessageCircleIcon,
  Favorite as HeartIcon,
  Reply as ReplyIcon,
  Send as SendIcon,
  Share as ShareIcon,
  ThumbDown as ThumbsDownIcon,
} from "@mui/icons-material";
import { Principal } from "@dfinity/principal";
import UserAvatarMenu from "./MainComponents/UserAvatarMenu";
import EditorComponent from "./EditorComponent";
import { deserializeContentTree } from "../DataProcessing/deserlize/deserializeContents";
import {
  ContentNode,
  Post,
  PostUser,
} from "../../declarations/backend/backend.did";
import serializeFileContents from "../DataProcessing/serialize/serializeFileContents";
import { useBackendContext } from "../contexts/BackendContext";
import { useSelector } from "react-redux";

const PostTagsField = ({ post, suggestedTags, onTagsChange, canEdit }) => {
  return (
    <Box sx={{ mb: 2 }}>
      {post.tags.map((tag) => (
        <Chip
          key={tag}
          label={tag}
          size="small"
          sx={{ mr: 1, mb: 1 }}
          onDelete={
            canEdit
              ? () => {
                  const updatedTags = post.tags.filter((t) => t !== tag);
                  onTagsChange(updatedTags);
                }
              : undefined
          }
        />
      ))}
      {canEdit && (
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
          <Autocomplete
            multiple
            freeSolo
            size="small"
            options={suggestedTags}
            value={post.tags}
            onChange={(_, newValue) => {
              const uniqueTags = [
                ...new Set(newValue.map((tag) => tag.trim())),
              ];
              onTagsChange(uniqueTags);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Add tags..."
                size="small"
                sx={{ minWidth: 300 }}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((tag, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={tag}
                  label={tag}
                  size="small"
                />
              ))
            }
          />
        </Box>
      )}
    </Box>
  );
};

const Comment = ({ comment, onReply, level = 0 }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const handleReplySubmit = () => {
    if (!replyContent.trim()) return;
    onReply(comment.id, replyContent);
    setReplyContent("");
    setShowReplyInput(false);
  };

  return (
    <Box sx={{ ml: level * 3, mb: 2 }}>
      <Box sx={{ p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          {comment.user && <UserAvatarMenu user={comment.user} />}
          <Box>
            <Typography variant="subtitle2">{comment.user.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {comment.timestamp}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {comment.content}
        </Typography>
        <Button
          size="small"
          startIcon={<ReplyIcon />}
          onClick={() => setShowReplyInput(!showReplyInput)}
        >
          Reply
        </Button>
      </Box>

      {showReplyInput && (
        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Write a reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <IconButton onClick={handleReplySubmit} color="primary">
            <SendIcon />
          </IconButton>
        </Box>
      )}

      {comment.replies?.map((reply) => (
        <Comment
          key={reply.id}
          comment={reply}
          onReply={onReply}
          level={level + 1}
        />
      ))}
    </Box>
  );
};

interface ViewPostComponentProps {
  post: PostUser;
  currentUser: any;
  backendActor: any;
  onPostUpdate: (updatedPost: PostUser) => void;
  onPostDelete: (postId: string) => void;
  suggestedTags: string[];
}

const ViewPostComponent: React.FC<ViewPostComponentProps> = ({
  post,
  currentUser,
  onPostDelete,
  suggestedTags,
}) => {
  // const [tagInputs, setTagInputs] = useState<{ [key: string]: string }>({});
  const [tags, setTags] = useState(post.tags);
  const [isChanged, setIsChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [loadingVotes, setLoadingVotes] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [votes, setVotes] = useState({
    up: post.votes_up,
    down: post.votes_down,
  });
  const newPostContentRef = useRef<any>(null);
  const { backendActor } = useBackendContext();
  const { profile } = useSelector((state: any) => state.filesState);
  const handleVoteUp = async () => {
    if (!backendActor) return;
    setLoadingVotes(true);
    try {
      if (votes.up.map((p) => p.toString()).some((p) => p == profile.id)) {
        let unvote_res = await backendActor.unvote_for_post(post.id);
        setVotes({
          up: unvote_res.Ok.votes_up,
          down: unvote_res.Ok.votes_down,
        });
        return;
      }
      const result = await backendActor.vote_up(post.id);
      if ("Ok" in result) {
        setVotes({ up: result.Ok.votes_up, down: result.Ok.votes_down });
        // onPostUpdate(result.Ok);
      }
    } catch (err) {
      console.error("Error voting up:", err);
    } finally {
      setLoadingVotes(false);
    }
  };

  const handleVoteDown = async () => {
    if (!backendActor) return;
    setLoadingVotes(true);
    try {
      if (votes.down.map((p) => p.toString()).some((p) => p == profile.id)) {
        const unvote_res = await backendActor.unvote_for_post(post.id);
        setVotes({
          up: unvote_res.Ok.votes_up,
          down: unvote_res.Ok.votes_down,
        });
        return;
      }
      const result = await backendActor.vote_down(post.id);
      if ("Ok" in result) {
        setVotes({ up: result.Ok.votes_up, down: result.Ok.votes_down });
        // onPostUpdate(result.Ok);
      }
    } catch (err) {
      console.error("Error voting down:", err);
    } finally {
      setLoadingVotes(false);
    }
  };

  const handleSavePost = async () => {
    // if (!newPostContentRef.current || !backendActor) return;
    setIsSaving(true);
    try {
      let content_tree: Array<[string, ContentNode]> = [];
      if (newPostContentRef.current) {
        let de_changes: Array<Array<[string, Array<[string, ContentNode]>]>> =
          serializeFileContents(newPostContentRef.current);
        content_tree = de_changes[0][0][1];
      } else {
        content_tree = post.content_tree;
      }

      const updatedPost: Post = {
        ...post,
        creator: String(currentUser.id),
        content_tree,
        tags,
      };
      console.log({ tags });
      const result = await backendActor.save_post(updatedPost);
      if ("Ok" in result) {
        // onPostUpdate(result.Ok);
        setIsChanged(false);
      }
    } catch (err) {
      console.error("Error saving post:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!backendActor) return;
    setIsDeleting(true);
    try {
      const result = await backendActor.delete_post(post.id);
      if ("Ok" in result) {
        onPostDelete(post.id);
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleComment = () => {
    if (!commentInput.trim()) return;
    const newComment = {
      id: Date.now(),
      content: commentInput,
      timestamp: new Date().toLocaleString(),
      replies: [],
      user: currentUser,
    };

    const updatedPost = {
      ...post,
      comments: [...(post.comments || []), newComment],
    };
    // onPostUpdate(updatedPost);
    setCommentInput("");
  };

  const handleReply = (commentId: string, replyContent: string) => {
    const addReplyToComment = (comments, targetId, reply) => {
      return comments.map((comment) => {
        if (comment.id === targetId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), reply],
          };
        }
        if (comment.replies?.length) {
          return {
            ...comment,
            replies: addReplyToComment(comment.replies, targetId, reply),
          };
        }
        return comment;
      });
    };

    const newReply = {
      id: Date.now(),
      content: replyContent,
      timestamp: new Date().toLocaleString(),
      replies: [],
      user: currentUser,
    };

    const updatedPost = {
      ...post,
      comments: addReplyToComment(post.comments || [], commentId, newReply),
    };
    // onPostUpdate(updatedPost);
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        avatar={post.creator && <UserAvatarMenu user={post.creator} />}
        title={post.creator && post.creator.name}
        subheader={new Date(Number(post.date_created) / 1e6).toLocaleString()}
      />
      <CardContent>
        <EditorComponent
          readOnly={post.creator?.id !== currentUser?.id}
          content={deserializeContentTree(post.content_tree)}
          onChange={(changes) => {
            let new_change = {};
            new_change[""] = changes;
            newPostContentRef.current = new_change;
            if (!isChanged) {
              setIsChanged(true);
            }
          }}
        />

        <PostTagsField
          post={{ ...post, tags }}
          suggestedTags={suggestedTags}
          canEdit={post.creator?.id === currentUser?.id}
          onTagsChange={(newTags) => {
            const updatedPost = { ...post, tags: newTags };
            setTags(newTags);
            setIsChanged(true);
          }}
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            {post.creator?.id === currentUser?.id && (
              <>
                <Button
                  onClick={() => setDeleteDialogOpen(true)}
                  color="error"
                  size="small"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>

                <Button
                  onClick={handleSavePost}
                  color="primary"
                  size="small"
                  disabled={!isChanged || isSaving}
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </>
            )}
            <Button
              startIcon={<HeartIcon />}
              onClick={handleVoteUp}
              disabled={loadingVotes}
              color={
                profile && votes.up.some((p) => p.toString() === profile.id)
                  ? "success"
                  : "inherit"
              }
            >
              {loadingVotes ? "..." : votes.up.length}
            </Button>
            <Button
              startIcon={<ThumbsDownIcon />}
              onClick={handleVoteDown}
              disabled={loadingVotes}
              color={
                profile && votes.down.some((p) => p.toString() === profile.id)
                  ? "error"
                  : "inherit"
              }
            >
              {loadingVotes ? "..." : votes.down.length}
            </Button>
            <Button
              startIcon={<MessageCircleIcon />}
              onClick={() => setShowComments(!showComments)}
            >
              {post.comments?.length || 0}
            </Button>
          </Box>
          <IconButton onClick={() => {}}>
            <ShareIcon />
          </IconButton>
        </Box>

        {showComments && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Write a comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <IconButton onClick={handleComment} color="primary">
                <SendIcon />
              </IconButton>
            </Box>

            <Box sx={{ mt: 2 }}>
              {post.comments?.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  onReply={handleReply}
                />
              ))}
            </Box>
          </Box>
        )}
      </CardContent>

      <Dialog
        open={!isDeleting && deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Post?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default ViewPostComponent;
