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

  const handleCreateFile = async () => {
    const id = randomString();
    const newFile: FileNode = {
      id,
      name: "Untitled",
      parent: [],
      children: [],
      share_id: [],
      author: profile.id,
      users_permissions: [],
      permission: { None: null },
      content_id: [],
      workspaces: [currentWorkspace.id],
    };

    dispatch(handleRedux("ADD_FILE", { new_file: newFile }));
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
