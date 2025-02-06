import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Tooltip, Box } from "@mui/material";
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
  const { profile, currentWorkspace, files } = useSelector(
    (state: any) => state.filesState
  );

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

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
      workspaces: currentWorkspace.id ? [currentWorkspace.id] : [],
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
  let title= "Create a new document";
  if (files.length === 0) {
    title = "Create your first document";
  }
  return (
    <Box sx={{ maxWidth: '200px' }}>
      <Tooltip title={title} arrow>
        <Button
          onClick={handleCreateFile}
          sx={{
            minWidth: '120px',
            maxWidth: '200px',
            animation: files.length === 0 ? 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both infinite' : 'none',
            '@keyframes shake': {
              '10%, 90%': {
                transform: 'translate3d(-1px, 0, 0)',
              },
              '20%, 80%': {
                transform: 'translate3d(2px, 0, 0)',
              },
              '30%, 50%, 70%': {
                transform: 'translate3d(-4px, 0, 0)',
              },
              '40%, 60%': {
                transform: 'translate3d(4px, 0, 0)',
              },
            },
            ...(files.length === 0 && {
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '0.8rem',
              fontWeight: 500,
              textTransform: 'none',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'primary.dark',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                transform: 'translateY(-1px)',
              }
            })
          }}
        >
          <AddBox sx={{
            mr: files.length === 0 ? 1 : 0,
            fontSize: files.length === 0 ? '20px' : '18px'
          }} />
          {files.length === 0 && 'Create Document'}
        </Button>
      </Tooltip>
    </Box>
  );
};

export default CreateFile;
