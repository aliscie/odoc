import MultiAutoComplete from "../../components/MuiComponents/MultiAutocompelte";
import React from "react";
import { PostUser } from "../../../declarations/backend/backend.did";
import { debounce } from "lodash";
import { Typography, Box, TextField, Chip } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { logger } from "../../DevUtils/logData";

interface Props {
  readOnly: boolean;
  onChange: any;
  setTags: any;
  tags: [];
  post: PostUser;
  style?: any;
}

function PostTags(props: Props) {
  let init = [{ title: "hiring" }, { title: "seeking" }];
  const [tags_options, setTagsOptions] = React.useState(init);

  const [tags, setTags] = React.useState(
    props.post
      ? props.post.tags.map((tag) => {
          return { title: tag };
        })
      : [],
  );

  function handleChange(event: any, options: any) {
    let is_title_in = tags_options.some((item) =>
      item.title.includes(event.target.value),
    );
    let is_text = typeof event.target.value === "string";

    if (!is_title_in && is_text) {
      setTagsOptions((pre) => {
        return [{ title: String(event.target.value) }, ...pre];
      });
    } else if (options) {
      setTags(options);
    } else {
      setTagsOptions(init);
    }
  }

  const debouncedHandleChange = React.useMemo(
    () => debounce(handleChange, 300),
    [],
  );
  if (props.readOnly && tags.length === 0) {
    return null;
  }
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: "background.paper",
        boxShadow: 3,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Autocomplete
        disabled={props.readOnly}
        onChange={(e, value) => props.setTags(value)}
        onKeyDown={debouncedHandleChange}
        multiple
        limitTags={2}
        id="multiple-limit-tags"
        options={tags_options}
        getOptionLabel={(option) => option.title}
        defaultValue={tags}
        renderInput={(params) => (
          <TextField
            {...params}
            label={props.label}
            // placeholder="Favorites"
          />
        )}
        // sx={{ width: "250px" }}
      />
    </Box>
  );
}

export default PostTags;
