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
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import { useBackendContext } from "../../../contexts/BackendContext";
import { Principal } from "@dfinity/principal";
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton as MuiIconButton } from "@mui/material";
const WorkspaceManager = () => {
  const { workspaces, currentWorkspace } = useSelector(
    (state: any) => state.filesState,
  );
  const { backendActor } = useBackendContext();
  const { profile } = useSelector((state: any) => state.filesState);

  const [anchorEl, setAnchorEl] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

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
      setIsSaving(true);
      try {
        const workspaceToUpdate = workspaces.find((w) => w.id === editingId);
        if (workspaceToUpdate) {
          const updatedWorkspace = {
            ...workspaceToUpdate,
            creator: Principal.fromText(profile.id),
            name: editedName,
          };

          const result = await backendActor.save_work_space(updatedWorkspace);
          if ("Ok" in result) {
            dispatch({ type: "UPDATE_WORKSPACE", workspace: updatedWorkspace });
            setEditingId(null);
            setEditedName("");
          }
        }
      } catch (error) {
        console.error("Failed to rename workspace:", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const [workspaceToDelete, setWorkspaceToDelete] = useState(null);

  const handleDelete = (workspace, e) => {
    e.stopPropagation();
    setWorkspaceToDelete(workspace);
    setShowDeleteDialog(true);
    setAnchorEl(null);
  };

  const confirmDelete = async () => {
    if (!workspaceToDelete) return;
    if (backendActor) {
      try {
        console.log("Deleting workspace:", workspaceToDelete);
        let res = await backendActor.delete_work_space(workspaceToDelete);
        console.log("Deleting res:", res);
        // Update Redux store
        dispatch({ type: "DELETE_WORKSPACE", workspace: workspaceToDelete });

        if (currentWorkspace.id === workspaceToDelete.id && workspaces.length > 0) {
          const newSelectedWorkspace = workspaces[0];
          dispatch({
            type: "CHANGE_CURRENT_WORKSPACE",
            currentWorkspace: newSelectedWorkspace,
          });
        }
        setShowDeleteDialog(false);
      } catch (error) {
        console.error("Failed to delete workspace:", error);
      }
    }
  };

  const handleCreateWorkspace = async (
    e: React.SyntheticEvent,
    newWorkspaceName: string,
  ) => {
    setIsCreating(true);
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
          dispatch({
            type: "CHANGE_CURRENT_WORKSPACE",
            currentWorkspace: newWorkspace,
          });

          // Reset input state
          setShowCreateInput(false);
          handleClose(); // Close the menu after successful creation
        } else {
          console.error("Failed to create workspace:", result.Err);
        }
      } catch (error) {
        console.error("Failed to create workspace:", error);
      } finally {
        setIsCreating(false);
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
                e.stopPropagation();
                if (e.key === "Enter") {
                  handleCreateWorkspace(e, e.target.value);
                }
              }}
            />
            <IconButton
              size="small"
              onClick={(e) => {
                const input =
                  e.currentTarget.parentElement?.querySelector("input");
                if (input) {
                  handleCreateWorkspace(e, input.value);
                }
              }}
              disabled={isCreating}
            >
              {isCreating ? (
                <CircularProgress size={20} />
              ) : (
                <Check fontSize="small" />
              )}
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
            selected={workspace && workspace.id === currentWorkspace.id}
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
                <IconButton 
                  size="small" 
                  onClick={handleSaveRename}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <CircularProgress size={20} />
                  ) : (
                    <Check fontSize="small" />
                  )}
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
                >
                  <IconButton
                    size="small"
                    onClick={(e) => handleRename(workspace, e)}
                  >
                    <Edit2 size={16} />
                  </IconButton>
                  <MuiIconButton
                    size="small"
                    onClick={(e) => handleDelete(workspace, e)}
                    sx={{ p: 0.5 }}
                  >
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  </MuiIconButton>
                </div>
              </>
            )}
          </MenuItem>
        ))}
      </Menu>

      <Dialog
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chat Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              label="Chat Name"
              value={editedChat?.name || chat.name}
              onChange={(e) =>
                setEditedChat((prev) => ({ ...prev, name: e.target.value }))
              }
              fullWidth
              disabled={chat.name === "private_chat"}
            />
            <MembersSelect
              value={editedChat?.members || chat.members}
              onChange={(newMembers) =>
                setEditedChat((prev) => ({ ...prev, members: newMembers }))
              }
              users={all_friends}
            />
            <AdminsSelect
              value={editedChat?.admins || chat.admins}
              onChange={(newAdmins) =>
                setEditedChat((prev) => ({ ...prev, admins: newAdmins }))
              }
              members={editedChat?.members || chat.members}
            />
            <WorkspaceSelect
              value={editedChat?.workspace || chat.workspace}
              onChange={(newWorkspace) =>
                setEditedChat((prev) => ({ ...prev, workspace: newWorkspace }))
              }
              workspaces={workspaces}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsSettingsOpen(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              if (!backendActor || !editedChat) return;
              try {
                const result = await backendActor.update_chat({
                  ...chat,
                  ...editedChat,
                });
                if ("Ok" in result) {
                  // Update local state if needed
                  setIsSettingsOpen(false);
                }
              } catch (error) {
                console.error("Error updating chat:", error);
              }
            }}
            variant="contained"
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setWorkspaceToDelete(null);
        }}
      >
        <DialogTitle>Delete Workspace</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete workspace "{workspaceToDelete?.name}
            "? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowDeleteDialog(false);
              setWorkspaceToDelete(null);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              confirmDelete();
              setShowDeleteDialog(false);
              setWorkspaceToDelete(null);
            }}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WorkspaceManager;
