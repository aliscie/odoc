import React, {useState} from "react";
import {Box, Button, Card, CardContent, IconButton} from "@mui/material";
import {Hash, Image as ImageIcon, Send, Smile} from "lucide-react";
import {keyframes, styled} from "@mui/material/styles";
import {StyledTextField} from "./index";

interface CreatePostProps {
  onPostSubmit: (post: any) => void;
}
const CreatePost: React.FC<CreatePostProps> = ({ onPostSubmit }) => {
  const [newPost, setNewPost] = useState("");

  const extractTags = (content: string) => {
    const tags = content.match(/#\w+/g);
    return tags || [];
  };

  const handleSubmit = () => {
    if (!newPost.trim()) return;

    const newPostObj = {
      id: Date.now(),
      author: {
        name: "Current User",
        avatar: "/api/placeholder/32/32",
      },
      content: newPost,
      tags: extractTags(newPost),
      likes: 0,
      dislikes: 0,
      comments: [],
      shares: 0,
      timestamp: "Just now",
    };

    onPostSubmit(newPostObj);
    setNewPost("");
  };

const shimmer = keyframes`
  0% { transform: translateX(-50%); }
  100% { transform: translateX(50%); }
`;


const CreatePostCard = styled(Card)({
  background: "rgba(17, 24, 39, 0.85)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(139, 92, 246, 0.2)",
  borderRadius: "1rem",
  marginBottom: "2rem",
  overflow: "visible",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)",
    // animation: `${shimmer} 2s linear infinite`,
  },
});
  return (
    <CreatePostCard>
      <CardContent>
        <StyledTextField
          fullWidth
          multiline
          rows={3}
          placeholder="What's on your mind?"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <IconButton>
              <ImageIcon color="#E9D5FF" />
            </IconButton>
            <IconButton>
              <Smile color="#E9D5FF" />
            </IconButton>
            <IconButton>
              <Hash color="#E9D5FF" />
            </IconButton>
          </Box>
          <Button
            variant="contained"
            endIcon={<Send />}
            onClick={handleSubmit}
            sx={{
              borderRadius: "9999px",
              background: "linear-gradient(90deg, #6366F1, #8B5CF6)",
              "&:hover": {
                background: "linear-gradient(90deg, #4F46E5, #7C3AED)",
              },
            }}
          >
            Post
          </Button>
        </Box>
      </CardContent>
    </CreatePostCard>
  );
};

export default CreatePost;
