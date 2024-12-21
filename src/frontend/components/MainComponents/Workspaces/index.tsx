// import React, { useState } from "react";
// import { Tooltip } from "@mui/material";
// import { useDispatch, useSelector } from "react-redux";
// import BasicMenu from "../../MuiComponents/BasicMenu";
// import useCreateWorkSpace from "./CreateNewWorkspace";
// import { WorkSpace } from "../../../../declarations/backend/backend.did";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import { useBackendContext } from "../../../contexts/BackendContext";
// import { Principal } from "@dfinity/principal";
// import { randomString } from "../../../DataProcessing/dataSamples";
// import { handleRedux } from "../../../redux/store/handleRedux";
// import LoaderButton from "../../MuiComponents/LoaderButton";
// import ContextMenu from "../../MuiComponents/ContextMenu";
// import RenameWorkspace from "./renameWorkspaces";
// import DeleteWorkspace from "./deleteWorkspace";
//
// interface Props {}
//
// const WorkSpaces = (props: Props) => {
//   const { profile } = useSelector((state: any) => state.filesState);
//
//   const dispatch = useDispatch();
//   const { backendActor } = useBackendContext();
//   const { workspaces } = useSelector((state: any) => state.filesState);
//
//   const createWorkspace = useCreateWorkSpace();
//
//   const [selectedWorkspace, setSelectedWorkspace] = useState("default");
//   const selectWorkSpace = (workspace) => {
//     dispatch(
//       handleRedux("CHANGE_CURRENT_WORKSPACE", { currentWorkspace: workspace }),
//     );
//     setSelectedWorkspace(workspace.name);
//   };
//
//   const contextMenuOptions = (options: WorkSpace) => [
//     {
//       content: <RenameWorkspace {...options} />,
//       pure: true,
//     },
//
//     {
//       pure: true,
//       content: <DeleteWorkspace {...options} />,
//     },
//   ];
//   const options = [
//     createWorkspace,
//     ...workspaces.map((workspace: WorkSpace) => ({
//       preventClose: true,
//       content: (
//         <ContextMenu options={contextMenuOptions(workspace)}>
//           {workspace.name}
//         </ContextMenu>
//       ),
//       onClick: () => selectWorkSpace(workspace),
//     })),
//   ];
//   const handleCreateWorkSpace = async () => {
//     let workspace: WorkSpace = {
//       id: randomString(),
//       files: [],
//       creator: Principal.fromText(profile.id),
//       members: [],
//       chats: [],
//       name: "untitled",
//       admins: [],
//     };
//     let res = await backendActor?.save_work_space(workspace);
//     dispatch(handleRedux("ADD_WORKSPACE", { workspace }));
//     return res;
//   };
//
//   options.push({
//     onClick: () => selectWorkSpace({ name: "Default" }),
//     content: <Tooltip title={"Show all your data"}>Default</Tooltip>,
//   });
//
//   options.push({
//     pure: true,
//     content: (
//       <LoaderButton
//         fullWidth={true}
//         startIcon={
//           <Tooltip title={"create new workspace"}>
//             <AddCircleOutlineIcon />
//           </Tooltip>
//         }
//         onClick={handleCreateWorkSpace}
//       ></LoaderButton>
//     ),
//   });
//   const handleChoseWorkspace = (event: any) => {
//   };
//   return (
//     <BasicMenu
//       anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//       transformOrigin={{ vertical: "top", horizontal: "right" }}
//       options={options}
//     >
//       <Tooltip arrow title="Choose your workspace">
//         <span onClick={handleChoseWorkspace}>{selectedWorkspace}</span>
//       </Tooltip>
//     </BasicMenu>
//   );
// };
//
// export default WorkSpaces;
// ... (previous imports remain the same)
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { PlusCircle, Check, X, Edit2, Trash2, ChevronDown } from 'lucide-react';

