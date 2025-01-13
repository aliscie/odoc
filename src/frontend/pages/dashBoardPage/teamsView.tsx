import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  AvatarGroup,
  Chip,
  IconButton,
  Button,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import {
  Groups as GroupsIcon,
  MoreVert as MoreVertIcon,
  Assignment as AssignmentIcon,
  StarBorder as StarBorderIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

// Sample teams data
const SAMPLE_TEAMS = [
  {
    id: 1,
    name: "Frontend Development",
    description: "Web and mobile interface development team",
    members: [
      { id: 1, name: "Sarah Chen", role: "Team Lead", avatar: "SC" },
      { id: 2, name: "Mike Ross", role: "Senior Developer", avatar: "MR" },
      { id: 3, name: "Anna Smith", role: "UX Designer", avatar: "AS" },
      { id: 4, name: "John Doe", role: "Developer", avatar: "JD" },
      { id: 5, name: "Emma Wilson", role: "Developer", avatar: "EW" }
    ],
    activeProjects: 4,
    completedProjects: 12,
    performance: 92,
    tags: ["React", "Vue", "UI/UX"],
    recentActivity: [
      { type: "completed", text: "Completed Website Redesign", date: "2 days ago" },
      { type: "started", text: "Started Mobile App Development", date: "1 week ago" }
    ]
  },
  {
    id: 2,
    name: "Backend Development",
    description: "Server infrastructure and API development team",
    members: [
      { id: 6, name: "David Kim", role: "Team Lead", avatar: "DK" },
      { id: 7, name: "Lisa Park", role: "Senior Developer", avatar: "LP" },
      { id: 8, name: "Tom Brown", role: "DevOps Engineer", avatar: "TB" },
      { id: 9, name: "Rachel Green", role: "Backend Developer", avatar: "RG" }
    ],
    activeProjects: 3,
    completedProjects: 8,
    performance: 88,
    tags: ["Node.js", "Python", "AWS"],
    recentActivity: [
      { type: "completed", text: "API Integration Complete", date: "1 day ago" },
      { type: "started", text: "Database Migration Project", date: "3 days ago" }
    ]
  },
  {
    id: 3,
    name: "Design Team",
    description: "Creative and user experience design team",
    members: [
      { id: 10, name: "Emily White", role: "Creative Director", avatar: "EW" },
      { id: 11, name: "James Lee", role: "Senior Designer", avatar: "JL" },
      { id: 12, name: "Sofia Garcia", role: "UI Designer", avatar: "SG" }
    ],
    activeProjects: 5,
    completedProjects: 15,
    performance: 95,
    tags: ["UI/UX", "Figma", "Adobe XD"],
    recentActivity: [
      { type: "completed", text: "Brand Guidelines Update", date: "4 days ago" },
      { type: "started", text: "New Product Design", date: "1 week ago" }
    ]
  }
];

const TeamMetric = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
    {icon}
    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
      {label}:
      <Typography component="span" variant="body2" color="text.primary" sx={{ ml: 0.5, fontWeight: 'medium' }}>
        {value}
      </Typography>
    </Typography>
  </Box>
);

const TeamCard = ({ team }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {team.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {team.description}
            </Typography>
          </Box>
          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
        </Box>

        {/* Team Metrics */}
        <Box sx={{ mb: 3 }}>
          <TeamMetric
            icon={<AssignmentIcon fontSize="small" color="primary" />}
            label="Active Projects"
            value={team.activeProjects}
          />
          <TeamMetric
            icon={<CheckCircleOutlineIcon fontSize="small" color="success" />}
            label="Completed Projects"
            value={team.completedProjects}
          />
          <TeamMetric
            icon={<TrendingUpIcon fontSize="small" color="info" />}
            label="Performance"
            value={`${team.performance}%`}
          />
        </Box>

        {/* Team Members */}
        <Typography variant="subtitle2" gutterBottom>
          Team Members ({team.members.length})
        </Typography>
        <AvatarGroup max={5} sx={{ mb: 2 }}>
          {team.members.map((member) => (
            <Avatar key={member.id} alt={member.name}>
              {member.avatar}
            </Avatar>
          ))}
        </AvatarGroup>

        {/* Tags */}
        <Box sx={{ mb: 2 }}>
          {team.tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Recent Activity */}
        <Typography variant="subtitle2" gutterBottom>
          Recent Activity
        </Typography>
        <List dense>
          {team.recentActivity.map((activity, index) => (
            <ListItem key={index} disablePadding>
              <ListItemText
                primary={activity.text}
                secondary={activity.date}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </ListItem>
          ))}
        </List>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button size="small" variant="outlined">
            View Team
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const TeamsView = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Teams</Typography>
        <Button variant="contained" color="primary" startIcon={<GroupsIcon />}>
          New Team
        </Button>
      </Box>

      <Grid container spacing={3}>
        {SAMPLE_TEAMS.map((team) => (
          <Grid item xs={12} md={6} lg={4} key={team.id}>
            <TeamCard team={team} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TeamsView;
