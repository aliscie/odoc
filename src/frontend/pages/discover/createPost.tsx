import React, { useRef, useState } from "react";
import { Box, Button, Card, CardContent, IconButton } from "@mui/material";
import { Hash, Image as ImageIcon, Send, Smile } from "lucide-react";
import { keyframes, styled } from "@mui/material/styles";
import EditorComponent from "../../components/EditorComponent";
import { Post } from "../../../declarations/backend/backend.did";
import { useSelector } from "react-redux";
import { randomString } from "../../DataProcessing/dataSamples";
import serializeFileContents from "../../DataProcessing/serialize/serializeFileContents";
import { useBackendContext } from "../../contexts/BackendContext";
import { useSnackbar } from "notistack";

interface CreatePostProps {
  onPostSubmit: (post: any) => void;
}
const CreatePost: React.FC<CreatePostProps> = ({ onPostSubmit }) => {
  const { profile } = useSelector((state: any) => state.filesState);
  const { backendActor } = useBackendContext();
  // const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // const extractTags = (content: string) => {
  //   const tags = content.match(/#\w+/g);
  //   return tags || [];
  // };

  const handleSubmit = async () => {
    // if (!newPost.trim()) return;
    let content_tree = serializeFileContents(postContent.current)[0][0][1];
    // console.log(content_tree);
    // content_tree =
    const newPostObj: Post = {
      id: randomString(),
      creator: profile.id,
      date_created: BigInt(Date.now() * 1e6),
      votes_up: [],
      tags: [],
      content_tree,
      votes_down: [],
    };
    setLoading(true);
    const result = await backendActor.save_post(newPostObj);
    console.log(result);
    if (result.Err) {
      enqueueSnackbar(result.Err, { variant: "error" });
    }
    setLoading(false);

    onPostSubmit({ ...newPostObj, creator: profile });
    // setNewPost("");
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
  const postContent = useRef([]);
  return (
    <CreatePostCard>
      <CardContent>
        <EditorComponent
          // readOnly={!isAuthoer}
          // id={current_file.id}
          contentEditable={true}
          onChange={(content) => {
            let c = {};
            c[""] = content;
            postContent.current = c;
          }}
          editorKey={"editorKey"}
          content={[]}
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
            disabled={loading}
            sx={{
              borderRadius: "9999px",
              background: "linear-gradient(90deg, #6366F1, #8B5CF6)",
              "&:hover": {
                background: "linear-gradient(90deg, #4F46E5, #7C3AED)",
              },
            }}
          >
            Create post
          </Button>
        </Box>
      </CardContent>
    </CreatePostCard>
  );
};

export default CreatePost;
