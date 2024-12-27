import React from "react";
import {Avatar, Box, Card, CardContent, IconButton} from "@mui/material";
import {
  Heart,
  MessageCircle,
  MoreVertical,
  Share2,
  ThumbsDown,
} from "lucide-react";
import {styled} from "@mui/material/styles";
import {TagChip} from "./index";

interface ViewPostComponentProps {
  post: any;
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

const ViewPostComponent: React.FC<ViewPostComponentProps> = ({
  post,
  onLike,
}) => {
  return (
    <PostCard>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar src={post.author.avatar} sx={{ mr: 2 }} />
          <Box>
            <Box sx={{ fontWeight: "bold", color: "#E9D5FF" }}>
              {post.author.name}
            </Box>
            <Box sx={{ fontSize: "0.875rem", color: "#A78BFA" }}>
              {post.timestamp}
            </Box>
          </Box>
          <IconButton sx={{ ml: "auto" }}>
            <MoreVertical color="#E9D5FF" size={20} />
          </IconButton>
        </Box>

        <Box sx={{ mb: 2, color: "#E9D5FF" }}>{post.content}</Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {post.tags.map((tag) => (
            <TagChip key={tag}>{tag}</TagChip>
          ))}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            color: "#A78BFA",
          }}
        >
          <PostActionButton onClick={() => onLike(post.id)}>
            <Heart size={20} fill={post.liked ? "#A855F7" : "none"} />
            <Box component="span" sx={{ ml: 1, fontSize: "0.875rem" }}>
              {post.likes}
            </Box>
          </PostActionButton>

          <PostActionButton>
            <ThumbsDown size={20} />
            <Box component="span" sx={{ ml: 1, fontSize: "0.875rem" }}>
              {post.dislikes}
            </Box>
          </PostActionButton>

          <PostActionButton>
            <MessageCircle size={20} />
            <Box component="span" sx={{ ml: 1, fontSize: "0.875rem" }}>
              {post.comments.length}
            </Box>
          </PostActionButton>

          <PostActionButton>
            <Share2 size={20} />
            <Box component="span" sx={{ ml: 1, fontSize: "0.875rem" }}>
              {post.shares}
            </Box>
          </PostActionButton>
        </Box>

        {/* Comments Section */}
        {post.comments.length > 0 && (
          <Box
            sx={{
              mt: 2,
              pl: 2,
              borderLeft: "2px solid rgba(139, 92, 246, 0.2)",
            }}
          >
            {post.comments.map((comment) => (
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
