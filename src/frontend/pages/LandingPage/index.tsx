import logo from "../../public/logo.png";

import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowForward from "@mui/icons-material/ArrowForward";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Schedule from "@mui/icons-material/Schedule";
import { features, roadMap, steps } from "./data";
import { Link as DomLink } from "react-router-dom";

import Link from "@mui/material/Link";
import GetStartedButton from "./getStartedButton";
import { useSelector } from "react-redux";
import SocialButton from "./socialButton";
import WhyOdoc from "./whyOdoc";

export default function LandingPage(props) {
  const { profile, profile_history, wallet, friends } = useSelector(
    (state: any) => state.filesState,
  );
  return (
    <Box sx={{ minHeight: "100vh" }}>
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: 10, pb: 8 }}>
        <Box sx={{ maxWidth: "800px", mx: "auto" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "left",
              justifyContent: "left",
              mb: 4,
            }}
          >
            <img
              src={logo}
              alt="ODOC Logo"
              style={{
                width: "70px",
                borderRadius: "12px",
                marginRight: "1.5rem",
              }}
            />
            <Typography
              variant="h1"
              sx={{
                fontSize: "4rem",
                fontWeight: "bold",
                background: "linear-gradient(90deg, #2563eb 0%, #0891b2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ODOC
            </Typography>
          </Box>

          <Box sx={{ color: "text.primary", mb: 4 }}>
            <Typography
              variant="h2"
              sx={{ fontSize: "2.5rem", fontWeight: "bold", mb: 1.5 }}
            >
              Build Your Contracts on Web3
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: "text.secondary",
                mb: 2,
                fontWeight: 500,
                letterSpacing: "0.1em",
              }}
            >
              TIME • RESOURCES • FREEDOM
            </Typography>

            <Box sx={{ color: "text.secondary", mb: 4 }}>
              Odoc is the ultimate  platform designed for project
              management, freelancers, remote teams, and small businesses. Built
              on the{" "}
              <Link
                href="https://internetcomputer.org/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  "&:hover": { color: "primary.dark" },
                }}
              >
                Internet Computer
              </Link>{" "}
              It streamlines tasks, payments, and contracts into one seamless
              solution, saving you valuable time and resources. With transparent,
              affordable pricing and no hidden fees, Odoc eliminates the need
              for middlemen and banks. It empowers you to work from anywhere,
              collaborate effortlessly with your team, and scale your business
              as you grow—all while ensuring enterprise-level security.
              Experience true freedom, control, and efficiency with Odoc, where
              your success is just a click away.
            </Box>
          </Box>
          <GetStartedButton key={profile?.id} />
        </Box>
      </Container>
      <SocialButton />
      {/* Features Grid */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <WhyOdoc />
        <Typography
          variant="h3"
          sx={{ textAlign: "center", fontWeight: "bold", mb: 6 }}
        >
          Platform Features
        </Typography>
        <Grid container spacing={4}>
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
      {/* Getting Started Steps */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{ textAlign: "center", fontWeight: "bold", mb: 6 }}
          >
            Getting Started
          </Typography>
          <Box sx={{ maxWidth: "600px", mx: "auto" }}>
            <Stepper orientation="vertical">
              {steps.map((step, index) => (
                <Step key={index} active={true}>
                  <StepLabel>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {step.label}
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body1" color="text.secondary">
                        {step.description}
                      </Typography>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Container>
      </Box>
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
        <Box
          sx={{ bgcolor: "#2563eb", color: "white", py: 8, mt: 8, margin: 0 }}
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
        </Box>
      )}
    </Box>
  );
}
