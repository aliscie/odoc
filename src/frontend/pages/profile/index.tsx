import React, { useEffect, useState } from "react";
import { AgCharts } from "ag-charts-react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import Friends from "./friends";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useBackendContext } from "../../contexts/BackendContext";
import { RegisterUser } from "../../../declarations/backend/backend.did";
import UserAvatarMenu from "../../components/MainComponents/UserAvatarMenu";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { formatRelativeTime } from "../../utils/time";
import EditProfile from "./editeProfile";

const CopyButton = ({ title, value }) => {
  const [showCheck, setShowCheck] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setShowCheck(true);
      setTimeout(() => setShowCheck(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Button
      variant="contained"
      onClick={handleCopy}
      startIcon={
        showCheck ? (
          <CheckCircleIcon
            sx={{
              color: "#4CAF50",
              animation: "popIn 0.3s ease-in-out",
              "@keyframes popIn": {
                "0%": {
                  transform: "scale(0)",
                },
                "50%": {
                  transform: "scale(1.2)",
                },
                "100%": {
                  transform: "scale(1)",
                },
              },
            }}
          />
        ) : (
          <ContentCopyIcon />
        )
      }
      sx={{
        bgcolor: showCheck ? "#E8F5E9" : "primary.main",
        color: showCheck ? "#2E7D32" : "white",
        "&:hover": {
          bgcolor: showCheck ? "#E8F5E9" : "primary.dark",
        },
        transition: "all 0.3s ease",
      }}
    >
      {showCheck ? "Copied!" : title}
    </Button>
  );
};

const ProfilePage = ({ profile, history, friends, friendButton }) => {
  const { isDarkMode } = useSelector((state: any) => state.uiState);
  const currentUser = useSelector((state: any) => state.filesState.profile);

  const [isEditing, setIsEditing] = useState(false);

  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    email: "",
  });

  // useEffect(() => {
  //   if (profile) {
  //     setFormValues({
  //       name: profile.name,
  //       description: profile.description || "",
  //       email: profile.email || "",
  //     });
  //   }
  // }, [profile]);

  const canEdit = currentUser?.id === profile?.id;

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = event.target;
  //   setFormValues((prev) => ({ ...prev, [name]: value }));
  // };

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
  const totalSpent = rates_by_actions[rates_by_actions.length - 1]?.spent;
  const totalReceived = rates_by_actions[rates_by_actions.length - 1]?.received;
  // const averageRating = rates_by_actions[rates_by_actions.length - 1]?.rating;

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
              <UserAvatarMenu
                hide={["Profile"]}
                sx={{ width: 96, height: 96 }}
                user={profile}
              />

              <Box>
                {isEditing ? (
                  <EditProfile
                    setIsEditing={setIsEditing}
                    profile={safeProfile}
                    onCancel={() => setIsEditing(false)}
                  />
                ) : (
                  <>
                    <Typography variant="h4" gutterBottom>
                      {name}
                    </Typography>
                    <Typography variant="h4" gutterBottom>
                      {email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {id}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {description}
                    </Typography>
                    {friendButton}
                    <CopyButton
                      title="Copy Profile Link"
                      value={`${window.location.href}/user?id=${profile?.id}`}
                    />
                  </>
                )}
              </Box>
            </Box>
            {canEdit && !isEditing && (
              <Button
                startIcon={<Edit />}
                onClick={() => setIsEditing(true)}
                variant="outlined"
                // sx={{
                //   borderColor: theme.palette.divider,
                //   "&:hover": {
                //     borderColor: theme.palette.primary.main,
                //   },
                // }}
              >
                Edit Profile
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Trust score
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Rating value={actions_rate} precision={0.1} readOnly />
                <Typography variant="h4">{actions_rate}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total rate score
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Rating value={users_rate} precision={0.1} readOnly />
                <Typography variant="h4">{users_rate}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Spent
              </Typography>
              <Typography variant="h4">${Number(totalSpent)}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Received
              </Typography>
              <Typography variant="h4">${totalReceived?.toFixed(2)}</Typography>
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
      {friends.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Friends
            </Typography>
            <Friends currentUser={profile} friends={friends} />
          </CardContent>
        </Card>
      )}

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
                        {formatRelativeTime(rating?.date)}
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
