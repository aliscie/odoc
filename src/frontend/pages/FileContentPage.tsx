import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import { CircularProgress, Input, styled } from "@mui/material";
import { handleRedux } from "../redux/store/handleRedux";
import EditorComponent from "../components/EditorComponent";

const ExpandingInput = styled(Input)`
  & input {
    width: 100%;
    font-size: 1.5rem;
    min-width: 0;
    padding: 4px 8px;
    transition: all 0.2s ease;

    &:hover,
    &:focus {
      background: rgba(0, 0, 0, 0.02);
    }
  }
`;
const FileContentPage = () => {
  const { isLoggedIn } = useSelector((state: any) => state.uiState);
  let fileId = window.location.pathname.split("/")[1];
  const dispatch = useDispatch();
  const { inited, files_content, profile, files } = useSelector(
    (state: any) => state.filesState,
  );

  let current_file = files.find((file: any) => file.id === fileId);

  const editorKey = (current_file && current_file.id) || "";

  const onChange = debounce((changes: any) => {
    const prevContent = JSON.stringify(files_content[current_file.id]);
    const newContent = JSON.stringify(changes);
    if (current_file && prevContent !== newContent) {
      dispatch(
        handleRedux("UPDATE_CONTENT", {
          id: current_file.id,
          content: changes,
        }),
      );
    }
  }, 250);

  const handleDispatchChange = useCallback(
    debounce((title: string) => {
      if (title !== current_file.name) {
        dispatch(
          handleRedux("UPDATE_FILE_TITLE", { id: current_file.id, title }),
        );
      }
    }, 250),
    [dispatch, current_file],
  );

  const handleInputChange = (title) => {
    handleDispatchChange(title);
  };

  // useEffect(() => {
  //   if (current_file) {
  //     setInitialContent(files_content[current_file.id]);
  //   }
  // }, [current_file, files_content]);

  if (inited && files.length == 0) {
    return <span>404 Not Found</span>;
  }
  if (files.length == 0 && isLoggedIn) {
    return <CircularProgress />;
  }
  if (!current_file) {
    return <span>404 Not Found</span>;
  }

  const editable =
    current_file.author === profile.id ||
    Object.keys(current_file.permission)[0] === "CanUpdate" ||
    current_file.users_permissions.some(
      ([userId, permissions]) => userId === profile.id && permissions.CanUpdate,
    );

  const isAuthoer = current_file.author === profile.id;
  return (
    <div style={{ marginTop: "3px", marginLeft: "10%", marginRight: "10%" }}>
      <ExpandingInput
        key={current_file.id}
        fullWidth
        multiline
        rows={1}
        sx={{
          minWidth: "200px",
          maxWidth: "100%",
        }}
        inputProps={{
          style: {
            fontSize: "1.5rem",
            lineHeight: "1.5",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
          },
        }}
        disabled={!isAuthoer}
        defaultValue={current_file.name}
        placeholder="Untitled"
        onChange={(e) => handleInputChange(e.target.value)}
      />
      <EditorComponent
        readOnly={!isAuthoer}
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
