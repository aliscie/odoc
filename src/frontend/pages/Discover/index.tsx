import React, { useState, useEffect } from "react";
import { Principal } from "@dfinity/principal";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
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
import UserAvatarMenu from "../../components/MainComponents/UserAvatarMenu";
import { useBackendContext } from "../../contexts/BackendContext";
import {
  ContentNode,
  Post,
  PostUser,
} from "../../../declarations/backend/backend.did";
import { useSelector } from "react-redux";
import { randomString } from "../../DataProcessing/dataSamples";
import EditorComponent from "../../components/EditorComponent";
import { logger } from "../../DevUtils/logData";
import { deserializeContentTree } from "../../DataProcessing/deserlize/deserializeContents";
import serializeFileContents from "../../DataProcessing/serialize/serializeFileContents";

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

const SearchField = ({ searchQuery, setSearchQuery, selectedTags, setSelectedTags }) => {
  const [tagInputs, setTagInputs] = useState<{[key: string]: string}>({});

  const handleAddTag = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      setSelectedTags([...selectedTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
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
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            size="small"
            placeholder="Add tag..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddTag();
              }
            }}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={handleAddTag}
          >
            Add Tag
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {selectedTags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onDelete={() => handleRemoveTag(tag)}
              size="small"
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

const SocialPosts = () => {
  const { backendActor } = useBackendContext();
  const [posts, setPosts] = useState<Array<PostUser>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const [newPostContent, setNewPostContent] = useState<any>(null);
  const [newPostTags, setNewPostTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [commentInputs, setCommentInputs] = useState({});
  const [showComments, setShowComments] = useState({});
  const [isPosting, setIsPosting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleNewPost = async () => {
    if (!newPostContent || !backendActor) return;
    setIsPosting(true);

    try {
      let de_changes: Array<Array<[string, Array<[string, ContentNode]>]>> =
        serializeFileContents(newPostContent);
      let content_tree: Array<[string, ContentNode]> = de_changes[0][0][1];
      console.log({ content_tree });
      const newPost: Post = {
        id: randomString(),
        creator: profile.id,
        date_created: BigInt(Date.now() * 1e6),
        votes_up: [],
        tags: newPostTags,
        content_tree,
        votes_down: [],
      };
      console.log({ newPost });
      try {
        const result = await backendActor.save_post(newPost);
        if ("Ok" in result) {
          const updatedPosts = await backendActor.get_posts(
            BigInt(0),
            BigInt(20),
          );
          setPosts(updatedPosts.reverse());
          setNewPostContent(null);
          setNewPostTags([]);
          setTagInput("");
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
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => post.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  const handleVoteUp = async (postId: string) => {
    try {
      if (!backendActor) return;
      const result = await backendActor.vote_up(postId);
      if ("Ok" in result) {
        const updatedPosts = posts.map((post) =>
          post.id === postId ? result.Ok : post,
        );
        setPosts(updatedPosts);
      } else {
        console.error("Failed to vote up:", result.Err);
      }
    } catch (err) {
      console.error("Error voting up:", err);
    }
  };

  const handleVoteDown = async (postId: string) => {
    try {
      if (!backendActor) return;
      const result = await backendActor.vote_down(postId);
      if ("Ok" in result) {
        const updatedPosts = posts.map((post) =>
          post.id === postId ? result.Ok : post,
        );
        setPosts(updatedPosts);
      } else {
        console.error("Failed to vote down:", result.Err);
      }
    } catch (err) {
      console.error("Error voting down:", err);
    }
  };

  const [isDeletingPost, setIsDeletingPost] = useState<string | null>(null);

  const handleDeletePost = async (postId: string) => {
    if (!backendActor) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this post?",
    );
    if (!confirmed) return;

    setIsDeletingPost(postId);
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
    if (!newPostContent || !backendActor) return;

    setIsSaving(true);
    try {
      let de_changes: Array<Array<[string, Array<[string, ContentNode]>]>> =
        serializeFileContents(newPostContent);
      let content_tree: Array<[string, ContentNode]> = de_changes[0][0][1];

      const updatedPost: Post = {
        ...post,
        creator: profile.id,
        content_tree,
      };

      const result = await backendActor.save_post(updatedPost);
      if ("Ok" in result) {
        const updatedPosts = await backendActor.get_posts(
          BigInt(0),
          BigInt(20),
        );
        setPosts(updatedPosts.reverse());
        setNewPostContent(null);
      }
    } catch (err) {
      console.error("Error saving post:", err);
    } finally {
      setIsSaving(false);
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
  console.log({ filteredPosts });

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
            <Box>
              <EditorComponent
                contentEditable={true}
                onChange={(changes) => {
                  let new_change = {};
                  new_change[""] = changes;
                  setNewPostContent(new_change);
                }}
                content={[]}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Add tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && tagInput.trim()) {
                    setNewPostTags([...new Set([...newPostTags, tagInput.trim()])]);
                    setTagInput("");
                  }
                }}
              />
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  if (tagInput.trim()) {
                    setNewPostTags([...new Set([...newPostTags, tagInput.trim()])]);
                    setTagInput("");
                  }
                }}
              >
                Add Tag
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {newPostTags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => setNewPostTags(newPostTags.filter(t => t !== tag))}
                  size="small"
                />
              ))}
            </Box>
          </Box>
          <Button
            variant="contained"
            fullWidth
            onClick={handleNewPost}
            disabled={isPosting}
          >
            {isPosting ? "Posting..." : "Post"}
          </Button>
        </CardContent>
      </Card>

      <SearchField 
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
            {post.content_tree && post.content_tree.length > 0 ? (
              <EditorComponent
                readOnly={
                  post && post.creator?.id && post.creator.id !== profile?.id
                }
                content={deserializeContentTree(post.content_tree)}
                onChange={(changes) => {
                  let new_change = {};
                  new_change[""] = changes;
                  setNewPostContent(new_change);
                }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                No content
              </Typography>
            )}

            <Box sx={{ mb: 2 }}>
              {post.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{ mr: 1, mb: 1 }}
                  onDelete={post.creator?.id === profile?.id ? () => {
                    const updatedPost = {
                      ...post,
                      tags: post.tags.filter(t => t !== tag)
                    };
                    handleSavePost(updatedPost);
                  } : undefined}
                />
              ))}
              {post.creator?.id === profile?.id && (
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Add tag..."
                    value={tagInputs[post.id] || ""}
                    onChange={(e) => setTagInputs(prev => ({...prev, [post.id]: e.target.value}))}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && tagInputs[post.id]?.trim()) {
                        const updatedPost = {
                          ...post,
                          tags: [...new Set([...post.tags, tagInputs[post.id].trim()])]
                        };
                        handleSavePost(updatedPost);
                        setTagInputs(prev => ({...prev, [post.id]: ""}));
                      }
                    }}
                    sx={{ width: 120 }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      if (tagInputs[post.id]?.trim()) {
                        const updatedPost = {
                          ...post,
                          tags: [...new Set([...post.tags, tagInputs[post.id].trim()])]
                        };
                        handleSavePost(updatedPost);
                        setTagInputs(prev => ({...prev, [post.id]: ""}));
                      }
                    }}
                  >
                    Add Tag
                  </Button>
                </Box>
              )}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
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
                      onClick={() => handleSavePost(post)}
                      color="primary"
                      size="small"
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save"}
                    </Button>

                  </>
                )}
                <Button
                  startIcon={<HeartIcon />}
                  onClick={() => handleVoteUp(post.id)}
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
                  {post.votes_up.length}
                </Button>
                <Button
                  startIcon={<ThumbsDownIcon />}
                  onClick={() => handleVoteDown(post.id)}
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
                  {post.votes_down.length}
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
