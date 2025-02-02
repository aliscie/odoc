import { Box, Typography } from "@mui/material";
import logo from "../../public/logo.png";
import Link from "@mui/material/Link";
import GetStartedButton from "./getStartedButton";
import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import FloatingFeatures from "./floatingFeature";

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

export default function Intro() {
  const { profile, profile_history, wallet, friends } = useSelector(
    (state: any) => state.filesState,
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <MotionBox
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      sx={{
        maxWidth: { xs: "100%", sm: "600px", md: "800px" },
        mx: "auto",
        px: { xs: 2, sm: 0 },
      }}
    >
      <MotionBox
        variants={itemVariants}
        sx={{
          display: "flex",
          alignItems: "left",
          justifyContent: "left",
          mb: 4,
        }}
      >
        <motion.img
          src={logo}
          alt="ODOC Logo"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            width: "70px",
            borderRadius: "12px",
            marginRight: "1.5rem",
          }}
        />
        <MotionTypography
          variant="h1"
          variants={itemVariants}
          sx={{
            fontSize: { xs: "2.5rem", sm: "3rem", md: "4rem" },
            fontWeight: "bold",
            background: "linear-gradient(90deg, #2563eb 0%, #0891b2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          ODOC
        </MotionTypography>
      </MotionBox>

      <Box sx={{ color: "text.primary", mb: 4 }}>
        <MotionTypography
          variant="h3"
          variants={itemVariants}
          sx={{
            fontSize: { xs: "1.7rem", sm: "1.5rem", md: "2rem" },
            fontWeight: "bold",
            mb: 1.5,
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          Effortless Teams & Payments Management
        </MotionTypography>
        <FloatingFeatures />

        <MotionBox
          variants={itemVariants}
          sx={{ color: "text.secondary", mb: 4 }}
        >
          Designed for project management, freelancers, remote teams, and small
          businesses. Built on the{" "}
          <Link
            href="https://internetcomputer.org/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              "&:hover": { color: "primary.dark" },
            }}
          >
            Internet Computer
          </Link>
          , it simplifies tasks, payments, escrow, and contracts into one
          seamless solution. Enjoy transparent pricing, no middlemen, and
          enterprise-level security—all from anywhere in the world.
        </MotionBox>
      </Box>
      <motion.div
        variants={itemVariants}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <GetStartedButton key={profile?.id} />
      </motion.div>
    </MotionBox>
  );
}
