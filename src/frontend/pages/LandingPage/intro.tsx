import { Box, Typography } from "@mui/material";
import logo from "../../public/logo.png";
import Link from "@mui/material/Link";
import GetStartedButton from "./getStartedButton";
import React from "react";
import { useSelector } from "react-redux";
import { motion, useInView } from "framer-motion";
import FloatingFeatures from "./floatingFeature";

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

export default function Intro() {
  const { profile, profile_history, wallet, friends } = useSelector(
    (state: any) => state.filesState,
  );

  // Create a ref for the container element
  const ref = React.useRef(null);

  // Check if the element is in view
  const isInView = useInView(ref, {
    once: false, // Set to false to trigger animation every time it enters viewport
    amount: 0.2, // How much of the element should be in view
  });

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
      ref={ref} // Add ref to the container
      initial="hidden"
      animate={isInView ? "visible" : "hidden"} // Animation controlled by isInView
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
          variants={{
            hidden: { scale: 0.8, opacity: 0 },
            visible: {
              scale: 1,
              opacity: 1,
              transition: { duration: 0.5 }
            }
          }}
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
          Designed for startups and SMEs as wel as project management, freelancers, remote teams, and small
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
      <MotionBox
        variants={itemVariants}
      >
        <GetStartedButton key={profile?.id} />
      </MotionBox>
    </MotionBox>
  );
}
