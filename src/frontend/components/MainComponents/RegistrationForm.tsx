import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Add, PhotoCamera } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { convertToBytes } from "../../DataProcessing/imageToVec";
import { useBackendContext } from "../../contexts/BackendContext";
import { RegisterUser, User } from "../../../declarations/backend/backend.did";
import { handleRedux } from "../../redux/store/handleRedux";

interface FormValues {
  username: string;
  bio: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

const RegistrationForm: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { isLoggedIn, isRegistered } = useSelector(
    (state: any) => state.uiState,
  );

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { backendActor } = useBackendContext();

  const [formValues, setFormValues] = useState<FormValues>({
    username: "",
    bio: "",
    first_name: "",
    last_name: "",
    email: "",
  });

  const [showForm, setShowForm] = useState(isLoggedIn && !isRegistered);

  useEffect(() => {
    setShowForm(isLoggedIn && !isRegistered);
  }, [isLoggedIn, isRegistered]);

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoByte, setPhotoByte] = useState<Uint8Array | number[] | undefined>(
    null,
  );
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormValues((prevValues) => ({ ...prevValues, [id]: value }));
  };

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files?.[0];
    if (image) {
      try {
        setLoading(true);
        const imageByteData = await convertToBytes(image);
        setPhoto(image);
        setPhotoByte(imageByteData);
      } catch (error) {
        enqueueSnackbar(error.message, { variant: "error" });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRegister = async () => {
    if (!formValues.username || !formValues.bio) {
      enqueueSnackbar("Please fill all required fields", { variant: "error" });
      return;
    }

    const loaderMessage = (
      <span>
        Creating account...{" "}
        <CircularProgress size={20} style={{ marginLeft: 10 }} />
      </span>
    );
    const loadingSnackbar = enqueueSnackbar(loaderMessage, { variant: "info" });

    const input: RegisterUser = {
      name: [formValues.username],
      description: [formValues.bio],
      photo: photoByte ? [photoByte] : [[]],
    };

    try {
      if (!backendActor) {
        throw new Error("Backend actor not initialized");
      }

      const register = await backendActor.register(input);
      closeSnackbar(loadingSnackbar);

      if (register?.Ok) {
        dispatch(handleRedux("UPDATE_PROFILE", { profile: register.Ok }));
        enqueueSnackbar(`Welcome ${register.Ok.name}, to Odoc`, {
          variant: "success",
        });
        // Force a complete app refresh
        window.location.href = window.location.origin;
      } else if (register?.Err) {
        enqueueSnackbar(register.Err, { variant: "error" });
        setOpen(true);
      }
    } catch (error) {
      console.error("There was an issue with registration: ", error);
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  if (!showForm) return null;

  return (
    <Container maxWidth="sm" sx={{ 
      position: 'relative',
      zIndex: 1400,
      mt: '80px' // Add space below the top nav bar
    }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Welcome to Odoc
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" sx={{ mb: 4 }}>
          Complete your profile to get started
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 4,
          }}
        >
          <input
            accept="image/*"
            id="photo"
            type="file"
            style={{ display: "none" }}
            onChange={handleUploadPhoto}
          />
          <label htmlFor="photo">
            <IconButton 
              component="span"
              sx={{
                position: 'relative',
                '&:hover': {
                  '& .MuiAvatar-root': {
                    opacity: 0.8,
                  },
                  '& .upload-icon': {
                    opacity: 1,
                  },
                },
              }}
            >
              <Avatar
                src={photo ? URL.createObjectURL(photo) : undefined}
                alt="Profile Photo"
                sx={{
                  width: 120,
                  height: 120,
                  transition: 'opacity 0.3s',
                  border: `4px solid ${theme.palette.primary.main}`,
                }}
              >
                {!photo && <Add />}
              </Avatar>
              <PhotoCamera 
                className="upload-icon"
                sx={{
                  position: 'absolute',
                  opacity: 0,
                  transition: 'opacity 0.3s',
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  borderRadius: '50%',
                  padding: 1,
                }}
              />
            </IconButton>
          </label>
          {loading && <CircularProgress size={24} sx={{ mt: 2 }} />}
        </Box>

        <Stack spacing={3}>
          <TextField
            required
            id="username"
            label="Username"
            fullWidth
            variant="outlined"
            value={formValues.username}
            onChange={handleChange}
          />

          <Stack direction="row" spacing={2}>
            <TextField
              id="first_name"
              label="First Name"
              fullWidth
              variant="outlined"
              value={formValues.first_name || ""}
              onChange={handleChange}
            />
            <TextField
              id="last_name"
              label="Last Name"
              fullWidth
              variant="outlined"
              value={formValues.last_name || ""}
              onChange={handleChange}
            />
          </Stack>

          <TextField
            id="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={formValues.email || ""}
            onChange={handleChange}
          />

          <TextField
            required
            multiline
            rows={4}
            id="bio"
            label="Bio"
            fullWidth
            variant="outlined"
            value={formValues.bio}
            onChange={handleChange}
            helperText="Tell us a bit about yourself"
          />

          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setShowForm(false)}
              sx={{ py: 1.5 }}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={handleRegister}
              sx={{ py: 1.5 }}
            >
              Complete Registration
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
};

export default RegistrationForm;
