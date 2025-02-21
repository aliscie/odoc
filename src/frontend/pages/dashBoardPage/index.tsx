import React, { useState } from "react";
import {
  Box,
  Container,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  CalendarMonth as CalendarMonthIcon,
  Today as TodayIcon,
  Inbox as InboxIcon,
  FolderSpecial as ProjectsIcon,
  Groups as TeamsIcon,
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

const STORAGE_KEY = "dashboardActiveTab";


const ProjectDashboard = () => {
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const savedTab = localStorage.getItem(STORAGE_KEY);
      return savedTab !== null ? parseInt(savedTab, 10) : 0;
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return 0;
    }
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
    try {
      localStorage.setItem(STORAGE_KEY, newValue.toString());
    } catch (error) {
      console.error("Error saving to localStorage:", error);
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
    <Container
      maxWidth="lg"
      sx={{
        mt: { xs: 2, md: 4 },
        mb: { xs: 2, md: 4 },
        px: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          mb: 3,
          bgcolor: theme.palette.mode === "dark"
            ? theme.palette.background.paper
            : theme.palette.background.default,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons="auto"
          sx={{
            opacity: isMobile ? 1 : 0.7,
            transition: "all 0.3s ease",
            "&:hover": {
              opacity: 1,
            },
            "& .MuiTab-root": {
              transform: "scale(0.9)",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.1)",
              },
            },
          }}
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
