import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  styled,
  Typography,
} from "@mui/material";
import {
  AttachFile as AttachFileIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
const SAMPLE_SUBMISSIONS = [
  {
    id: 1,
    title: "Q4 Project Report",
    submitter: "Alex Chen",
    email: "alex.chen@example.com",
    status: "Under Review",
    submitDate: "2025-01-08",
    category: "Reports",
    priority: "High",
    description: "Q4 project performance analysis",
    attachments: [
      { name: "Q4_Report.pdf", size: "2.4 MB" },
      { name: "Financial_Summary.xlsx", size: "1.1 MB" },
    ],
    comments: [
      {
        author: "Sarah Wilson",
        date: "2025-01-09",
        text: "Please add marketing campaign results.",
      },
      {
        author: "John Davis",
        date: "2025-01-08",
        text: "Financial projections approved.",
      },
    ],
    history: [
      { date: "2025-01-08 09:00", event: "Submission created" },
      { date: "2025-01-08 14:30", event: "Assigned to review" },
    ],
  },
  {
    id: 2,
    title: "Marketing Campaign Assets",
    submitter: "Sarah Johnson",
    status: "New",
    submitDate: "2025-01-10",
    category: "Marketing",
    priority: "Medium",
  },
];

const StyledStatusChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor:
    status === "New"
      ? theme.palette.primary
      : status === "Under Review"
        ? theme.palette.warning.dark
        : theme.palette.success.dark,
  color:
    status === "New"
      ? theme.palette.primary.contrastText
      : status === "Under Review"
        ? theme.palette.warning.contrastText
        : theme.palette.success.contrastText,
  fontWeight: 500,
  padding: "0 8px",
}));
const SubmissionRow = ({ submission, onClick }) => {
  return (
    <Card sx={{ mb: 1, cursor: "pointer" }} onClick={onClick}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box flex={1}>
            <Typography variant="subtitle1">{submission.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {submission.submitter}
            </Typography>
          </Box>
          <Box flex={1}>
            <Typography variant="body2">{submission.category}</Typography>
          </Box>
          <Box flex={1}>
            <Typography variant="body2">{submission.submitDate}</Typography>
          </Box>
          <Box>
            <StyledStatusChip
              label={submission.status}
              status={submission.status}
              size="small"
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Submission Components
const SubmissionDetails = ({ submission, onClose }) => {
  return (
    <>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{submission.title}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography>{submission.description}</Typography>
            </Paper>

            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Comments
              </Typography>
              <List>
                {submission.comments?.map((comment, index) => (
                  <ListItem key={index} alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="subtitle2">
                            {comment.author}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {comment.date}
                          </Typography>
                        </Box>
                      }
                      secondary={comment.text}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Details
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Submitter"
                    secondary={submission.submitter}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ScheduleIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Submit Date"
                    secondary={submission.submitDate}
                  />
                </ListItem>
                <ListItem>
                  <StyledStatusChip
                    label={submission.status}
                    status={submission.status}
                    size="small"
                  />
                </ListItem>
              </List>
            </Paper>

            {submission.attachments && (
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Attachments
                </Typography>
                <List dense>
                  {submission.attachments.map((file, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <AttachFileIcon />
                      </ListItemIcon>
                      <ListItemText primary={file.name} secondary={file.size} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Grid>
        </Grid>
      </DialogContent>
    </>
  );
};

const SubmissionsView = () => {
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Submissions
      </Typography>
      <Paper sx={{ p: 2 }}>
        {SAMPLE_SUBMISSIONS.map((submission) => (
          <SubmissionRow
            key={submission.id}
            submission={submission}
            onClick={() => setSelectedSubmission(submission)}
          />
        ))}
      </Paper>

      <Dialog
        open={!!selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        maxWidth="lg"
        fullWidth
      >
        {selectedSubmission && (
          <SubmissionDetails
            submission={selectedSubmission}
            onClose={() => setSelectedSubmission(null)}
          />
        )}
      </Dialog>
    </Box>
  );
};

export default SubmissionsView;
