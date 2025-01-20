import React, { useState, useEffect } from "react";
import { Stack, TextField, Button, Box, useTheme } from "@mui/material";
import { useSnackbar } from "notistack";
import { useBackendContext } from "../../contexts/BackendContext";
import { RegisterUser } from "../../../declarations/backend/backend.did";
import {handleRedux} from "../../redux/store/handleRedux";
import {useDispatch} from "react-redux";

const EditProfile = ({ setIsEditing, profile, onCancel = false }) => {
  const dispatch = useDispatch();
  const [isUpdating, setIsUpdating] = useState(false);
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { backendActor } = useBackendContext();

  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    email: "",
  });

  useEffect(() => {
    if (profile) {
      setFormValues({
        name: profile.name || "",
        description: profile.description || "",
        email: profile.email || "",
      });
    }
  }, [profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!backendActor) {
      enqueueSnackbar("Backend not initialized", { variant: "error" });
      return;
    }

    try {
      const updateData: RegisterUser = {
        name: [formValues.name],
        description: [formValues.description],
        email: [formValues.email],
        photo: [],
      };
      setIsUpdating(true);
      const result = await backendActor?.update_user_profile(updateData);

      if (result.Ok) {
        enqueueSnackbar("Profile updated successfully", { variant: "success" });
        dispatch(handleRedux("UPDATE_PROFILE", { profile: result.Ok }));
        setIsUpdating(false);
        setIsEditing(false);
      } else if (result.Err) {
        enqueueSnackbar(result.Err, { variant: "error" });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      enqueueSnackbar("Failed to update profile", { variant: "error" });
    }
  };

  return (
    <Stack
      spacing={2}
      sx={{
        width: "100%",
        bgcolor: theme.palette.background.paper,
        p: 2,
        borderRadius: 1,
      }}
    >
      <TextField
        fullWidth
        label="Name"
        name="name"
        value={formValues.name}
        onChange={handleChange}
        variant="outlined"
        required
      />
      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={formValues.email}
        onChange={handleChange}
        variant="outlined"
      />
      <TextField
        fullWidth
        label="Bio"
        name="description"
        value={formValues.description}
        onChange={handleChange}
        multiline
        rows={4}
        variant="outlined"
      />
      <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          sx={{ color: theme.palette.text.primary }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isUpdating}
          sx={{
            bgcolor: theme.palette.primary.main,
            "&:hover": {
              bgcolor: theme.palette.primary.dark,
            },
          }}
        >
          {isUpdating ? "Saving..." : "Save"}
        </Button>
      </Box>
    </Stack>
  );
};

export default EditProfile;
