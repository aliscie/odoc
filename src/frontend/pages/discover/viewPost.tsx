import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material";
import {
  Favorite,
  Share,
  MoreVert as MoreVertical,
  ChatBubbleOutline,
  ThumbDown,
} from "@mui/icons-material";
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
import CommentList from "./CommentList";
import { RootState } from "../../redux/reducers";

interface ViewPostComponentProps {
  post: PostUser;
  handleDeletePost: (postId: string) => void;
}

const scaleUpAnimation = keyframes`
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.02);
  }
`;

const PostCard = styled(Card)(({ theme }) => ({
  background: 'transparent',
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: 0,
  position: "relative",
  boxShadow: "none",
  transition: "transform 0.2s ease-out",
  overflow: "visible",
  borderRadius: 0,
  marginBottom: 0,
  '&:hover': {
    animation: `${scaleUpAnimation} 0.2s ease-out forwards`
  }
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  "&:last-child": {
    paddingBottom: theme.spacing(2),
  },
  overflow: "visible",
  position: "relative",
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  transition: "all 0.2s",
  padding: theme.spacing(1),
  "&:hover": {
    color: theme.palette.primary.main,
    backgroundColor: `${theme.palette.primary.main}15`,
  },
  "&.liked": {
    color: theme.palette.error.main,
  },
  "&.disliked": {
    color: theme.palette.warning.main,
  },
  "&.shared": {
    color: theme.palette.success.main,
  },
  "&.Mui-disabled": {
    opacity: 0.5,
  }
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
  },
}));

const ViewPostComponent: React.FC<ViewPostComponentProps> = ({
  post,
  handleDeletePost,
}) => {
  const theme = useTheme();
  const { backendActor } = useBackendContext();
  const { enqueueSnackbar } = useSnackbar();
  const { profile } = useSelector((state: RootState) => state.filesState);
  const [showComments, setShowComments] = React.useState(false);
  const [voteLoading, setVoteLoad] = React.useState(false);
  const [isChanged, setChanged] = React.useState(false);
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

  const handleMenuClose = () => setMenuAnchorEl(null);

  const handleShare = () => {
    // navigator.clipboard.writeText(window.location.href);
    // enqueueSnackbar("Post link copied to clipboard", { variant: "success" });
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteDialogOpen(false);
    try {
      const res = await backendActor?.delete_post(post.id);
      if (res?.Ok === null) {
        enqueueSnackbar("Post deleted", { variant: "success" });
        handleDeletePost(post.id);
      } else {
        enqueueSnackbar(JSON.stringify(res?.Err), { variant: "error" });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to delete post", { variant: "error" });
    }
  };

  const onClickSave = async () => {
    setChanged(false);
    try {
      const newPostObj: Post = {
        ...post,
        tags: [],
        content_tree: serializeFileContents(contentTree.current)[0][0][1],
        creator: profile.id,
        votes_up: votes.up,
        votes_down: votes.down,
      };
      await backendActor.save_post(newPostObj);
      enqueueSnackbar("Post saved", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to save post", { variant: "error" });
    }
  };

  const onLike = async () => {
    if (profile?.id === post.creator.id) {
      enqueueSnackbar("Can't like your own post", { variant: "error" });
      return;
    }
    setVoteLoad(true);
    try {
      const votesUp = votes.up.map(v => v.toString());
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
      enqueueSnackbar("Can't dislike your own post", { variant: "error" });
      return;
    }
    setVoteLoad(true);
    try {
      const votesDown = votes.down.map(v => v.toString());
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

  return (
    <PostCard>
      <StyledCardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <UserAvatarMenu sx={{ mr: 2 }} user={post.creator} />
          <Box>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              fontWeight: "bold"
            }}>
              <Box component="span" sx={{
                color: theme.palette.text.secondary,
                fontWeight: 'normal'
              }}>
                @{post.creator.name}
              </Box>
              <Box component="span" sx={{
                color: theme.palette.text.secondary,
                fontWeight: 'normal'
              }}>
                · {formatRelativeTime(post.date_created)}
              </Box>
            </Box>
          </Box>

          {profile?.id === post.creator.id && (
            <IconButton sx={{ ml: "auto" }} onClick={handleMenuClick}>
              <MoreVertical />
            </IconButton>
          )}
        </Box>

        <Box sx={{ mb: 2, maxHeight: "400px", overflowY: "auto" }}>
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

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <ActionButton
            onClick={() => setShowComments(!showComments)}
            className={showComments ? "active" : ""}
          >
            <ChatBubbleOutline />
            <Box component="span" sx={{ ml: 1, fontSize: "0.875rem" }}>
              {post.children.length}
            </Box>
          </ActionButton>

          <ActionButton
            onClick={onLike}
            disabled={!profile || profile?.id === post.creator.id || voteLoading}
            className={votes.up.map(v => v.toString()).includes(profile?.id) ? "liked" : ""}
          >
            <Favorite />
            <Box component="span" sx={{ ml: 1, fontSize: "0.875rem" }}>
              {votes.up.length}
            </Box>
          </ActionButton>

          <ActionButton
            onClick={onDisLike}
            disabled={!profile || profile?.id === post.creator.id || voteLoading}
            className={votes.down.map(v => v.toString()).includes(profile?.id) ? "disliked" : ""}
          >
            <ThumbDown />
            <Box component="span" sx={{ ml: 1, fontSize: "0.875rem" }}>
              {votes.down.length}
            </Box>
          </ActionButton>

          <ActionButton onClick={handleShare}>
            <Share />
          </ActionButton>

          {profile?.id === post.creator.id && (
            <Button
              disabled={!isChanged}
              onClick={onClickSave}
              variant="contained"
              size="small"
              sx={{
                ml: 2,
                textTransform: "none",
                borderRadius: "20px"
              }}
            >
              Save
            </Button>
          )}
        </Box>

        <Collapse in={showComments}>
          <Box sx={{ mt: 3, borderTop: `1px solid ${theme.palette.divider}`, pt: 2 }}>
            <CommentList post={post} />
          </Box>
        </Collapse>

        <StyledMenu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleDeleteClick}>Delete Post</MenuItem>
        </StyledMenu>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete Post</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this post? This action cannot be undone.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </StyledCardContent>
    </PostCard>
  );
};

export default ViewPostComponent;
