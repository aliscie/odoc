import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
  Button,
  Avatar,
  AvatarGroup,
  Divider,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
  CalendarToday as CalendarTodayIcon,
  Groups as GroupsIcon,
} from '@mui/icons-material';

// Updated sample projects data with just members
const SAMPLE_PROJECTS = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Complete overhaul of company website with new design system",
    progress: 75,
    status: "In Progress",
    dueDate: "2025-02-15",
    priority: "High",
    members: [
      { id: 1, name: "Sarah Chen", role: "Project Lead", avatar: "SC" },
      { id: 2, name: "Mike Ross", role: "Senior Developer", avatar: "MR" },
      { id: 3, name: "Anna Smith", role: "UX Designer", avatar: "AS" },
      { id: 4, name: "John Doe", role: "Developer", avatar: "JD" },
      { id: 5, name: "Emma Wilson", role: "Developer", avatar: "EW" }
    ]
  },
  {
    id: 2,
    name: "Mobile App Development",
    description: "Native mobile application for both iOS and Android platforms",
    progress: 30,
    status: "Active",
    dueDate: "2025-03-20",
    priority: "Medium",
    members: [
      { id: 6, name: "David Kim", role: "Project Lead", avatar: "DK" },
      { id: 7, name: "Lisa Park", role: "Senior Developer", avatar: "LP" },
      { id: 8, name: "Tom Brown", role: "Mobile Developer", avatar: "TB" },
      { id: 9, name: "Rachel Green", role: "UI Designer", avatar: "RG" }
    ]
  },
  {
    id: 3,
    name: "Data Analytics Dashboard",
    description: "Real-time analytics dashboard for business metrics",
    progress: 90,
    status: "Near Completion",
    dueDate: "2025-01-30",
    priority: "High",
    members: [
      { id: 10, name: "Emily White", role: "Data Science Lead", avatar: "EW" },
      { id: 11, name: "James Lee", role: "Data Engineer", avatar: "JL" },
      { id: 12, name: "Sofia Garcia", role: "Data Analyst", avatar: "SG" }
    ]
  },
  {
    id: 4,
    name: "CRM Integration",
    description: "Integration of new CRM system with existing platforms",
    progress: 15,
    status: "Just Started",
    dueDate: "2025-04-10",
    priority: "Medium",
    members: [
      { id: 13, name: "Robert Martin", role: "Project Lead", avatar: "RM" },
      { id: 14, name: "Alice Johnson", role: "Backend Developer", avatar: "AJ" },
      { id: 15, name: "Chris Lee", role: "System Architect", avatar: "CL" }
    ]
  }
];

const ProjectCard = ({ project }) => {
  const getProgressColor = (progress) => {
    if (progress >= 75) return 'success';
    if (progress >= 40) return 'primary';
    return 'warning';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return '#ef5350';
      case 'Medium':
        return '#ff9800';
      default:
        return '#66bb6a';
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {project.name}
            </Typography>
            <Chip
              label={project.status}
              size="small"
              sx={{ mr: 1 }}
            />
            <Chip
              label={project.priority}
              size="small"
              sx={{
                backgroundColor: getPriorityColor(project.priority),
                color: 'white'
              }}
            />
          </Box>
          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
        </Box>

        {/* Description */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {project.description}
        </Typography>

        {/* Progress */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">Progress</Typography>
            <Typography variant="body2" color="text.secondary">{project.progress}%</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={project.progress}
            color={getProgressColor(project.progress)}
          />
        </Box>

        {/* Members Section */}
        <Box sx={{ mb: 2 }}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Project Members:
          </Typography>
          <AvatarGroup max={5} sx={{ mb: 1 }}>
            {project.members.map((member) => (
              <Tooltip key={member.id} title={`${member.name} (${member.role})`}>
                <Avatar>{member.avatar}</Avatar>
              </Tooltip>
            ))}
          </AvatarGroup>
        </Box>

        {/* Footer */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Team Size">
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <PersonIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2">{project.members.length}</Typography>
              </Box>
            </Tooltip>
            <Tooltip title="Due Date">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2">{project.dueDate}</Typography>
              </Box>
            </Tooltip>
          </Box>
          <Button size="small" variant="outlined">View Details</Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const ProjectsView = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Projects</Typography>
        <Button variant="contained" color="primary">New Project</Button>
      </Box>

      <Grid container spacing={3}>
        {SAMPLE_PROJECTS.map((project) => (
          <Grid item xs={12} md={6} key={project.id}>
            <ProjectCard project={project} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProjectsView;
