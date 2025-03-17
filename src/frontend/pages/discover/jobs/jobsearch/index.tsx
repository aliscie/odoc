import React from 'react';
import { Button } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';

const JobSearch: React.FC = () => {
  const handleFindJobs = () => {
    // Get resume data from localStorage
    const resumeData = localStorage.getItem('resume_data');
    if (resumeData) {
      console.log('Resume data:', JSON.parse(resumeData));
    } else {
      console.log('No resume data found in localStorage');
    }
  };

  return (
    <Button 
      variant="contained" 
      color="primary" 
      startIcon={<WorkIcon />}
      onClick={handleFindJobs}
      size="large"
    >
      Find Jobs
    </Button>
  );
};

export default JobSearch;