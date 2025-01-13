
// View Components
import {Box, Card, CardContent, Chip, styled, Typography, useTheme} from "@mui/material";
import React from "react";
import {SAMPLE_TASKS} from "./boardView";



// Styled components
const StyledPriorityChip = styled(Chip)(({ theme, priority }) => ({
  backgroundColor:
    priority === 'High' ? theme.palette.error.light :
    priority === 'Medium' ? theme.palette.warning.light :
    theme.palette.success.light,
  color:
    priority === 'High' ? theme.palette.error.contrastText :
    priority === 'Medium' ? theme.palette.warning.contrastText :
    theme.palette.success.contrastText,
}));


// Task Card Component
export const TaskCard = ({ task }) => {
  const theme = useTheme();

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6">{task.title}</Typography>
            <Typography color="text.secondary" variant="body2">
              {task.status}
            </Typography>
          </Box>
          <StyledPriorityChip
            label={task.priority}
            priority={task.priority}
            size="small"
          />
        </Box>
      </CardContent>
    </Card>
  );
};
const TodayView = () => {
  const todayTasks = SAMPLE_TASKS.filter(task =>
    task.dueDate === new Date().toISOString().split('T')[0]
  );

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>Today's Tasks</Typography>
      {todayTasks.length > 0 ? (
        todayTasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))
      ) : (
        <Typography color="text.secondary">
          No tasks scheduled for today
        </Typography>
      )}
    </Box>
  );
};

export default TodayView;
