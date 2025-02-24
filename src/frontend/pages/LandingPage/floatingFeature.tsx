import { Box, Typography, useTheme, Popper, Fade, Paper, Link } from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WorkIcon from '@mui/icons-material/Work';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import HubIcon from '@mui/icons-material/Hub';
import CodeIcon from '@mui/icons-material/Code';
import { motion } from "framer-motion";
import { useState } from 'react';

const MotionBox = motion(Box);

const featuresData = {
  TIME: {
    icon: AccessTimeIcon,
    tooltip: "Save time with Odoc: Streamline contracts, manage tasks, and process payments—all in one platform. Fewer clicks, fewer apps, more productivity.",
    isClickable: false
  },
  RESOURCES: {
    icon: WorkIcon,
    tooltip: "Simplify your workflow: With Odoc, one person can manage everything. No need for a full HR team, no middlemen, and no commissions.",
    isClickable: false
  },
  SECURITY: {
    icon: LockOpenIcon,
    tooltip: "cybersecurity with blockchain, encryption, and AI-driven protection for SMEs, Enjoy true freedom: No more 403 errors or sudden privacy changes. At Odoc, you help shape the platform by voting for new features.",
    isClickable: false
  },
  DECENTRALIZED: {
    icon: HubIcon,
    tooltip: "Decentralized and unstoppable: Odoc cannot be controlled or shut down by any single entity.",
    isClickable: false
  },
  OPENSOURCE: {
    icon: CodeIcon,
    tooltip: "Transparent and open-source: See exactly how it works, with no hidden algorithms or addictive tricks.",
    isClickable: true,
    link: "https://github.com/aliscie/odoc"
  }
};

const Feature = ({ text, index }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const { icon: Icon, tooltip, isClickable, link } = featuresData[text];

  const handleMouseEnter = (event) => {
    setAnchorEl(event.currentTarget);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
    setIsHovered(false);
  };

  const FeatureContent = (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isHovered ? 1.2 : 1,
      }}
      transition={{
        duration: 0.2,
        delay: index * 0.3,
        ease: "easeOut",
        rotate: {
          duration: 0.2,
          // repeat: isClickable && isHovered ? Infinity : 0,
          repeatType: "reverse"
        }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 1,
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        borderRadius: 2,
        backdropFilter: 'blur(8px)',
        boxShadow: theme.shadows[1],
        cursor: isClickable ? 'pointer' : 'default',
        '&:hover': {
          boxShadow: theme.shadows[4],
          ...(isClickable && {
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          })
        }
      }}
    >
      <Icon sx={{
        color: theme.palette.primary.main,
        ...(isClickable && isHovered && {
          transform: 'scale(1.1)',
          transition: 'transform 0.2s'
        })
      }} />
      <Typography
        variant="body2"
        sx={{
          fontWeight: 500,
          color: theme.palette.text.primary,
          ...(isClickable && {
            textDecoration: isHovered ? 'underline' : 'none'
          })
        }}
      >
        {text}
      </Typography>
    </MotionBox>
  );

  return (
    <>
      {isClickable ? (
        <Link
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ textDecoration: 'none' }}
        >
          {FeatureContent}
        </Link>
      ) : (
        FeatureContent
      )}

      <Popper
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        placement="top"
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <Paper
              sx={{
                p: 2,
                mt: -1,
                maxWidth: 280,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                borderRadius: 2,
                boxShadow: theme.shadows[4],
                backdropFilter: 'blur(8px)',
              }}
            >
              <Typography variant="body2">
                {tooltip}
              </Typography>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

const Features = () => {
  return (
    <Box sx={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 2,
      justifyContent: 'center',
      py: 4
    }}>
      {Object.keys(featuresData).map((text, index) => (
        <Feature key={text} text={text} index={index} />
      ))}
    </Box>
  );
};

export default Features;
