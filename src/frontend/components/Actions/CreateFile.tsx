import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Tooltip } from "@mui/material";
import { AddBox } from "@mui/icons-material";
import { handleRedux } from "../../redux/store/handleRedux";
import {
  fileContentSample,
  randomString,
} from "../../DataProcessing/dataSamples";
import { FileNode } from "../../../declarations/backend/backend.did";
import { useSnackbar } from "notistack";

const CreateFile: React.FC = () => {
  const dispatch = useDispatch();
  const { profile, currentWorkspace } = useSelector(
    (state: any) => state.filesState,
  );

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  let workspaces = [];
  if (currentWorkspace.id) {
    workspaces = [currentWorkspace.id];
  }
  const handleCreateFile = async () => {
    const id = randomString();
    const new_file: FileNode = {
      id,
      permission: {
        None: null,
      },
      content_id: [],
      share_id: [],
      name: "Untitled",
      workspaces: [],
      children: [],
      author: profile.id,
      users_permissions: [],
      parent: [],
    };

    dispatch(handleRedux("ADD_FILE", { new_file }));
    dispatch(handleRedux("ADD_CONTENT", { id, content: fileContentSample }));
    closeSnackbar();
    enqueueSnackbar("New file is created!", { variant: "success" });
  };

  return (
    <Tooltip title="Create a new document" arrow>
      <Button onClick={handleCreateFile}>
        <AddBox />
      </Button>
    </Tooltip>
  );
};

export default CreateFile;
