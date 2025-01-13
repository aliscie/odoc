import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Heart, MoreVertical, ThumbsDown } from "lucide-react";
import { keyframes, styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { formatRelativeTime } from "../../utils/time";
import EditorComponent from "../../components/EditorComponent";
import { deserializeContentTree } from "../../DataProcessing/deserlize/deserializeContents";
import UserAvatarMenu from "../../components/MainComponents/UserAvatarMenu";
import { useBackendContext } from "../../contexts/BackendContext";
import serializeFileContents from "../../DataProcessing/serialize/serializeFileContents";
import { Post, PostUser } from "../../../declarations/backend/backend.did";

interface ViewPostComponentProps {
  post: PostUser;
  handleDeletePost: (postId: string) => void;
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PostCard = styled(Card)(({ theme }) => ({
  background: "rgba(143,143,143,0.42)",
  backdropFilter: "blur(16px) saturate(180%)",
  border: "1px solid rgba(255, 255, 255, 0.125)",
  borderRadius: theme.spacing(2),
  padding: 0,
  position: "static",
  boxShadow: theme.shadows[1],
  transition: theme.transitions.create(["transform", "box-shadow"], {
    duration: theme.transitions.duration.shorter,
  }),
  overflow: "visible",
  marginBottom: theme.spacing(2),
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
  },
  animation: `${fadeIn} 0.5s ease-out`,
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  "&:last-child": {
    paddingBottom: theme.spacing(2),
  },
  overflow: "visible",
  position: "static",
}));

const PostActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#E9D5FF" : "#6366F1",
  transition: theme.transitions.create(["transform", "background-color"], {
    duration: theme.transitions.duration.shorter,
  }),
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius * 1.5,
  "&:hover": {
    transform: "scale(1.1)",
    backgroundColor: theme.palette.mode === "dark"
      ? "rgba(139, 92, 246, 0.1)"
      : "rgba(79, 70, 229, 0.1)",
  },
  "&:active": {
    transform: "scale(0.95)",
  },
  "&.Mui-disabled": {
    opacity: 0.5,
    color: theme.palette.mode === "dark" ? "#4B5563" : "#9CA3AF",
  },
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: theme.palette.mode === "dark"
      ? "rgba(17, 24, 39, 0.95)"
      : "rgba(255, 255, 255, 0.95)",
    border: `1px solid ${
      theme.palette.mode === "dark"
        ? "rgba(139, 92, 246, 0.2)"
        : "rgba(79, 70, 229, 0.2)"
    }`,
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: theme.palette.mode === "dark"
      ? "rgba(17, 24, 39, 0.95)"
      : "rgba(255, 255, 255, 0.95)",
    border: `1px solid ${
      theme.palette.mode === "dark"
        ? "rgba(139, 92, 246, 0.2)"
        : "rgba(79, 70, 229, 0.2)"
    }`,
  },
}));

