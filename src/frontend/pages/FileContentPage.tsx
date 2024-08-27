import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";

import { Input } from "@mui/material";
import { handleRedux } from "../redux/store/handleRedux";
import EditorComponent from "../components/EditorComponent";

interface Props {}

const FileContentPage: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const { current_file, files_content, profile, files } = useSelector(
    (state: any) => state.filesState,
  );

  const [title, setTitle] = React.useState(
    (current_file && current_file.name) || "Untitled",
  );

  const editorKey = (current_file && current_file.id) || "";
  const onChange = useCallback(
    debounce((changes: any) => {
      if (current_file) {
        dispatch(
          handleRedux("UPDATE_CONTENT", {
            id: current_file.id,
            content: changes,
          }),
        );
      }
    }, 250),
    [dispatch, current_file],
  );

  const handleInputChange = useCallback(
    debounce((title: string) => {
      if (title !== current_file.name) {
        dispatch(
          handleRedux("UPDATE_FILE_TITLE", { id: current_file.id, title }),
        );
      }
    }, 250),
    [dispatch, current_file],
  );

  const handleTitleKeyDown = useCallback(
    (title: string) => {
      handleInputChange(title);
      setTitle(title);
    },
    [handleInputChange],
  );

  const preventEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      (e.target as HTMLElement).blur();
    }
  };

  if (!current_file) {
    return <span>404 Not Found</span>;
  }

  const editable =
    current_file.author === profile.id ||
    Object.keys(current_file.permission)[0] === "CanUpdate" ||
    current_file.users_permissions.some(
      ([userId, permissions]) => userId === profile.id && permissions.CanUpdate,
    );
  console.log({ files_content });
  return (
    <div style={{ marginTop: "3px", marginLeft: "10%", marginRight: "10%" }}>
      <Input
        key={current_file.id + title}
        inputProps={{
          style: {
            width: "100%",
            fontSize: "1.5rem",
            overflow: "visible",
            whiteSpace: "nowrap",
          },
        }}
        defaultValue={title}
        // value={current_file.name}
        placeholder="Untitled"
        onKeyDown={preventEnter}
        onChange={(e) => handleTitleKeyDown(e.target.value)}
      />
      <EditorComponent
        id={current_file.id}
        contentEditable={editable}
        onChange={onChange}
        editorKey={editorKey}
        content={files_content[current_file.id]}
      />
    </div>
  );
};

export default FileContentPage;
