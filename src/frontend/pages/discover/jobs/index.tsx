import React, { useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';

import { ResumeProvider } from './ResumeContext';

import JobSearch from './jobsearch';
import JobChat from './resumeBuilder/JobChat';
import ResumeView from './resumeBuilder/ResumeView';

const JobsPage: React.FC = () => {
  const [showJobSearch, setShowJobSearch] = useState(false);

  return (
    <ResumeProvider>
      <Box className="jobs-page-container" sx={{ padding: 3, maxWidth: '1200px', margin: '0 auto' }}>
        <Typography variant="h4">Jobs & Career Assistant</Typography>
        
        <Box sx={{ marginTop: 3 }}>
          <JobChat />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          <JobSearch />
          <ResumeView />
        </Box>
        
        {showJobSearch && (
          <Box sx={{ mt: 4, p: 3, bgcolor: '#f5f5f5', borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Job Search
            </Typography>
            
            <Typography variant="body1">
              This feature is not available yet.
            </Typography>
          </Box>
        )}
      </Box>
    </ResumeProvider>
  );
};

export default JobsPage;