import React from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
} from "@mui/material";
import {
  Heart,
  MessageCircle,
  MoreVertical,
  Share2,
  ThumbsDown,
} from "lucide-react";
import { styled } from "@mui/material/styles";
import { TagChip } from "./index";

import {
  PostUser,
  ContentNode,
} from "../../../declarations/backend/backend.did";
import { Principal } from "@dfinity/principal";
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

const PostCard = styled(Card)({
  background: "rgba(17, 24, 39, 0.75)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(139, 92, 246, 0.2)",
  borderRadius: "1rem",
  marginBottom: "1rem",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
  },
});

const PostActionButton = styled(IconButton)({
  color: "#E9D5FF",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.1)",
    color: "#A855F7",
  },
});

const ViewPostComponent: React.FC<ViewPostComponentProps> = ({ post }) => {
  const { backendActor } = useBackendContext();
  const [voteLoading, setVoteLoad] = React.useState(false);
  const [votes, setVotes] = React.useState({
    up: post.votes_up,
    down: post.votes_down,
  });

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const onLike = async () => {
    if (profile.id == post.creator.id) {
      enqueueSnackbar("You can't like your own post", { variant: "error" });
      return;
    }
    setVoteLoad(true);
    let votesUp = votes.up.map((v) => v.toString());
    if (votesUp.some((v) => v === profile.id)) {
      let res = await backendActor.unvote(post.id);
      setVotes({ up: res.Ok.votes_up, down: res.Ok.votes_down });
    } else {
      let res = await backendActor.vote_up(post.id);
      setVotes({ up: res.Ok.votes_up, down: res.Ok.votes_down });
    }
    setVoteLoad(false);
  };
  const onDisLike = async () => {
    if (profile.id == post.creator.id) {
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
  return (
    <PostCard>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <UserAvatarMenu sx={{ mr: 2 }} user={post.creator} />
          <Box>
            <Box sx={{ fontWeight: "bold", color: "#E9D5FF" }}>
              {post.creator.name}
            </Box>
            <Box sx={{ fontSize: "0.875rem", color: "#A78BFA" }}>
              {formatRelativeTime(post.date_created)}
            </Box>
          </Box>
          <IconButton sx={{ ml: "auto" }}>
            <MoreVertical color="#E9D5FF" size={20} />
          </IconButton>
        </Box>

        <Box sx={{ mb: 2, color: "#E9D5FF" }}>
          <EditorComponent
            readOnly={true}
            // id={current_file.id}
            // contentEditable={true}
            onChange={(content) => {
              let c = {};
              c[""] = content;
              // postContent.current = c;
            }}
            editorKey={"editorKey"}
            content={deserializeContentTree(post.content_tree)}
          />
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
