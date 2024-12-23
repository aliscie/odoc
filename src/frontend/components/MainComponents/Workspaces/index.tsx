import React, { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Check, ChevronDown, Edit2, PlusCircle, Trash2, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useBackendContext } from "../../../contexts/BackendContext";
import { Principal } from "@dfinity/principal";

const WorkspaceManager = () => {
  const { workspaces, currentWorkspace } = useSelector((state: any) => state.filesState);
  const { backendActor } = useBackendContext();
  const { profile } = useSelector((state: any) => state.filesState);

  const [anchorEl, setAnchorEl] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCreateInput, setShowCreateInput] = useState(false);

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

  const handleSaveRename = async (e) => {
    e.stopPropagation();
    if (editedName.trim() && backendActor) {
      const workspace = workspaces.find((w) => w.id === editingId);
      if (workspace) {
        const updatedWorkspace = {
          ...workspace,
          creator: Principal.fromText(profile.id),
          name: editedName,
        };

        try {
          await backendActor.save_work_space(updatedWorkspace);
          setEditingId(null);
          setEditedName("");
        } catch (error) {
          console.error("Failed to rename workspace:", error);
        }
      }
    }
  };

  const handleDelete = (workspace, e) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
    setAnchorEl(null);
  };

  const confirmDelete = async (workspaceToDelete) => {
    if (backendActor && workspaceToDelete) {
      try {
        await backendActor.delete_work_space(workspaceToDelete.id);
        // Update Redux store
        dispatch({ type: "DELETE_WORKSPACE", workspace: workspaceToDelete });
        
        if (
          currentWorkspace.id === workspaceToDelete.id &&
          workspaces.length > 0
        ) {
          const newSelectedWorkspace = workspaces[0];
          dispatch({ type: "CHANGE_CURRENT_WORKSPACE", currentWorkspace: newSelectedWorkspace });
        }
        setShowDeleteDialog(false);
      } catch (error) {
        console.error("Failed to delete workspace:", error);
      }
    }
  };

  const handleCreateWorkspace = async (e, newWorkspaceName) => {
    e.stopPropagation();
    if (newWorkspaceName.trim() && backendActor && profile) {
      const creator = Principal.fromText(profile.id);
      const newWorkspace = {
        id: crypto.randomUUID(),
        name: newWorkspaceName,
        files: [],
        creator,
        members: [creator],
        chats: [],
        admins: [creator],
      };

      try {
        const result = await backendActor.save_work_space(newWorkspace);
        if ("Ok" in result) {
          // Update Redux store
          dispatch({ type: "ADD_WORKSPACE", workspace: newWorkspace });
          
          // Set the newly created workspace as selected
          dispatch({ type: "CHANGE_CURRENT_WORKSPACE", currentWorkspace: newWorkspace });
          
          // Reset input state
          setShowCreateInput(false);
          handleClose(); // Close the menu after successful creation
        } else {
          console.error("Failed to create workspace:", result.Err);
        }
      } catch (error) {
        console.error("Failed to create workspace:", error);
      }
    }
  };

  const dispatch = useDispatch();

  const handleWorkspaceSelect = (workspace) => {
    dispatch({ type: "CHANGE_CURRENT_WORKSPACE", currentWorkspace: workspace });
    handleClose();
  };

  return (
    <>
      <Button
        onClick={handleClick}
        endIcon={<ChevronDown />}
        sx={{
          textTransform: "none",
          minHeight: 40,
          backgroundColor: "transparent",
          border: "1px solid rgba(0, 0, 0, 0.23)",
          color: "inherit",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
            border: "1px solid rgba(0, 0, 0, 0.23)",
          },
        }}
      >
        {currentWorkspace && currentWorkspace.name}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 320 },
        }}
      >
        {showCreateInput ? (
          <MenuItem>
            <TextField
              size="small"
              placeholder="New workspace name"
              variant="outlined"
              sx={{ mr: 1, flex: 1 }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateWorkspace(e, e.target.value);
                }
              }}
            />
            <IconButton 
              size="small" 
              onClick={(e) => handleCreateWorkspace(e, e.target.previousSibling.value)}
            >
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
            selected={
              workspace &&
              workspace.id === currentWorkspace.id
            }
            onClick={() => handleWorkspaceSelect(workspace)}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              "&:hover .workspace-actions": {
                opacity: 1,
              },
            }}
          >
            {editingId === workspace.id ? (
              <div
                style={{ display: "flex", alignItems: "center", width: "100%" }}
              >
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
                <div
                  className="workspace-actions"
                  style={{
                    opacity: 0,
                    transition: "opacity 0.2s",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
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
            Are you sure you want to delete "{workspaceToDelete?.name}"? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WorkspaceManager;
