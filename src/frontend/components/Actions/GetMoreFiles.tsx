import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Tooltip } from "@mui/material";
import { AddBox } from "@mui/icons-material";
import { handleRedux } from "../../redux/store/handleRedux";
import {
  fileContentSample,
  randomString,
} from "../../DataProcessing/dataSamples";
import {ContentNode, FileNode} from "../../../declarations/backend/backend.did";
import { useSnackbar } from "notistack";
import { useBackendContext } from "../../contexts/BackendContext";

const GetMoreFiles: React.FC = () => {
  const { backendActor } = useBackendContext();
  const dispatch = useDispatch();
  const { profile, currentWorkspace } = useSelector(
    (state: any) => state.filesState,
  );

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  let workspaces = [];
  if (currentWorkspace.id) {
    workspaces = [currentWorkspace.id];
  }
  const [page, setPage] = useState(2);
  const handleCreateFile = async () => {
    const res = await backendActor?.get_more_files(page);
    console.log(res[0]);
    let files = res[0];
    let contents: Array<[string, Array<ContentNode>]> = res[1];
    dispatch(handleRedux("ADD_FILES_LIST", { files }));
    dispatch(handleRedux("ADD_CONTENTS_LIST", { contents }));
    setPage(page + 1);
  };

  return (
    <Tooltip title="Load more files" arrow>
      <Button onClick={handleCreateFile}>More files</Button>
    </Tooltip>
  );
};

export default GetMoreFiles;
