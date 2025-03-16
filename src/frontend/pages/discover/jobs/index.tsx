import React from 'react';
import { Box, Typography } from '@mui/material';
import JobChat from './JobChat';

const JobsPage: React.FC = () => {
  return (
    <Box className="jobs-page-container" sx={{ padding: 3, maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4">Jobs & Career Assistant</Typography>
      
      <Box sx={{ marginTop: 3 }}>
        <JobChat />
      </Box>
    </Box>
  );
};

export default JobsPage;