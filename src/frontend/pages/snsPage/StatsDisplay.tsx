import React, { useEffect, useState } from 'react';
import { Box, Chip, Fade, Stack, Typography } from "@mui/material";
import { People as PeopleIcon, Assignment as AssignmentIcon, AccountBalance as AccountBalanceIcon } from '@mui/icons-material';

const StatsDisplay = ({ snsStatus, odocBalance }) => {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    // Trigger animation after component mounts
    setShow(true);
  }, []);

  return (
    <Fade in={show} timeout={800}>
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2} 
        sx={{ 
          mt: 1, 
          mb: 2,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-start'
        }}
      >
        <Chip
          icon={<PeopleIcon />}
          label={`Total Users: ${snsStatus.number_users.toLocaleString()}`}
          variant="outlined"
          color="primary"
          sx={{ px: 1 }}
        />
        <Chip
          icon={<AssignmentIcon />}
          label={`Active Users: ${snsStatus.active_users.toLocaleString()}`}
          variant="outlined"
          color="success"
          sx={{ px: 1 }}
        />
        <Chip
          icon={<AccountBalanceIcon />}
          label={`Total Deposit: ${odocBalance.toLocaleString()} USDC`}
          variant="outlined"
          color="info"
          sx={{ px: 1 }}
        />
      </Stack>
    </Fade>
  );
};

export default StatsDisplay;
