import React from 'react';
import { motion } from 'framer-motion';
import { Box, Container, Grid, Typography, Paper, useTheme, styled } from '@mui/material';
import { Lock, Security, Architecture, VerifiedUser, GppGood, Shield, MonitorHeart } from '@mui/icons-material';

const SecuritySection = () => {
  const theme = useTheme();

  const securityFeatures = [
    { icon: <Security />, title: 'Tamper-proof Records', description: 'Immutable blockchain records maintain audit integrity' },
    { icon: <Architecture />, title: 'Decentralized Architecture', description: 'Distributed network eliminates single points of failure' },
    { icon: <VerifiedUser />, title: 'Verified Access', description: 'Biometric authentication and digital identity verification' },
    { icon: <GppGood />, title: 'Fraud Prevention', description: 'Smart contracts with cryptographic transaction validation' },
    { icon: <Shield />, title: 'Secure Comms', description: 'End-to-end encrypted messaging protocols' },
    { icon: <MonitorHeart />, title: 'Real-time Monitoring', description: 'AI-powered anomaly detection system' },
  ];

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, position: 'relative', overflow: 'hidden', bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <LockHeader />

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {securityFeatures.map((feature, index) => (
            <Grid item xs={12} sm={6} lg={4} key={feature.title}>
              <SecurityFeatureCard index={index} {...feature} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

const LockHeader = () => {
  const theme = useTheme();

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
      mb: { xs: 4, md: 6 },
      flexWrap: 'wrap',
    }}>
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ amount: 0.5 }}
        transition={{ type: 'spring', stiffness: 120 }}
      >
        <LockIconContainer>
          <Lock sx={{ fontSize: 56, color: 'white' }} />
          <Particles />
        </LockIconContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ amount: 0.5 }}
        transition={{ delay: 0.2 }}
      >
        <Typography variant="h2" sx={{
          fontWeight: 800,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(45deg, #e0e7ff 30%, #38bdf8 90%)'
            : 'linear-gradient(45deg, #1e3a8a 30%, #2563eb 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1.2,
          fontSize: { xs: '2.5rem', md: '3.5rem' },
        }}>
          Cyber Security
        </Typography>
      </motion.div>
    </Box>
  );
};

const SecurityFeatureCard = ({ index, icon, title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.2 }}
      transition={{ delay: 0.1 * index }}
    >
      <FeatureCard elevation={0}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <IconWrapper>
              {icon}
            </IconWrapper>
          </motion.div>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </FeatureCard>
    </motion.div>
  );
};
// Particles component remains the same

const IconWrapper = styled(motion.div)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(56, 189, 248, 0.1)'
    : 'rgba(30, 58, 138, 0.1)',
  marginRight: theme.spacing(2),
  '& .MuiSvgIcon-root': {
    fontSize: 28,
    color: theme.palette.mode === 'dark' ? '#38bdf8' : '#1e3a8a',
  },
}));


const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(30, 41, 59, 0.5)'
    : 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(12px)',
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6],
  },
}));


const LockIconContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: 120,
  height: 120,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)'
    : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
  boxShadow: '0 8px 32px rgba(30, 58, 138, 0.3)',
}));

const Particles = () => {
  const particles = Array.from({ length: 8 }, (_, i) => ({
    angle: (i * 45 * Math.PI) / 180,
    delay: i * 0.15,
  }));

  return (
    <>
      {particles.map(({ angle, delay }, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.6)',
          }}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{
            x: Math.cos(angle) * 40,
            y: Math.sin(angle) * 40,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            delay,
            repeat: Infinity,
            repeatType: 'loop',
          }}
        />
      ))}
    </>
  );
};

export default SecuritySection;
