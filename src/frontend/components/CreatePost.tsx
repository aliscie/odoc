import React, { forwardRef, useImperativeHandle, useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  TextField,
} from "@mui/material";
import EditorComponent from "./EditorComponent";

export interface CreatePostRef {
  getContent: () => any;
  getTags: () => string[];
  reset: () => void;
}

interface CreatePostProps {
  onSubmit: (content: any, tags: string[]) => Promise<void>;
  isPosting: boolean;
}

const CreatePost = forwardRef<CreatePostRef, CreatePostProps>(
  ({ onSubmit, isPosting }, ref) => {
    const contentRef = useRef<any>(null);
    const tagsRef = useRef<string[]>([]);
    const tagInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      getContent: () => contentRef.current,
      getTags: () => tagsRef.current,
      reset: () => {
        contentRef.current = null;
        tagsRef.current = [];
        if (tagInputRef.current) {
          tagInputRef.current.value = "";
        }
      },
    }));

    const handleAddTag = () => {
      const tagInput = tagInputRef.current;
      if (tagInput && tagInput.value.trim()) {
        tagsRef.current = [...new Set([...tagsRef.current, tagInput.value.trim()])];
        tagInput.value = "";
      }
    };

    const handleRemoveTag = (tagToRemove: string) => {
      tagsRef.current = tagsRef.current.filter((tag) => tag !== tagToRemove);
    };

    const handleSubmit = async () => {
      await onSubmit(contentRef.current, tagsRef.current);
    };

    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
            <Box>
              <EditorComponent
                contentEditable={true}
                onChange={(changes) => {
                  let new_change = {};
                  new_change[""] = changes;
                  contentRef.current = new_change;
                }}
                content={[]}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                inputRef={tagInputRef}
                size="small"
                placeholder="Add tag..."
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
              {tagsRef.current.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  size="small"
                />
              ))}
            </Box>
          </Box>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={isPosting}
          >
            {isPosting ? "Posting..." : "Post"}
          </Button>
        </CardContent>
      </Card>
    );
  }
);

export default CreatePost;
