import React, { useState, useEffect } from "react";
import { AgCharts } from "ag-charts-react";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Rating,
  Divider,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import Friends from "./friends";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useBackendContext } from "../../contexts/BackendContext";

const ProfilePage = ({ profile, history, friends, friendButton }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { backendActor } = useBackendContext();
  const { isDarkMode } = useSelector((state: any) => state.uiState);
  const currentUser = useSelector((state: any) => state.filesState.profile);

  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    email: "",
  });

  useEffect(() => {
    if (profile) {
      setFormValues({
        name: profile.name,
        description: profile.description || "",
        email: profile.email || "",
      });
    }
  }, [profile]);

  const canEdit = currentUser?.id === profile?.id;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!backendActor) {
      enqueueSnackbar("Backend not initialized", { variant: "error" });
      return;
    }

    try {
      const updateData = {
        name: [formValues.name],
        description: [formValues.description],
      };

      const result = await backendActor.update_profile(updateData);

      if (result.Ok) {
        enqueueSnackbar("Profile updated successfully", { variant: "success" });
        setIsEditing(false);
      } else if (result.Err) {
        enqueueSnackbar(result.Err, { variant: "error" });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      enqueueSnackbar("Failed to update profile", { variant: "error" });
    }
  };
  // Handle completely missing props with default empty objects
  const safeProfile = profile || {};
  const safeHistory = history || {};
  // const safeFriends = friends || [];
  const {
    id = "",
    name = "Anonymous",
    description = "",
    email = "",
    photo = new Uint8Array(),
  } = safeProfile;

  const {
    rates_by_actions = [],
    rates_by_others = [],
    actions_rate = 0,
    users_rate = 0,
  } = safeHistory;

  // Ensure arrays are defined
  const safeRatesByActions = Array.isArray(rates_by_actions)
    ? rates_by_actions
    : [];
  const safeRatesByOthers = Array.isArray(rates_by_others)
    ? rates_by_others
    : [];

  // Convert action ratings to chart data with safe access
  const actionRatingsData = safeRatesByActions.map((rating) => ({
    date: new Date(rating?.date || 0).toLocaleDateString(),
    rating: rating?.rating || 0,
    spent: rating?.spent || 0,
    received: rating?.received || 0,
    promises: rating?.promises || 0,
  }));

  // Calculate statistics with safe calculations
  const totalSpent = safeRatesByActions.reduce(
    (sum, rating) => sum + (rating?.spent || 0),
    0,
  );
  const totalReceived = safeRatesByActions.reduce(
    (sum, rating) => sum + (rating?.received || 0),
    0,
  );
  const averageRating = safeRatesByOthers.length
    ? safeRatesByOthers.reduce(
        (sum, rating) => sum + (rating?.rating || 0),
        0,
      ) / safeRatesByOthers.length
    : 0;

  // AG Charts configuration
  const chartOptions = {
    title: {
      text: "Actions history",
      fontSize: 18,
      color: isDarkMode ? "#ffffff" : "#000000", // Responsive title color
    },
    data: actionRatingsData, // Your data input
    background: {
      fill: isDarkMode ? "#1e1e1e" : "#fefefe", // Dark/light background
    },
    theme: isDarkMode ? "ag-dark" : "ag-default", // Switch AG Charts theme dynamically
    series: [
      {
        type: "line",
        xKey: "date",
        yKey: "rating",
        yName: "Rating",
        stroke: isDarkMode ? "#F44336" : "#D32F2F", // Responsive line color
        marker: {
          enabled: true,
          fill: isDarkMode ? "#F44336" : "#D32F2F", // Marker color
          stroke: isDarkMode ? "#ffffff" : "#000000", // Marker border
        },
        tooltip: { enabled: true },
      },
      {
        type: "line",
        xKey: "date",
        yKey: "spent",
        yName: "Spent",
        stroke: isDarkMode ? "#4FC3F7" : "#0288D1",
        marker: {
          enabled: true,
          fill: isDarkMode ? "#4FC3F7" : "#0288D1",
          stroke: isDarkMode ? "#ffffff" : "#000000",
        },
        tooltip: { enabled: true },
      },
      {
        type: "line",
        xKey: "date",
        yKey: "received",
        yName: "Received",
        stroke: isDarkMode ? "#81C784" : "#388E3C",
        marker: {
          enabled: true,
          fill: isDarkMode ? "#81C784" : "#388E3C",
          stroke: isDarkMode ? "#ffffff" : "#000000",
        },
        tooltip: { enabled: true },
      },
      {
        type: "line",
        xKey: "date",
        yKey: "promises",
        yName: "Promises",
        stroke: isDarkMode ? "#FFD54F" : "#FBC02D",
        marker: {
          enabled: true,
          fill: isDarkMode ? "#FFD54F" : "#FBC02D",
          stroke: isDarkMode ? "#ffffff" : "#000000",
        },
        tooltip: { enabled: true },
      },
    ],
    axes: [
      {
        type: "category",
        position: "bottom",
        line: { color: isDarkMode ? "#aaaaaa" : "#000000" }, // Axes line color
        tick: { color: isDarkMode ? "#aaaaaa" : "#000000" }, // Axes tick color
        label: { color: isDarkMode ? "#ffffff" : "#000000" }, // X-axis label color
      },
      {
        type: "number",
        position: "left",
        line: { color: isDarkMode ? "#aaaaaa" : "#000000" },
        tick: { color: isDarkMode ? "#aaaaaa" : "#000000" },
        label: { color: isDarkMode ? "#ffffff" : "#000000" }, // Y-axis label color
      },
    ],
    legend: {
      position: "bottom",
      item: {
        label: {
          color: isDarkMode ? "#ffffff" : "#000000", // Legend text color
        },
      },
    },
  };

  // Function to safely convert photo to base64
  const getPhotoSrc = (photoData) => {
    try {
      return photoData && Object.keys(photoData).length > 0
        ? `data:image/jpeg;base64,${Buffer.from(photoData).toString("base64")}`
        : "";
    } catch (e) {
      console.error("Error converting photo:", e);
      return "";
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* User Header */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Box display="flex" alignItems="flex-start" gap={3}>
              <Avatar
                src={getPhotoSrc(photo)}
                alt={name}
                sx={{ width: 96, height: 96 }}
              >
                {name?.charAt(0) || "A"}
              </Avatar>
              <Box>
                {isEditing ? (
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={formValues.name}
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
                      rows={2}
                      variant="outlined"
                    />
                  </Stack>
                ) : (
                  <>
                    <Typography variant="h4" gutterBottom>
                      {name || "Anonymous"}
                    </Typography>
                    <Typography variant="h4" gutterBottom>
                      {email || ""}
                    </Typography>
                    <Typography
                      sx={{ fontSize: "0.75rem" }}
                      color="text.secondary"
                    >
                      {id || "No id available"}
                    </Typography>

                    <Typography variant="body1" color="text.secondary">
                      {description || "No description available"}
                    </Typography>
                  </>
                )}
                {friendButton && friendButton}
              </Box>
            </Box>
            {canEdit && (
              <Box>
                {isEditing ? (
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setIsEditing(false);
                        setFormValues({
                          name: profile.name,
                          description: profile.description || "",
                        });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button variant="contained" onClick={handleUpdate}>
                      Save
                    </Button>
                  </Stack>
                ) : (
                  <Button
                    startIcon={<Edit />}
                    onClick={() => setIsEditing(true)}
                    variant="outlined"
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Rating
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Rating value={averageRating} precision={0.1} readOnly />
                <Typography variant="h4">{averageRating.toFixed(2)}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Spent
              </Typography>
              <Typography variant="h4">${totalSpent.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Received
              </Typography>
              <Typography variant="h4">${totalReceived.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ height: 400 }}>
            {actionRatingsData.length > 0 ? (
              <AgCharts options={chartOptions} />
            ) : (
              <Box
                height="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography color="text.secondary">
                  No transaction history available
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Friends Section */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Friends
          </Typography>
          <Friends currentUser={profile} friends={friends} />
        </CardContent>
      </Card>

      {/* Recent Ratings */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Ratings
          </Typography>
          {safeRatesByOthers.length > 0 ? (
            <Box>
              {safeRatesByOthers.slice(0, 5).map((rating, index) => (
                <Box key={rating?.id || index}>
                  <Box py={2}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <Box>
                        <Rating
                          value={rating?.rating || 0}
                          precision={0.1}
                          readOnly
                          size="small"
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          {rating?.comment || "No comment"}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(rating?.date || 0).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                  {index < safeRatesByOthers.length - 1 && <Divider />}
                </Box>
              ))}
            </Box>
          ) : (
            <Box py={2} textAlign="center">
              <Typography color="text.secondary">
                No ratings available
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProfilePage;
