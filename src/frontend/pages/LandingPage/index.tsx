import React, { useRef, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Schedule from "@mui/icons-material/Schedule";
import { features, roadMap } from "./data";
import SocialButton from "./socialButton";
import WhyOdoc from "./whyOdoc";
import Section from "./section";
import Intro from "./intro";
import GettingStarted from "../videoTutorial";
import SecuritySection from "./securitySection";
import { useScroll } from "framer-motion";
// Import the video
import handshakeVideo from "@/assets/handshake.mp4";
import { isblEditorDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useSelector } from "react-redux";

export default function LandingPage(props) {
  // Add video reference and scroll progress
  const videoRef = useRef(null);
  const { scrollYProgress } = useScroll();

  // Control video playback based on scroll
  useEffect(() => {
    let lastScrollY = 0;
    const video = videoRef.current;
    
    if (!video) return;
    
    // Calculate total video duration in seconds
    const videoDuration = video.duration || 10; // Fallback to 10 seconds if duration not available
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Calculate desired video position based on scroll progress
      const scrollProgress = scrollYProgress.get();
      // Speed multiplier for faster playback
      const speedMultiplier = 5;
      const targetTime = scrollProgress * videoDuration * speedMultiplier;
      
      // Ensure we don't exceed the video duration
      const clampedTargetTime = Math.min(targetTime, videoDuration - 0.1);
      
      // Seek to the appropriate position in the video
      if (video.readyState >= 2) {
        video.currentTime = clampedTargetTime;
      }
      
      lastScrollY = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollYProgress]);

  const { isDarkMode } = useSelector((state: any) => state.uiState);
  return (
    <Box sx={{ minHeight: "100vh", position: "relative" }}>
      {/* Background Video */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          pointerEvents: "none", // Allows clicking through the video
        }}
      >
        <video 
          ref={videoRef}
          src={handshakeVideo}
          muted
          playsInline
          preload="auto"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.6,
            // Different blend modes for dark and light themes
            mixBlendMode: isDarkMode ? 'lighten' : 'multiply',
            filter: isDarkMode 
              ? 'contrast(1.3) brightness(1.1)' 
              : 'contrast(1.2) brightness(0.9)',
          }}
        />
        

      </Box>

      {/* Hero Section */}
      <Section id="intro" sx={{ position: "relative", zIndex: 1 }} transparent={true}>
        <Intro />
      </Section>
      <Section id="why"  sx={{ position: "relative", zIndex: 1 }} transparent={true} >
        <WhyOdoc />
      </Section>
      <Section id="start" sx={{ position: "relative", zIndex: 1 }} transparent={true}>
        <GettingStarted />
      </Section>
    
      
      <Section id="security" transparent={true}>
        <SecuritySection />
      </Section>

      <Section id="social" transparent={true}>
        <SocialButton />
      </Section>
      {/* Features Grid */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          sx={{ textAlign: "center", fontWeight: "bold", mb: 6 }}
        >
          Platform Features
        </Typography>
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  transition: "0.3s",
                  "&:hover": { boxShadow: 6 },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      "& .MuiSvgIcon-root": {
                        fontSize: 40,
                        color: "#2563eb",
                      },
                    }}
                  >
                    {feature.icon}
                    <Typography variant="h6" sx={{ ml: 2, fontWeight: "bold" }}>
                      {feature.title}
                    </Typography>
                  </Box>
                  <Typography color="text.secondary">
                    {feature.content}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Rest of the component remains unchanged */}
      {/* Current Progress */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          sx={{ textAlign: "center", fontWeight: "bold", mb: 6 }}
        >
          Platform Progress
        </Typography>
        <Box sx={{ maxWidth: "800px", mx: "auto" }}>
          {/* Completed Features */}
          <Typography variant="h6" sx={{ mb: 3 }}>
            Completed Features
          </Typography>
          <Box sx={{ mb: 4 }}>
            {roadMap
              .filter((item) => item.is_done)
              .map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <CheckCircle sx={{ color: "#2563eb", mr: 2 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      {item.title}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 6 }}
                  >
                    {item.content}
                  </Typography>
                </Box>
              ))}
          </Box>

          {/* Upcoming Features */}
          <Typography variant="h6" sx={{ mb: 3 }}>
            Coming Soon
          </Typography>
          <Box>
            {roadMap
              .filter((item) => !item.is_done)
              .map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Schedule sx={{ color: "#64748b", mr: 2 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      {item.title}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 6 }}
                  >
                    {item.content}
                  </Typography>
                </Box>
              ))}
          </Box>
        </Box>
      </Container>

      {/* Call to Action */}
      {!props.isLoggedIn && (
        <Section
          id={"bottom"}
          sx={{
            bgcolor: "#2563eb",
            color: "white",
            py: { xs: 6, sm: 8 },
            px: { xs: 2, sm: 3, md: 4 },
            mt: { xs: 4, sm: 6, md: 8 },
            margin: 0,
          }}
        >
          <Container maxWidth="lg" sx={{ textAlign: "center" }}>
            <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
              Ready to Get Started?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join the future of decentralized collaboration
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 2,
                fontSize: "1.1rem",
                bgcolor: "white",
                color: "#2563eb",
                "&:hover": {
                  bgcolor: "#f8fafc",
                },
              }}
              onClick={async () => await props.login()}
            >
              Join ODOC Today
            </Button>
          </Container>
        </Section>
      )}
    </Box>
  );
}
