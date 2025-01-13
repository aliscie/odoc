// DashboardOverview.js
import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Divider,
} from '@mui/material';
import {
  FolderSpecial as ProjectsIcon,
  Warning as WarningIcon,
  AccessTime as TimeIcon,
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  Flag as FlagIcon,
} from '@mui/icons-material';


const MetricsView = () => {
  // Constants from your main component
  const OVERVIEW_STATS = {
    activeProjects: 12,
    tasksAtRisk: 5,
    upcomingDeadlines: 8,
    resourceUtilization: 78,
    budgetVariance: -2.5,
    teamVelocity: 85,
  };

  const PROJECT_HEALTH = [
    { name: "E-commerce Platform", progress: 75, status: "on-track", daysLeft: 15 },
    { name: "Mobile App Redesign", progress: 45, status: "at-risk", daysLeft: 8 },
    { name: "Cloud Migration", progress: 90, status: "ahead", daysLeft: 20 },
    { name: "Security Audit", progress: 30, status: "delayed", daysLeft: 5 },
  ];

  const RESOURCE_ALLOCATION = [
    { team: "Development", allocated: 85, available: 15 },
    { team: "Design", allocated: 70, available: 30 },
    { team: "QA", allocated: 95, available: 5 },
    { team: "DevOps", allocated: 60, available: 40 },
  ];

  const RISK_REGISTER = [
    { severity: "High", description: "API Integration Delay", mitigation: "Added additional resources" },
    { severity: "Medium", description: "Budget Overrun", mitigation: "Cost optimization in progress" },
    { severity: "High", description: "Resource Shortage", mitigation: "Hiring process initiated" },
  ];

  const getStatusColor = (status) => {
    const statusColors = {
      'on-track': 'success',
      'at-risk': 'warning',
      'delayed': 'error',
      'ahead': 'info',
    };
    return statusColors[status] || 'default';
  };

  // Project Overview Section
  const ProjectOverview = () => (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>Project Overview</Typography>
      <List dense>
        <ListItem>
          <ListItemIcon><ProjectsIcon color="primary" /></ListItemIcon>
          <ListItemText primary={`${OVERVIEW_STATS.activeProjects} Active Projects`} />
        </ListItem>
        <ListItem>
          <ListItemIcon><WarningIcon color="error" /></ListItemIcon>
          <ListItemText primary={`${OVERVIEW_STATS.tasksAtRisk} Tasks at Risk`} />
        </ListItem>
        <ListItem>
          <ListItemIcon><TimeIcon color="warning" /></ListItemIcon>
          <ListItemText primary={`${OVERVIEW_STATS.upcomingDeadlines} Upcoming Deadlines`} />
        </ListItem>
      </List>
    </Paper>
  );

  // Performance Metrics Section
  const PerformanceMetrics = () => (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
      <List dense>
        <ListItem>
          <ListItemIcon><TimelineIcon color="primary" /></ListItemIcon>
          <ListItemText primary={`${OVERVIEW_STATS.resourceUtilization}% Resource Utilization`} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <TrendingUpIcon color={OVERVIEW_STATS.budgetVariance >= 0 ? "success" : "error"} />
          </ListItemIcon>
          <ListItemText primary={`${OVERVIEW_STATS.budgetVariance}% Budget Variance`} />
        </ListItem>
        <ListItem>
          <ListItemIcon><FlagIcon color="success" /></ListItemIcon>
          <ListItemText primary={`${OVERVIEW_STATS.teamVelocity}% Team Velocity`} />
        </ListItem>
      </List>
    </Paper>
  );

  // Resource Allocation Section
  const ResourceAllocation = () => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Resource Allocation</Typography>
        {RESOURCE_ALLOCATION.map((resource) => (
          <Box key={resource.team} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">{resource.team}</Typography>
              <Typography variant="body2">{resource.allocated}% Allocated</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={resource.allocated}
              color={resource.allocated > 90 ? "error" : "primary"}
            />
          </Box>
        ))}
      </CardContent>
    </Card>
  );

  // Project Health Section
  const ProjectHealth = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Project Health</Typography>
      {PROJECT_HEALTH.map((project) => (
        <Card key={project.name} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6">{project.name}</Typography>
              <Chip
                label={project.status.toUpperCase()}
                color={getStatusColor(project.status)}
                size="small"
              />
            </Box>
            <Box sx={{ mb: 1 }}>
              <LinearProgress variant="determinate" value={project.progress} />
              <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                Progress: {project.progress}%
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {project.daysLeft} days remaining
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  // Risk Register Section
  const RiskRegister = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Risk Register</Typography>
        <List>
          {RISK_REGISTER.map((risk, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemIcon>
                  <WarningIcon color={risk.severity.toLowerCase() === "high" ? "error" : "warning"} />
                </ListItemIcon>
                <ListItemText
                  primary={risk.description}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        Severity: {risk.severity}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2">
                        Mitigation: {risk.mitigation}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {index < RISK_REGISTER.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {/* First Row */}
        <Grid item xs={12} md={4}>
          <ProjectOverview />
        </Grid>
        <Grid item xs={12} md={4}>
          <PerformanceMetrics />
        </Grid>
        <Grid item xs={12} md={4}>
          <ResourceAllocation />
        </Grid>

        {/* Second Row */}
        <Grid item xs={12} md={8}>
          <ProjectHealth />
        </Grid>
        <Grid item xs={12} md={4}>
          <RiskRegister />
        </Grid>
      </Grid>
    </Box>
  );
};

export default MetricsView;
