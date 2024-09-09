import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Box, ButtonGroup, Switch, Tooltip } from "@mui/material";
import { PostUser } from "../../../declarations/backend/backend.did";
import PostTags from "./TagsComponent";
import { useBackendContext } from "../../contexts/BackendContext";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

interface Props {
  setPosts: React.Dispatch<React.SetStateAction<any>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  initPosts: Array<PostUser>;
}

let init_posts = [];

function FilterPosts(props: Props) {
  const { backendActor } = useBackendContext();

  if (props.initPosts.length > init_posts.length) {
    init_posts = props.initPosts;
  }

  const { profile } = useSelector((state: any) => state.filesState);
  const [tags, setTags] = useState<[] | [Array<string>]>([]);
  const [myPostsOnly, setMyPostsOnly] = useState<boolean>(false);

  const viewOnlyMyPosts = async () => {
    const tagsOption: [] | [Array<string>] = tags;
    if (myPostsOnly) {
      props.setPosts(init_posts || []);
      props.setPage(0);
      setMyPostsOnly(false);
      return;
    } else {
      const response =
        backendActor &&
        (await backendActor.get_filtered_posts(tagsOption, [
          profile ? profile.id : "",
        ]));
      // Assuming 'actor.get_filtered_posts' returns the response in the form of 'Vec<PostUser>'
      props.setPosts(response || []);
      props.setPage(0);
      setMyPostsOnly(true);
    }
  };
  // let initial_tags = [
  //     {title: "hiring"}, {title: "seeking"}
  // ];
  const onTagChange = async (options: any) => {
    options && setTags(options);

    if (options && options.length > 0) {
      const response =
        backendActor &&
        (await backendActor.get_filtered_posts(
          [options.map((opt) => opt.title)],
          [],
        ));
      response && props.setPosts(response || []);
      response && props.setPage(0);
    } else {
      props.setPosts(init_posts || []);
      props.setPage(0);
    }
  };
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {/*<ButtonGroup size="small" variant="contained">*/}
        {profile && (
          <Tooltip title="View your posts only">
            <Switch onClick={viewOnlyMyPosts} />
          </Tooltip>
        )}

        <PostTags
          label={"Filter by tags"}
          style={{ backgroundColor: "backgroundColor.paper" }}
          tags={tags}
          setTags={(op) => {
            onTagChange(op);
          }}
        />
      {/*</ButtonGroup>*/}
    </Box>
  );
}

export default FilterPosts;
