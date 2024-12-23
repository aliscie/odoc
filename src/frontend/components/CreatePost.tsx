import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { X } from "lucide-react";
import EditorComponent from "./EditorComponent";
import {
  Input,
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
    const [forceUpdate, setForceUpdate] = useState(false);
    const [tags, setTags] = useState<string[]>([]);

    useImperativeHandle(ref, () => ({
      getContent: () => contentRef.current,
      getTags: () => tagsRef.current,
      reset: () => {
        contentRef.current = null;
        tagsRef.current = [];
        if (tagInputRef.current) {
          tagInputRef.current.value = "";
        }
        setForceUpdate((prev) => !prev);
      },
    }));

    const handleAddTag = () => {
      const tagInput = tagInputRef.current;
      if (tagInput && tagInput.value.trim()) {
        const newTag = tagInput.value.trim();
        tagsRef.current = [...new Set([...tagsRef.current, newTag])];
        setTags([...new Set([...tags, newTag])]);
        tagInput.value = "";
      }
    };

    const handleRemoveTag = (tagToRemove: string) => {
      tagsRef.current = tagsRef.current.filter((tag) => tag !== tagToRemove);
      setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const handleSubmit = async () => {
      await onSubmit(contentRef.current, tagsRef.current);
    };

    return (
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="min-h-24 border rounded-lg p-2">
              <EditorComponent
                contentEditable={true}
                onChange={(changes) => {
                  let new_change = {};
                  new_change[""] = changes;
                  contentRef.current = new_change;
                }}
                content={[]}
              />
            </div>

            <div className="flex gap-2 items-center">
              <Input
                ref={tagInputRef}
                className="max-w-xs"
                placeholder="Add tag..."
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAddTag();
                  }
                }}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddTag}
                className="whitespace-nowrap"
              >
                Add Tag
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="border-t pt-3 mt-2">
              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                onClick={handleSubmit}
                disabled={isPosting}
              >
                {isPosting ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  },
);

export default CreatePost;
