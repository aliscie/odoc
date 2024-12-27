import React, { useContext } from "react";
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
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Heart, MoreVertical, ThumbsDown } from "lucide-react";
import { keyframes, styled } from "@mui/material/styles";

import { PostUser } from "../../../declarations/backend/backend.did";
import { formatRelativeTime } from "../../utils/time";
import EditorComponent from "../../components/EditorComponent";
import { deserializeContentTree } from "../../DataProcessing/deserlize/deserializeContents";
import { useSelector } from "react-redux";
import UserAvatarMenu from "../../components/MainComponents/UserAvatarMenu";
import { useSnackbar } from "notistack";
import { useBackendContext } from "../../contexts/BackendContext";

interface ViewPostComponentProps {
  post: PostUser;
  onLike: (postId: string) => void;
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PostCard = styled(Card)(({ theme }) => ({
  background: "rgba(17, 25, 40, 0.75)",
  backdropFilter: "blur(16px) saturate(180%)",
  border: "1px solid rgba(255, 255, 255, 0.125)",
  borderRadius: "16px",
  padding: "12px",
  // width: '320px',
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 40px rgba(0, 0, 0, 0.2)",
  },

  // background: "linear-gradient(90deg, #6366F1, #8B5CF6)",
  // background:
  //   theme.palette.mode === "dark"
  //     ? "rgba(46,67,112,0.85)"
  //     : "rgba(203,203,203,0.85)",
  // "&::before": {
  //   content: '""',
  //   position: "absolute",
  //   inset: 0,
  //   background:
  //     "linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)",
  //   // animation: `${shine} 2s linear infinite`,
  // },
  // backdropFilter: "blur(50px)",
  // border: `1px solid ${
  //   theme.palette.mode === "dark"
  //     ? "rgba(139, 92, 246, 0.2)"
  //     : "rgba(79, 70, 229, 0.2)"
  // }`,
  // borderRadius: "1rem",
  // marginBottom: "1rem",
  // transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  // animation: `${fadeIn} 0.5s ease-out`,
  // "&:hover": {
  //   transform: "translateY(-2px)",
  //   boxShadow:
  //     theme.palette.mode === "dark"
  //       ? "0 8px 30px rgba(139, 92, 246, 0.1)"
  //       : "0 8px 30px rgba(79, 70, 229, 0.1)",
  // },
}));

const PostActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#E9D5FF" : "#6366F1",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  padding: "8px",
  borderRadius: "12px",
  "&:hover": {
    transform: "scale(1.1)",
    backgroundColor:
      theme.palette.mode === "dark"
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

const ViewPostComponent: React.FC<ViewPostComponentProps> = ({
  post,
  handleDeletePost,
}) => {
  const { backendActor } = useBackendContext();
  const [voteLoading, setVoteLoad] = React.useState(false);
  const [isChanged, setchanged] = React.useState(false);
  const [votes, setVotes] = React.useState({
    up: post.votes_up,
    down: post.votes_down,
  });

  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(
    null,
  );
  const [isDeleteing, setIsDeleteing] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

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
    setIsDeleteing(true);
    try {
      await backendActor?.delete_post(post.id);
      enqueueSnackbar("Post deleted successfully", { variant: "success" });
      handleDeletePost(post.id);
      // You may want to trigger a refresh of the posts list here
    } catch (error) {
      enqueueSnackbar("Failed to delete post", { variant: "error" });
    }
  };

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const onClickSave = async () => {
    setchanged(false);
    // await backend
  };

  const onLike = async () => {
    if (profile?.id == post.creator.id) {
      enqueueSnackbar("You can't like your own post", { variant: "error" });
      return;
    }
    setVoteLoad(true);
    let votesUp = votes.up.map((v) => v.toString());
    if (votesUp.some((v) => v === profile?.id)) {
      let res = await backendActor.unvote(post.id);
      setVotes({ up: res.Ok.votes_up, down: res.Ok.votes_down });
    } else {
      let res = await backendActor.vote_up(post.id);
      setVotes({ up: res.Ok.votes_up, down: res.Ok.votes_down });
    }
    setVoteLoad(false);
  };
  const onDisLike = async () => {
    if (profile?.id == post.creator.id) {
      enqueueSnackbar("You can't dislike your own post", { variant: "error" });
      return;
    }
    setVoteLoad(true);
    let votesDown = votes.down.map((v) => v.toString());
    if (votesDown.some((v) => v === profile.id)) {
      let res = await backendActor.unvote(post.id);
      setVotes({ up: res.Ok.votes_up, down: res.Ok.votes_down });
    } else {
      let res = await backendActor.vote_down(post.id);

      setVotes({ up: res.Ok.votes_up, down: res.Ok.votes_down });
    }
    setVoteLoad(false);
  };
  const { profile } = useSelector((state: any) => state.filesState);
  if (isDeleteing) {
    return (
      <PostCard>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "10rem",
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        </CardContent>
      </PostCard>
    );
  }
  return (
    <PostCard>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <UserAvatarMenu sx={{ mr: 2 }} user={post.creator} />
          <Box>
            <Box sx={{ fontWeight: "bold" }}>{post.creator.name}</Box>
            <Box sx={{ fontSize: "0.875rem" }}>
              {formatRelativeTime(post.date_created)}
            </Box>
          </Box>
          <IconButton sx={{ ml: "auto" }} onClick={handleMenuClick}>
            <MoreVertical color="#E9D5FF" size={20} />
          </IconButton>
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              style: {
                backgroundColor: "rgba(17, 24, 39, 0.95)",
                border: "1px solid rgba(139, 92, 246, 0.2)",
              },
            }}
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
          </Menu>

          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            PaperProps={{
              style: {
                backgroundColor: "rgba(17, 24, 39, 0.95)",
                border: "1px solid rgba(139, 92, 246, 0.2)",
              },
            }}
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
          </Dialog>
        </Box>

        <Box sx={{ mb: 2 }}>
          <DndProvider backend={HTML5Backend}>
            <EditorComponent
              editorKey={post.id}
              readOnly={profile?.id !== post.creator.id}
              id={post.id}
              contentEditable={profile?.id === post.creator.id}
              onChange={(content) => {
                let c = {};
                c[""] = content;
                if (isChanged == false && post.creator.id == profile?.id) {
                  setchanged(true);
                }
              }}
              content={deserializeContentTree(post.content_tree)}
            />
          </DndProvider>
        </Box>

        {/*<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>*/}
        {/*  {post.tags.map((tag) => (*/}
        {/*    <TagChip key={tag}>{tag}</TagChip>*/}
        {/*  ))}*/}
        {/*</Box>*/}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            color: "#A78BFA",
          }}
        >
          <PostActionButton
            disabled={profile?.id == post.creator.id || voteLoading}
            onClick={onLike}
          >
            <Heart
              size={20}
              fill={
                votes.up
                  .map((v) => v.toString())
                  .includes(profile && profile.id)
                  ? "#A855F7"
                  : "rgba(233,213,255,0)"
              }
            />
            <Box component="span" sx={{ ml: 1, fontSize: "0.875rem" }}>
              {votes.up.length}
            </Box>
          </PostActionButton>

          <PostActionButton
            disabled={profile?.id == post.creator.id || voteLoading}
            onClick={onDisLike}
          >
            <ThumbsDown
              fill={
                votes.down
                  .map((v) => v.toString())
                  .includes(profile && profile.id)
                  ? "#A855F7"
                  : "rgba(233,213,255,0)"
              }
              size={20}
            />
            <Box component="span" sx={{ ml: 1, fontSize: "0.875rem" }}>
              {votes.down.length}
            </Box>
          </PostActionButton>
          {profile?.id==post.creator.id&&<PostActionButton
              disabled={!isChanged}
              onClick={onClickSave}>Save</PostActionButton>}
          {/*{isChanged && (*/}
          {/*  */}
          {/*)}*/}
        </Box>

        {/* Comments Section */}
        {post.comments && post.comments.length > 0 && (
          <Box
            sx={{
              mt: 2,
              pl: 2,
              borderLeft: "2px solid rgba(139, 92, 246, 0.2)",
            }}
          >
            {post.comments &&
              post.comments.map((comment) => (
                <Box key={comment.id} sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Box
                      sx={{
                        fontWeight: "bold",
                        color: "#E9D5FF",
                        fontSize: "0.875rem",
                      }}
                    >
                      {comment.author}
                    </Box>
                  </Box>
                  <Box sx={{ color: "#E9D5FF", fontSize: "0.875rem" }}>
                    {comment.content}
                  </Box>
                  {/* Replies */}
                  {comment.replies.map((reply) => (
                    <Box
                      key={reply.id}
                      sx={{ ml: 4, mt: 1, fontSize: "0.875rem" }}
                    >
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
      </CardContent>
    </PostCard>
  );
};
export default ViewPostComponent;
