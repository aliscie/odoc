import React, { useState, useEffect, useRef } from "react";
import CreatePost, { CreatePostRef } from "../components/CreatePost";
import { Principal } from "@dfinity/principal";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import {
  Comment as MessageCircleIcon,
  Favorite as HeartIcon,
  Reply as ReplyIcon,
  Send as SendIcon,
  Share as ShareIcon,
  ThumbDown as ThumbsDownIcon,
} from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import UserAvatarMenu from "../components/MainComponents/UserAvatarMenu";
import { useBackendContext } from "../contexts/BackendContext";
import {
  ContentNode,
  Post,
  PostUser,
} from "../../declarations/backend/backend.did";
import { useSelector } from "react-redux";
import { randomString } from "../DataProcessing/dataSamples";
import EditorComponent from "../components/EditorComponent";
import { deserializeContentTree } from "../DataProcessing/deserlize/deserializeContents";
import serializeFileContents from "../DataProcessing/serialize/serializeFileContents";
import { useSnackbar } from "notistack";

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
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          {comment.user && <UserAvatarMenu user={comment.user} size="small" />}
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
      </Paper>

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

const TagSearchField = ({
  searchQuery,
  setSearchQuery,
  selectedTags,
  setSelectedTags,
}) => {
  const [tagInput, setTagInput] = useState("");
  const [suggestedTags] = useState([
    "technology",
    "programming",
    "design",
    "business",
    "marketing",
    "science",
    "art",
    "music",
    "travel",
    "food",
  ]); // You can replace these with actual tags from your backend

  const handleAddTag = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      setSelectedTags([...selectedTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const filteredSuggestions = suggestedTags.filter(
    (tag) =>
      tag.toLowerCase().includes(tagInput.toLowerCase()) &&
      !selectedTags.includes(tag),
  );

  return (
    <Card sx={{ mb: 3, boxShadow: 3 }}>
      <CardContent>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search posts by content or user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <Box sx={{ color: "text.secondary", mr: 1 }}>
                  <SearchIcon />
                </Box>
              ),
            }}
            size="small"
            sx={{ flexGrow: 1 }}
          />
          <Autocomplete
            multiple
            freeSolo
            size="small"
            options={filteredSuggestions}
            value={selectedTags}
            onChange={(_, newValue) => {
              const uniqueTags = [
                ...new Set(newValue.map((tag) => tag.trim())),
              ];
              setSelectedTags(uniqueTags);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Add tags..."
                size="small"
                sx={{ minWidth: 200 }}
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
          <Button
            variant="contained"
            size="small"
            onClick={handleAddTag}
            sx={{ minWidth: 100 }}
          >
            Add Tag
          </Button>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {selectedTags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onDelete={() => handleRemoveTag(tag)}
              size="small"
              sx={{
                bgcolor: "primary.light",
                color: "white",
                "&:hover": {
                  bgcolor: "primary.main",
                },
              }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

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

const SocialPosts = () => {
  const { backendActor } = useBackendContext();
  const [posts, setPosts] = useState<Array<PostUser>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isChanged, setIsChanged] = useState<{ [key: string]: boolean }>({});

  const suggestedTags = [
    "technology",
    "programming",
    "design",
    "business",
    "marketing",
    "science",
    "art",
    "music",
    "travel",
    "food",
  ];
  const { profile } = useSelector((state: any) => state.filesState);
  const currentUser = profile;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!backendActor) return;
        const result = await backendActor.get_posts(BigInt(0), BigInt(20));
        setPosts(result.reverse());
        setError(null);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [backendActor]);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const createPostRef = useRef<CreatePostRef>(null);
  const [tagInputs, setTagInputs] = useState<{ [key: string]: string }>({});
  const [commentInputs, setCommentInputs] = useState({});
  const [showComments, setShowComments] = useState({});
  const [isPosting, setIsPosting] = useState(false);
  const [isSaving, setIsSaving] = useState<{ [key: string]: boolean }>({});
  const newPostContentRef = useRef<any>(null);

  const handleNewPost = async (content: any, tags: string[]) => {
    if (!content || !backendActor) return;
    setIsPosting(true);

    try {
      let de_changes: Array<Array<[string, Array<[string, ContentNode]>]>> =
        serializeFileContents(content);
      let content_tree: Array<[string, ContentNode]> = de_changes[0][0][1];
      const newPost: Post = {
        id: randomString(),
        creator: profile.id,
        date_created: BigInt(Date.now() * 1e6),
        votes_up: [],
        tags,
        content_tree,
        votes_down: [],
      };
      try {
        const result = await backendActor.save_post(newPost);
        if ("Ok" in result) {
          const updatedPosts = await backendActor.get_posts(
            BigInt(0),
            BigInt(20),
          );
          setPosts(updatedPosts.reverse());
          createPostRef.current?.reset();
        } else {
          console.error("Failed to create post:", result.Err);
        }
      } catch (err) {
        console.error("Error save_post:", err);
      }
    } catch (err) {
      console.error("Error creating post:", err);
    } finally {
      setIsPosting(false);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Add this function after other handler functions
  const filteredPosts = posts.filter((post) => {
    const contentText = post.content_tree
      .map((node) => node.text)
      .join(" ")
      .toLowerCase();
    const matchesSearch =
      contentText.includes(searchQuery.toLowerCase()) ||
      post.creator?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => post.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  const handleVoteUp = async (postId: string) => {
    try {
      if (!backendActor) return;
      setLoadingVotes((prev) => ({
        ...prev,
        [postId]: { ...prev[postId], up: true },
      }));
      const result = await backendActor.vote_up(postId);
      if ("Ok" in result) {
        const updatedPosts = posts.map((post) =>
          post.id === postId ? result.Ok : post,
        );
        setPosts(updatedPosts);
      } else {
        enqueueSnackbar(result.Err, { variant: "error" });
      }
    } catch (err) {
      console.error("Error voting up:", err);
    } finally {
      setLoadingVotes((prev) => ({
        ...prev,
        [postId]: { ...prev[postId], up: false },
      }));
    }
  };

  const handleVoteDown = async (postId: string) => {
    try {
      if (!backendActor) return;
      setLoadingVotes((prev) => ({
        ...prev,
        [postId]: { ...prev[postId], down: true },
      }));
      const result = await backendActor.vote_down(postId);
      if ("Ok" in result) {
        const updatedPosts = posts.map((post) =>
          post.id === postId ? result.Ok : post,
        );
        setPosts(updatedPosts);
      } else {
        enqueueSnackbar(result.Err, { variant: "error" });
      }
    } catch (err) {
      // console.error("Error voting down:", err);
    } finally {
      setLoadingVotes((prev) => ({
        ...prev,
        [postId]: { ...prev[postId], down: false },
      }));
    }
  };

  const [isDeletingPost, setIsDeletingPost] = useState<string | null>(null);
  const [loadingVotes, setLoadingVotes] = useState<{
    [key: string]: { up?: boolean; down?: boolean };
  }>({});

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const handleDeletePost = async (postId: string) => {
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!backendActor || !postToDelete) return;
    setIsDeletingPost(postToDelete);
    try {
      const result = await backendActor.delete_post(postId);
      if ("Ok" in result) {
        const updatedPosts = posts.filter((post) => post.id !== postId);
        setPosts(updatedPosts);
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    } finally {
      setIsDeletingPost(null);
    }
  };

  const handleSavePost = async (post: PostUser) => {
    // if (!newPostContentRef.current || !backendActor) return;

    setIsSaving((prev) => ({ ...prev, [post.id]: true }));
    try {
      let de_changes: Array<Array<[string, Array<[string, ContentNode]>]>> =
        serializeFileContents(newPostContentRef.current);
      let content_tree: Array<[string, ContentNode]> = de_changes[0][0][1];

      const updatedPost: Post = {
        ...post,
        creator: String(profile.id),
        content_tree,
      };

      const result = await backendActor.save_post(updatedPost);
      if ("Ok" in result) {
        const updatedPosts = await backendActor.get_posts(
          BigInt(0),
          BigInt(20),
        );
        setPosts(updatedPosts.reverse());
        newPostContentRef.current = null;
      }
    } catch (err) {
      console.log("Error saving post:", err);
    } finally {
      // console.log("finally");
      setIsSaving((prev) => ({ ...prev, [post.id]: false }));
    }
  };

  const handleShare = (postId) => {
    alert("Share functionality would go here!");
  };

  const toggleComments = (postId) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleComment = (postId) => {
    if (!commentInputs[postId]?.trim()) return;

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [
              ...post.comments,
              {
                id: Date.now(),
                content: commentInputs[postId],
                timestamp: new Date().toLocaleString(),
                replies: [],
                user: currentUser,
              },
            ],
          };
        }
        return post;
      }),
    );

    setCommentInputs((prev) => ({
      ...prev,
      [postId]: "",
    }));
  };

  const handleReply = (postId, commentId, replyContent) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const updatedComments = addReplyToComment(post.comments, commentId, {
            id: Date.now(),
            content: replyContent,
            timestamp: new Date().toLocaleString(),
            replies: [],
            user: currentUser,
          });
          return { ...post, comments: updatedComments };
        }
        return post;
      }),
    );
  };

  const addReplyToComment = (comments, commentId, reply) => {
    return comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply],
        };
      }
      if (comment.replies?.length) {
        return {
          ...comment,
          replies: addReplyToComment(comment.replies, commentId, reply),
        };
      }
      return comment;
    });
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Post?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this post? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={async () => {
              setDeleteDialogOpen(false);
              if (!backendActor || !postToDelete) return;
              try {
                const result = await backendActor.delete_post(postToDelete);
                if ("Ok" in result) {
                  const updatedPosts = posts.filter(
                    (post) => post.id !== postToDelete,
                  );
                  setPosts(updatedPosts);
                }
              } catch (err) {
                console.error("Error deleting post:", err);
              } finally {
                setIsDeletingPost(null);
                setPostToDelete(null);
              }
            }}
            color="error"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <CreatePost
        key={isPosting}
        ref={createPostRef}
        onSubmit={handleNewPost}
        isPosting={isPosting}
      />

      <TagSearchField
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
      />

      {filteredPosts.map((post: PostUser) => (
        <Card key={post.id} sx={{ mb: 2 }}>
          <CardHeader
            avatar={post.creator && <UserAvatarMenu user={post.creator} />}
            title={post.creator && post.creator.name}
            subheader={new Date(
              Number(post.date_created) / 1e6,
            ).toLocaleString()}
          />
          <CardContent>
            <EditorComponent
              readOnly={
                post && post.creator?.id && post.creator.id !== profile?.id
              }
              content={deserializeContentTree(post.content_tree)}
              onChange={(changes) => {
                let new_change = {};
                new_change[""] = changes;
                newPostContentRef.current = new_change;
                if (!isChanged[post.id]) {
                  setIsChanged((prev) => ({ ...prev, [post.id]: true }));
                }
              }}
            />

            <PostTagsField
              post={post}
              suggestedTags={suggestedTags}
              canEdit={post.creator?.id === profile?.id}
              onTagsChange={(newTags) => {
                setPosts(
                  posts.map((p) =>
                    p.id === post.id ? { ...p, tags: newTags } : p,
                  ),
                );
                setIsChanged((prev) => ({ ...prev, [post.id]: true }));
              }}
            />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Box sx={{ display: "flex", gap: 1 }}>
                {post.creator?.id === profile?.id && (
                  <>
                    <Button
                      onClick={() => handleDeletePost(post.id)}
                      color="error"
                      size="small"
                      disabled={isDeletingPost === post.id}
                    >
                      {isDeletingPost === post.id ? "Deleting..." : "Delete"}
                    </Button>

                    <Button
                      onClick={async () => {
                        await handleSavePost(post);
                        setIsChanged((prev) => ({ ...prev, [post.id]: false }));
                      }}
                      color="primary"
                      size="small"
                      disabled={!isChanged[post.id] || isSaving[post.id]}
                    >
                      {isSaving[post.id] ? "Saving..." : "Save"}
                    </Button>
                  </>
                )}
                <Button
                  startIcon={<HeartIcon />}
                  onClick={() => handleVoteUp(post.id)}
                  disabled={loadingVotes[post.id]?.up}
                  color={
                    post.votes_up.some(
                      (p) =>
                        p.toString() ===
                        Principal.fromText("2vxsx-fae").toString(),
                    )
                      ? "primary"
                      : "inherit"
                  }
                >
                  {loadingVotes[post.id]?.up ? "..." : post.votes_up.length}
                </Button>
                <Button
                  startIcon={<ThumbsDownIcon />}
                  onClick={() => handleVoteDown(post.id)}
                  disabled={loadingVotes[post.id]?.down}
                  color={
                    post.votes_down.some(
                      (p) =>
                        p.toString() ===
                        Principal.fromText("2vxsx-fae").toString(),
                    )
                      ? "error"
                      : "inherit"
                  }
                >
                  {loadingVotes[post.id]?.down ? "..." : post.votes_down.length}
                </Button>
                <Button
                  startIcon={<MessageCircleIcon />}
                  onClick={() => toggleComments(post.id)}
                >
                  {post.comments && post.comments.length}
                </Button>
              </Box>
              <IconButton onClick={() => handleShare(post.id)}>
                <ShareIcon />
              </IconButton>
            </Box>

            {showComments[post.id] && (
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Write a comment..."
                    value={commentInputs[post.id] || ""}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                  />
                  <IconButton
                    onClick={() => handleComment(post.id)}
                    color="primary"
                  >
                    <SendIcon />
                  </IconButton>
                </Box>

                <Box sx={{ mt: 2 }}>
                  {post.comments &&
                    post.comments.map((comment) => (
                      <Comment
                        key={comment.id}
                        comment={comment}
                        onReply={(commentId, content) =>
                          handleReply(post.id, commentId, content)
                        }
                      />
                    ))}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default SocialPosts;