const ViewPostComponent: React.FC<ViewPostComponentProps> = ({
  post,
  handleDeletePost,
}) => {
  const { backendActor } = useBackendContext();
  const { enqueueSnackbar } = useSnackbar();
  const { profile } = useSelector((state: any) => state.filesState);

  const [voteLoading, setVoteLoad] = React.useState(false);
  const [isChanged, setChanged] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [votes, setVotes] = React.useState({
    up: post.votes_up,
    down: post.votes_down,
  });

  const contentTree = React.useRef([]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteDialogOpen(false);
    setIsDeleting(true);
    try {
      const res = await backendActor?.delete_post(post.id);
      if (res?.Ok === null) {
        enqueueSnackbar("Post deleted successfully", { variant: "success" });
        handleDeletePost(post.id);
      } else {
        enqueueSnackbar(JSON.stringify(res?.Err), { variant: "error" });
      }
    } catch (error) {
      console.error({ error });
      enqueueSnackbar("Failed to delete post: " + error, { variant: "error" });
    }
  };

  const onClickSave = async () => {
    setChanged(false);
    const newPostObj: Post = {
      ...post,
      tags: [],
      content_tree: serializeFileContents(contentTree.current)[0][0][1],
      creator: profile.id,
      votes_up: votes.up,
      votes_down: votes.down,
    };

    const result = await backendActor.save_post(newPostObj);
    console.log({ result });
  };

  const onLike = async () => {
    if (profile?.id === post.creator.id) {
      enqueueSnackbar("You can't like your own post", { variant: "error" });
      return;
    }
    setVoteLoad(true);
    try {
      const votesUp = votes.up.map((v) => v.toString());
      if (votesUp.includes(profile?.id)) {
        const res = await backendActor.unvote(post.id);
        setVotes({ up: res.Ok.votes_up, down: res.Ok.votes_down });
      } else {
        const res = await backendActor.vote_up(post.id);
        setVotes({ up: res.Ok.votes_up, down: res.Ok.votes_down });
      }
    } finally {
      setVoteLoad(false);
    }
  };

  const onDisLike = async () => {
    if (profile?.id === post.creator.id) {
      enqueueSnackbar("You can't dislike your own post", { variant: "error" });
      return;
    }
    setVoteLoad(true);
    try {
      const votesDown = votes.down.map((v) => v.toString());
      if (votesDown.includes(profile.id)) {
        const res = await backendActor.unvote(post.id);
        setVotes({ up: res.Ok.votes_up, down: res.Ok.votes_down });
      } else {
        const res = await backendActor.vote_down(post.id);
        setVotes({ up: res.Ok.votes_up, down: res.Ok.votes_down });
      }
    } finally {
      setVoteLoad(false);
    }
  };

  if (isDeleting) {
    return (
      <PostCard>
        <StyledCardContent>
          <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "10rem"
          }}>
            <CircularProgress color="primary" />
          </Box>
        </StyledCardContent>
      </PostCard>
    );
  }

  return (
    <PostCard>
      <StyledCardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <UserAvatarMenu sx={{ mr: 2 }} user={post.creator} />
          <Box>
            <Box sx={{ fontWeight: "bold" }}>{post.creator.name}</Box>
            <Box sx={{ fontSize: "0.875rem" }}>
              {formatRelativeTime(post.date_created)}
            </Box>
          </Box>
          {profile?.id === post.creator.id && (
            <IconButton sx={{ ml: "auto" }} onClick={handleMenuClick}>
              <MoreVertical color="#E9D5FF" size={20} />
            </IconButton>
          )}
          <StyledMenu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={handleDeleteClick}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(139, 92, 246, 0.1)",
                },
              }}
            >
              Delete Post
            </MenuItem>
          </StyledMenu>

          <StyledDialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
          >
            <DialogTitle>Delete Post</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this post? This action cannot be
              undone.
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setDeleteDialogOpen(false)}
                sx={{
                  color: "#A78BFA",
                  "&:hover": {
                    backgroundColor: "rgba(139, 92, 246, 0.1)",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                sx={{
                  color: "#ff4444",
                  "&:hover": {
                    backgroundColor: "rgba(255, 68, 68, 0.1)",
                  },
                }}
                autoFocus
              >
                Delete
              </Button>
            </DialogActions>
          </StyledDialog>
        </Box>

        <Box sx={{ mb: 2 }}>
          <EditorComponent
            editorKey={post.id}
            readOnly={profile?.id !== post.creator.id}
            id={post.id}
            contentEditable={profile?.id === post.creator.id}
            onChange={(content) => {
              contentTree.current = { "": content };
              if (!isChanged && post.creator.id === profile?.id) {
                setChanged(true);
              }
            }}
            content={deserializeContentTree(post.content_tree)}
          />
        </Box>

        <Box sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          color: "#A78BFA",
        }}>
          <PostActionButton
            disabled={!profile || profile?.id === post.creator.id || voteLoading}
            onClick={onLike}
          >
            <Heart
              size={20}
              fill={votes.up.map((v) => v.toString()).includes(profile?.id)
                ? "#A855F7"
                : "rgba(233,213,255,0)"}
            />
            <Box component="span" sx={{ ml: 1, fontSize: "0.875rem" }}>
              {votes.up.length}
            </Box>
          </PostActionButton>

          <PostActionButton
            disabled={!profile || profile?.id === post.creator.id || voteLoading}
            onClick={onDisLike}
          >
            <ThumbsDown
              fill={votes.down.map((v) => v.toString()).includes(profile?.id)
                ? "#A855F7"
                : "rgba(233,213,255,0)"}
              size={20}
            />
            <Box component="span" sx={{ ml: 1, fontSize: "0.875rem" }}>
              {votes.down.length}
            </Box>
          </PostActionButton>

          {profile?.id === post.creator.id && (
            <PostActionButton disabled={!isChanged} onClick={onClickSave}>
              Save
            </PostActionButton>
          )}
        </Box>

        {post.comments?.length > 0 && (
          <Box sx={{
            mt: 2,
            pl: 2,
            borderLeft: "2px solid rgba(139, 92, 246, 0.2)",
          }}>
            {post.comments.map((comment) => (
              <Box key={comment.id} sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Box sx={{
                    fontWeight: "bold",
                    color: "#E9D5FF",
                    fontSize: "0.875rem",
                  }}>
                    {comment.author}
                  </Box>
                </Box>
                <Box sx={{ color: "#E9D5FF", fontSize: "0.875rem" }}>
                  {comment.content}
                </Box>
                {comment.replies.map((reply) => (
                  <Box key={reply.id} sx={{ ml: 4, mt: 1, fontSize: "0.875rem" }}>
                    <Box sx={{ fontWeight: "bold", color: "#E9D5FF" }}>
                      {reply.author}
                    </Box>
                    <Box sx={{ color: "#E9D5FF" }}>{reply.content}</Box>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        )}
      </StyledCardContent>
    </PostCard>
  );
};

export default ViewPostComponent;
