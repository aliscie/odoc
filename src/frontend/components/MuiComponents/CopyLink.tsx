import React, { useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  TextField,
  Autocomplete,
  CircularProgress,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useDispatch, useSelector } from "react-redux";
import { Principal } from "@dfinity/principal";
import { useBackendContext } from "../../contexts/BackendContext";
import { useSnackbar } from "notistack";
import { Check, Copy } from "lucide-react";

const CopyButton = ({ onClick }) => {
  const [showCheck, setShowCheck] = useState(false);

  const handleClick = async () => {
    await onClick();
    setShowCheck(true);
    setTimeout(() => {
      setShowCheck(false);
    }, 3000);
  };

  return (
    <IconButton
      onClick={handleClick}
      size="small"
      className="hover:bg-gray-100 transition-colors duration-200"
    >
      {showCheck ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </IconButton>
  );
};

type ShareFilePermission =
  | { CanComment: null }
  | { None: null }
  | { CanView: null }
  | { CanUpdate: null };

interface ShareOption {
  label: string;
  value: ShareFilePermission;
  principalId?: string;
}

const ShareFileButton = () => {
  const { contracts, profile, all_friends, current_file } = useSelector(
    (state: any) => state.filesState,
  );
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPermission, setSelectedPermission] =
    useState<ShareOption | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [userPermissions, setUserPermissions] = useState<
    [Principal, ShareFilePermission][]
  >([]);

  const { backendActor } = useBackendContext();

  const generateShareOptions = (): ShareOption[] => {
    const baseOptions = [
      {
        label: "Everyone can view",
        value: { CanView: null } as ShareFilePermission,
      },
      {
        label: "Everyone can update",
        value: { CanUpdate: null } as ShareFilePermission,
      },
    ];

    const friendOptions =
      all_friends
        ?.map((friend) => [
          {
            label: `${friend.name} can view`,
            value: { CanView: null } as ShareFilePermission,
            principalId: Principal.fromText(friend.id),
          },
          {
            label: `${friend.name} can update`,
            value: { CanUpdate: null } as ShareFilePermission,
            principalId: Principal.fromText(friend.id),
          },
        ])
        .flat() || [];

    return [...baseOptions, ...friendOptions];
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/share/?id=${current_file?.share_id[0]}`,
      );
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handlePermissionChange = (event: any, newValue: ShareOption | null) => {
    setSelectedPermission(newValue);
    if (newValue?.principalId) {
      // Convert the string principal ID to a Principal type
      const principalId = Principal.fromText(newValue.principalId);

      // Remove any existing permission for this principal
      const filteredPermissions = userPermissions.filter(
        ([principal]) => principal.toString() !== principalId.toString(),
      );

      // Add the new permission
      setUserPermissions([
        ...filteredPermissions,
        [principalId, newValue.value],
      ]);
    }
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!current_file || !profile?.id) return;

    setIsLoading(true);
    try {
      const shareFileInput = {
        id: current_file.id,
        owner: Principal.fromText(profile.id),
        permission: selectedPermission?.value || { CanView: null },
        users_permissions: userPermissions,
      };

      let res = await backendActor.share_file(shareFileInput);
      if (res.Err) {
        enqueueSnackbar(
          res.Err + " Click on the save button first then try again.",
          { variant: "error" },
        );
        return;
      }
      dispatch({
        type: "CURRENT_FILE",
        file: { ...current_file, share_id: [res.Ok.id] },
      });
      setHasChanges(false);
      handleClose();
    } catch (error) {
      console.error("Error sharing file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!current_file) {
    return null;
  }
  console.log({
    current_file,
    x: `${window.location.origin}/share/?id=${current_file?.share_id[0]}`,
  });
  return (
    <div>
      <IconButton
        variant="contained"
        color="primary"
        onClick={handleClick}
        disabled={!current_file}
      >
        <ShareIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <Box sx={{ p: 2, minWidth: 300 }}>
          <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
            <Typography fullWidth size="small">
              {`${window.location.origin}/share/?id=${current_file?.share_id[0]}`}
            </Typography>
            <CopyButton onClick={handleCopyLink} />
          </Box>
          {current_file?.author === profile?.id && (
            <Box sx={{ mb: 2 }}>
              <Autocomplete
                options={generateShareOptions()}
                value={selectedPermission}
                onChange={handlePermissionChange}
                renderInput={(params) => (
                  <TextField {...params} label="Set permissions" size="small" />
                )}
              />
            </Box>
          )}

          {hasChanges && (
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Save Changes"}
            </Button>
          )}
        </Box>
      </Menu>
    </div>
  );
};

export default ShareFileButton;
