import { Post, PostUser } from "../../../declarations/backend/backend.did";

export interface ICommentFormProps {
  postId: string;
  onCommentSubmit: () => void;
  onCancel?: () => void;
}

export interface ICommentProps {
  post: PostUser;
  allPosts: PostUser[];
  onUpdate: () => void;
}
