import React from "react";
import { Box } from "@mui/material";
import CreatePost from "./createPost";
import ViewPostComponent from "./viewPost";
import LoadMorePosts from "./LoadMorePosts";

interface PostsProps {
  posts: any[];
  isLoggedIn: boolean;
  searchValue: string;
}

const Posts: React.FC<PostsProps> = ({ posts, isLoggedIn, searchValue }) => {
  const filterPosts = React.useMemo(() => {
    const searchLower = searchValue.toLowerCase();
    return posts.filter((post) => {
      const contentTreeText = post?.content_tree
        .map((node) => node.text?.toLowerCase() || "")
        .join(" ");
      return (
        contentTreeText.includes(searchLower) ||
        post.creator?.name?.toLowerCase().includes(searchLower)
      );
    });
  }, [posts, searchValue]);

  return (
    <>
      {isLoggedIn && <CreatePost />}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }} />
      </Box>
      {filterPosts
        .filter((post) => !post.is_comment)
        .map((post) => (
          <ViewPostComponent
            posts={posts}
            key={post.id}
            post={post}
          />
        ))}
      <LoadMorePosts />
    </>
  );
};

export default Posts;