import React, { useState, useCallback } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Divider,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  KeyboardArrowDown as ChevronDown,
  Edit as Edit2,
  AddCircle as PlusCircle,
  Check,
  Close as X
} from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { useBackendContext } from '../../../contexts/BackendContext';
import { Principal } from '@dfinity/principal';
import { getWorkspaceStyles } from './WorkspaceStyles';
import type { Workspace, FilesState } from './WorkspaceTypes';

const WorkspaceManager: React.FC = () => {
  const theme = useTheme();
  const styles = getWorkspaceStyles(theme);
  const dispatch = useDispatch();

  const { workspaces, currentWorkspace, profile } = useSelector(
    (state: { filesState: FilesState }) => state.filesState
  );

  const { backendActor } = useBackendContext();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState<Workspace | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
    setShowCreateInput(false);
    setEditingId(null);
  }, []);

  const handleRename = useCallback((workspace: Workspace, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(workspace.id);
    setEditedName(workspace.name);
  }, []);

  const handleSaveRename = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editedName.trim() && backendActor && editingId) {
      setIsSaving(true);
      try {
        const workspaceToUpdate = workspaces.find((w) => w.id === editingId);
        if (workspaceToUpdate && profile) {
          const updatedWorkspace = {
            ...workspaceToUpdate,
            creator: Principal.fromText(profile.id),
            name: editedName,
          };

          const result = await backendActor.save_work_space(updatedWorkspace);
          if ('Ok' in result) {
            dispatch({ type: 'UPDATE_WORKSPACE', workspace: updatedWorkspace });
            setEditingId(null);
            setEditedName('');
          }
        }
      } catch (error) {
        console.error('Failed to rename workspace:', error);
      } finally {
        setIsSaving(false);
      }
    }
  }, [editedName, backendActor, editingId, workspaces, profile, dispatch]);

  const handleDelete = useCallback((workspace: Workspace, e: React.MouseEvent) => {
    e.stopPropagation();
    setWorkspaceToDelete(workspace);
    setShowDeleteDialog(true);
    setAnchorEl(null);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!workspaceToDelete || !backendActor) return;

    try {
      const res = await backendActor.delete_work_space(workspaceToDelete);
      if ('Ok' in res) {
        dispatch({ type: 'DELETE_WORKSPACE', workspace: workspaceToDelete });

        if (currentWorkspace.id === workspaceToDelete.id && workspaces.length > 0) {
          dispatch({
            type: 'CHANGE_CURRENT_WORKSPACE',
            currentWorkspace: null
          });
        }
      }
    } catch (error) {
      console.error('Failed to delete workspace:', error);
    } finally {
      setShowDeleteDialog(false);
      setWorkspaceToDelete(null);
    }
  }, [workspaceToDelete, backendActor, dispatch, currentWorkspace, workspaces]);

  const handleCreateWorkspace = useCallback(async (
    e: React.SyntheticEvent,
    newWorkspaceName: string,
  ) => {
    e.stopPropagation();
    if (!newWorkspaceName.trim() || !backendActor || !profile) return;

    setIsCreating(true);
    try {
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

      const result = await backendActor.save_work_space(newWorkspace);
      if ('Ok' in result) {
        dispatch({ type: 'ADD_WORKSPACE', workspace: newWorkspace });
        dispatch({
          type: 'CHANGE_CURRENT_WORKSPACE',
          currentWorkspace: newWorkspace,
        });
        setShowCreateInput(false);
        handleClose();
      }
    } catch (error) {
      console.error('Failed to create workspace:', error);
    } finally {
      setIsCreating(false);
    }
  }, [backendActor, profile, dispatch, handleClose]);

  const handleWorkspaceSelect = useCallback((workspace: Workspace) => {
    dispatch({ type: 'CHANGE_CURRENT_WORKSPACE', currentWorkspace: workspace });
    handleClose();
  }, [dispatch, handleClose]);

  return (
    <>
      <Button
        onClick={handleClick}
        endIcon={<ChevronDown />}
        sx={styles.workspaceButton}
      >
        {currentWorkspace?.name}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{ sx: styles.menuPaper }}
      >
        {showCreateInput ? (
          <MenuItem>
            <TextField
              size="small"
              placeholder="New workspace name"
              variant="outlined"
              sx={styles.textField}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget instanceof HTMLInputElement) {
                  handleCreateWorkspace(e, e.currentTarget.value);
                }
              }}
            />
            <div className={styles.actionButtons}>
              <IconButton
                size="small"
                onClick={(e) => {
                  const input = e.currentTarget.parentElement?.parentElement?.querySelector('input');
                  if (input instanceof HTMLInputElement) {
                    handleCreateWorkspace(e, input.value);
                  }
                }}
                disabled={isCreating}
              >
                {isCreating ? <CircularProgress size={20} /> : <Check />}
              </IconButton>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCreateInput(false);
                }}
              >
                <X />
              </IconButton>
            </div>
          </MenuItem>
        ) : (
          <MenuItem
            onClick={(e) => {
              e.preventDefault();
              setShowCreateInput(true);
            }}
          >
            <ListItemIcon>
              <PlusCircle />
            </ListItemIcon>
            <ListItemText>New Workspace</ListItemText>
          </MenuItem>
        )}

        <Divider />

        {[{ id: 'default', name: 'default' }, ...workspaces].map((workspace) => (
          <MenuItem
            key={workspace.id}
            selected={workspace.id === currentWorkspace?.id}
            onClick={() => handleWorkspaceSelect(workspace)}
            sx={styles.menuItem}
          >
            {editingId === workspace.id ? (
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <TextField
                  size="small"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  variant="outlined"
                  sx={styles.textField}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className={styles.actionButtons}>
                  <IconButton
                    size="small"
                    onClick={handleSaveRename}
                    disabled={isSaving}
                  >
                    {isSaving ? <CircularProgress size={20} /> : <Check />}
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(null);
                    }}
                  >
                    <X />
                  </IconButton>
                </div>
              </div>
            ) : (
              <>
                <ListItemText>{workspace.name}</ListItemText>
                {workspace.id !== 'default' && (
                  <div className="workspace-actions" style={styles.workspaceActions}>
                    <IconButton
                      size="small"
                      onClick={(e) => handleRename(workspace, e)}
                    >
                      <Edit2 />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => handleDelete(workspace, e)}
                    >
                      <DeleteIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </div>
                )}
              </>
            )}
          </MenuItem>
        ))}
      </Menu>

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
            Are you sure you want to delete workspace "{workspaceToDelete?.name}"?
            This action cannot be undone.
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
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WorkspaceManager;
