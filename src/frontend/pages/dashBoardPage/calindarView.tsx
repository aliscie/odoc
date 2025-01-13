import { Grid, Paper, Typography, useTheme } from "@mui/material";
import React from "react";
import {SAMPLE_TASKS} from "./boardView";

const CalendarView = () => {
  const theme = useTheme();

  return (
    <Grid container spacing={1}>
      {[...Array(31)].map((_, index) => {
        const day = index + 1;
        const tasksForDay = SAMPLE_TASKS.filter(
          (task) => parseInt(task.dueDate.split("-")[2]) === day,
        );

        return (
          <Grid item xs={12 / 7} key={day}>
            <Paper
              sx={{
                p: 1,
                height: 120,
                border: day === new Date().getDate() ? 2 : 0,
                borderColor: "primary.main",
                bgcolor: theme.palette.mode === "dark" ? "grey.800" : "grey.50",
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {day}
              </Typography>
              {tasksForDay.map((task) => (
                <Paper
                  key={task.id}
                  sx={{
                    p: 0.5,
                    mb: 0.5,
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "primary.dark"
                        : "primary.light",
                    color:
                      theme.palette.mode === "dark"
                        ? "primary.contrastText"
                        : "primary.dark",
                    fontSize: "0.75rem",
                  }}
                >
                  {task.title}
                </Paper>
              ))}
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default CalendarView;
