import React, { useState } from "react";
import {
  Box,
  Container,
  Tabs,
  Tab,
  useTheme,
  Avatar,
  Typography,
  Paper,
  Grid,
  Rating,
  useMediaQuery,
} from "@mui/material";
import {
  CalendarMonth as CalendarMonthIcon,
  Today as TodayIcon,
  Inbox as InboxIcon,
  FolderSpecial as ProjectsIcon,
  Groups as TeamsIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import AddchartIcon from "@mui/icons-material/Addchart";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import TodayView from "./todayView";
import BoardView from "./boardView";
import CalendarView from "./calindarView";
import SubmissionsView from "./submitionsView";
import ProjectsView from "./projectsView";
import TeamsView from "./teamsView";
import MetricsView from "./metrices";
import DemoBanner from "./banner";

const STORAGE_KEY = 'dashboardActiveTab';

const USER_DATA = {
  name: "John Doe",
  avatar: "JD",
  role: "Senior Project Manager",
  description: "Experienced project manager with expertise in agile methodologies",
  trustScore: 95,
  balance: 15000,
  debt: 2000,
  received: 45000,
  spent: 32000,
  rating: 4.8,
};

const MetricCard = ({ icon, label, value }) => {
  const theme = useTheme();

  return (
    <Box sx={{
      display: "flex",
      alignItems: "center",
      p: 1,
      borderRadius: 1,
      bgcolor: theme.palette.mode === 'dark'
        ? theme.palette.background.paper
        : theme.palette.grey[50],
    }}>
      {icon}
      <Box sx={{ ml: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="subtitle1" fontWeight="medium">
          {typeof value === "number" && label.toLowerCase().includes("balance")
            ? `$${value.toLocaleString()}`
            : value}
        </Typography>
      </Box>
    </Box>
  );
};

const UserInfoHeader = ({ userData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper sx={{
      p: { xs: 2, md: 3 },
      mb: 3,
      bgcolor: theme.palette.mode === 'dark'
        ? theme.palette.background.paper
        : theme.palette.background.default
    }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={4}>
          <Box sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: isMobile ? 'column' : 'row',
            textAlign: isMobile ? 'center' : 'left'
          }}>
            <Avatar
              sx={{
                width: isMobile ? 60 : 80,
                height: isMobile ? 60 : 80,
                bgcolor: theme.palette.primary.main,
                fontSize: isMobile ? "1.5rem" : "2rem",
              }}
            >
              {userData.avatar}
            </Avatar>
            <Box sx={{ ml: isMobile ? 0 : 2, mt: isMobile ? 2 : 0 }}>
              <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
                {userData.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userData.role}
              </Typography>
              <Rating
                value={userData.rating}
                readOnly
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={4}>
              <MetricCard
                icon={<StarIcon color="primary" />}
                label="Trust Score"
                value={`${userData.trustScore}%`}
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <MetricCard
                icon={<AccountBalanceIcon color="primary" />}
                label="Balance"
                value={userData.balance}
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <MetricCard
                icon={<TrendingDownIcon color="error" />}
                label="Debt"
                value={userData.debt}
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <MetricCard
                icon={<TrendingUpIcon color="success" />}
                label="Received"
                value={userData.received}
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <MetricCard
                icon={<TrendingDownIcon color="warning" />}
                label="Spent"
                value={userData.spent}
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body2" color="text.secondary" mr={1}>
                  Rating:
                </Typography>
                <Rating value={userData.rating} readOnly size="small" />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

const ProjectDashboard = () => {
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const savedTab = localStorage.getItem(STORAGE_KEY);
      return savedTab !== null ? parseInt(savedTab, 10) : 0;
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return 0;
    }
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
    try {
      localStorage.setItem(STORAGE_KEY, newValue.toString());
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const TabContent = () => {
    switch (activeTab) {
      case 0:
        return <TodayView />;
      case 1:
        return <BoardView />;
      case 2:
        return <CalendarView />;
      case 3:
        return <SubmissionsView />;
      case 4:
        return <ProjectsView />;
      case 5:
        return <TeamsView />;
      case 6:
        return <MetricsView />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{
      mt: { xs: 2, md: 4 },
      mb: { xs: 2, md: 4 },
      px: { xs: 1, sm: 2, md: 3 }
    }}>
      <DemoBanner />
      <UserInfoHeader userData={USER_DATA} />

      <Box sx={{
        borderBottom: 1,
        borderColor: "divider",
        mb: 3,
        bgcolor: theme.palette.mode === 'dark'
          ? theme.palette.background.paper
          : theme.palette.background.default
      }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons="auto"
        >
          <Tab icon={<TodayIcon />} label="Today's tasks" />
          <Tab icon={<ViewKanbanIcon />} label="Tasks" />
          <Tab icon={<CalendarMonthIcon />} label="Calendar" />
          <Tab icon={<InboxIcon />} label="Submissions" />
          <Tab icon={<ProjectsIcon />} label="Projects" />
          <Tab icon={<TeamsIcon />} label="Teams" />
          <Tab icon={<AddchartIcon />} label="Metrics" />
        </Tabs>
      </Box>

      <Box sx={{ mt: 3 }}>
        <TabContent />
      </Box>
    </Container>
  );
};

export default ProjectDashboard;
