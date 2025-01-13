import {Grid, Paper, Typography, useTheme} from "@mui/material";
import React from "react";
import {TaskCard} from "./todayView";

// Sample data
export const SAMPLE_TASKS = [
  { id: 1, title: "Design Review", status: "In Progress", dueDate: "2025-01-10", priority: "High" },
  { id: 2, title: "Frontend Development", status: "Todo", dueDate: "2025-01-12", priority: "Medium" },
  { id: 3, title: "API Integration", status: "Done", dueDate: "2025-01-10", priority: "High" },
  { id: 4, title: "Testing", status: "In Progress", dueDate: "2025-01-11", priority: "Low" }
];

const BoardView = () => {
  const theme = useTheme();

  return (
    <Grid container spacing={3}>
      {['Todo', 'In Progress', 'Done'].map(status => (
        <Grid item xs={12} md={4} key={status}>
          <Paper
            sx={{
              p: 2,
              bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50'
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>{status}</Typography>
            {SAMPLE_TASKS
              .filter(task => task.status === status)
              .map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default BoardView;
