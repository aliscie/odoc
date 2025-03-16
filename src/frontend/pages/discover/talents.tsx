import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const Talents: React.FC = () => {
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 4, 
        textAlign: 'center',
        backgroundColor: (theme) => 
          theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
        borderRadius: 2
      }}
    >
      <Typography variant="h5" gutterBottom>
        Talents Feature
      </Typography>
      <Typography variant="body1" color="text.secondary">
        This feature is not available yet. Check back soon to discover talented professionals.
      </Typography>
    </Paper>
  );
};

export default Talents;