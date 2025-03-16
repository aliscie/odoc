import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import ChatBot from './ChatBot';
import JobChat from './JobChat';

const JobsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chat');
  // const jobSearchAgent = getfJobSearchAgent();

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  return (
    <Box className="jobs-page-container" sx={{ padding: 3, maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4">Jobs & Career Assistant</Typography>
      
      <Box sx={{ marginTop: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="AI Chat Assistant" value="chat" />
          <Tab label="Job Application Assistant" value="jobChat" />
        </Tabs>
        
        <Box sx={{ marginTop: 2 }}>
          {activeTab === 'chat' && <ChatBot />}
          {activeTab === 'jobChat' && <JobChat />}
        </Box>
      </Box>
    </Box>
  );
};

export default JobsPage;