const WorkspaceManager = () => {
  const [workspaces, setWorkspaces] = useState([
    { id: 1, name: 'Personal' },
    { id: 2, name: 'Work' },
    { id: 3, name: 'Project A' },
  ]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState(workspaces[0]);
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState(null);
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setShowCreateInput(false);
    setEditingId(null);
  };

  const handleRename = (workspace, e) => {
    e.stopPropagation();
    setEditingId(workspace.id);
    setEditedName(workspace.name);
  };

  const handleSaveRename = (e) => {
    e.stopPropagation();
    if (editedName.trim()) {
      setWorkspaces(workspaces.map(w =>
        w.id === editingId ? { ...w, name: editedName } : w
      ));
      if (selectedWorkspace.id === editingId) {
        setSelectedWorkspace(prev => ({ ...prev, name: editedName }));
      }
    }
    setEditingId(null);
    setEditedName('');
  };

  const handleDelete = (workspace, e) => {
    e.stopPropagation();
    setWorkspaceToDelete(workspace);
    setShowDeleteDialog(true);
    setAnchorEl(null);
  };

  const confirmDelete = () => {
    const newWorkspaces = workspaces.filter(w => w.id !== workspaceToDelete.id);
    setWorkspaces(newWorkspaces);
    if (selectedWorkspace.id === workspaceToDelete.id) {
      setSelectedWorkspace(newWorkspaces[0]);
    }
    setShowDeleteDialog(false);
    setWorkspaceToDelete(null);
  };

  const handleCreateWorkspace = (e) => {
    e.stopPropagation();
    if (newWorkspaceName.trim()) {
      const newWorkspace = {
        id: Math.max(...workspaces.map(w => w.id)) + 1,
        name: newWorkspaceName
      };
      setWorkspaces([...workspaces, newWorkspace]);
      setSelectedWorkspace(newWorkspace);
      setShowCreateInput(false);
      setNewWorkspaceName('');
    }
  };

  const handleWorkspaceSelect = (workspace) => {
    setSelectedWorkspace(workspace);
    handleClose();
  };

  return (
    <>
      <Button
        onClick={handleClick}
        endIcon={<ChevronDown />}
        sx={{
          textTransform: 'none',
          minHeight: 40,
          backgroundColor: 'transparent',
          border: '1px solid rgba(0, 0, 0, 0.23)',
          color: 'inherit',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            border: '1px solid rgba(0, 0, 0, 0.23)',
          }
        }}
      >
        {selectedWorkspace.name}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 320 }
        }}
      >
        {showCreateInput ? (
          <MenuItem>
            <TextField
              size="small"
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              placeholder="New workspace name"
              variant="outlined"
              sx={{ mr: 1, flex: 1 }}
              onClick={(e) => e.stopPropagation()}
            />
            <IconButton size="small" onClick={handleCreateWorkspace}>
              <Check fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setShowCreateInput(false);
              }}
            >
              <X fontSize="small" />
            </IconButton>
          </MenuItem>
        ) : (
          <MenuItem
            onClick={(e) => {
              e.preventDefault();
              setShowCreateInput(true);
            }}
          >
            <ListItemIcon>
              <PlusCircle size={20} />
            </ListItemIcon>
            <ListItemText>New Workspace</ListItemText>
          </MenuItem>
        )}

        <Divider />

        {workspaces.map((workspace) => (
          <MenuItem
            key={workspace.id}
            selected={workspace.id === selectedWorkspace.id}
            onClick={() => handleWorkspaceSelect(workspace)}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              '&:hover .workspace-actions': {
                opacity: 1,
              },
            }}
          >
            {editingId === workspace.id ? (
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <TextField
                  size="small"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  variant="outlined"
                  sx={{ mr: 1, flex: 1 }}
                  onClick={(e) => e.stopPropagation()}
                />
                <IconButton size="small" onClick={handleSaveRename}>
                  <Check fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(null);
                  }}
                >
                  <X fontSize="small" />
                </IconButton>
              </div>
            ) : (
              <>
                <ListItemText>{workspace.name}</ListItemText>
                <div className="workspace-actions" style={{
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <IconButton
                    size="small"
                    onClick={(e) => handleRename(workspace, e)}
                  >
                    <Edit2 size={16} />
                  </IconButton>
                  {workspaces.length > 1 && (
                    <IconButton
                      size="small"
                      onClick={(e) => handleDelete(workspace, e)}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  )}
                </div>
              </>
            )}
          </MenuItem>
        ))}
      </Menu>

      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      >
        <DialogTitle>Delete Workspace</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{workspaceToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WorkspaceManager;
