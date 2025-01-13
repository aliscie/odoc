import React from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import {
  TimelineItem,
  Timeline,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@mui/lab";
import { Link } from "react-router-dom";

// Interfaces remain the same
interface TokenDistribution {
  category: string;
  percentage: number;
}

interface RoadmapPhase {
  title: string;
  status: "completed" | "in-progress" | "future";
  items: string[];
}

interface Feature {
  title: string;
  description: string;
}

const SNSWhitepaper: React.FC = () => {
  const theme = useTheme();

  // Data structures remain the same
  const tokenDistribution: TokenDistribution[] = [
    { category: "Community Rewards", percentage: 50 },
    { category: "Development Fund", percentage: 25 },
    { category: "Team and Advisors", percentage: 15 },
    { category: "Marketing and Partnerships", percentage: 10 },
  ];

  const features: Feature[] = [
    {
      title: "Decentralized Governance",
      description: "Community-driven evolution through SNS framework, enabling token holders to propose and vote on platform changes.",
    },
    {
      title: "Secure Smart Contracts",
      description: "Immutable, tamper-proof contracts enabling transparent agreements and automated execution.",
    },
    {
      title: "Trust System",
      description: "Built-in reputation system with verified work history, ratings, and trust scores.",
    },
    {
      title: "Cross-Border Payments",
      description: "Support for ckUSDC, USDT, and other cryptocurrencies with low fees.",
    },
  ];

  const roadmap: RoadmapPhase[] = [
    {
      title: "Phase 1: Core Features",
      status: "completed",
      items: ["ckUSDC integration", "Smart contract deployment", "Task management tools"],
    },
    {
      title: "Phase 2: Community Governance",
      status: "in-progress",
      items: ["ODOC Token launch", "SNS governance implementation", "Voting mechanisms"],
    },
    {
      title: "Phase 3: Ecosystem Expansion",
      status: "future",
      items: ["Real-time collaboration tools", "Advanced data visualization", "Enhanced identity system"],
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header - Now theme aware */}
      <Box
        sx={{
          pt: 10,
          pb: 6,
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${alpha(theme.palette.primary.light, 0.9)} 90%)`,
          color: theme.palette.primary.contrastText,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom>
            Odoc SNS Whitepaper
          </Typography>
          <Typography variant="h5" gutterBottom>
            Decentralized Collaboration and Contracts Platform
          </Typography>
          <Typography variant="subtitle1">
            Version 1.0 | January 2025
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Abstract - Theme aware paper */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary
          }}
        >
          <Typography variant="h4" gutterBottom>
            Abstract
          </Typography>
          <Typography variant="body1" paragraph>
            Odoc is a decentralized, blockchain-powered platform designed to revolutionize global collaboration
            by providing secure smart contracts, trust-based systems, and seamless payment solutions.
            Built on the Internet Computer (ICP) blockchain, Odoc integrates advanced governance mechanisms,
            tokenized incentives, and modular tools to empower freelancers, small businesses, enterprises,
            and digital nomads.
          </Typography>
        </Paper>

        {/* Features - Theme aware cards */}
        <Typography variant="h4" gutterBottom sx={{ mt: 6, mb: 3 }}>
          Key Features
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{
                bgcolor: theme.palette.background.paper,
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.04)
                }
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Tokenomics - Theme aware paper */}
        <Typography variant="h4" gutterBottom sx={{ mt: 6, mb: 3 }}>
          Tokenomics
        </Typography>
        <Paper elevation={3} sx={{
          p: 3,
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary
        }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom color="primary">
                Token Distribution
              </Typography>
              <List>
                {tokenDistribution.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={item.category}
                      secondary={`${item.percentage}%`}
                      primaryTypographyProps={{ color: 'text.primary' }}
                      secondaryTypographyProps={{ color: 'text.secondary' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom color="primary">
                Token Use Cases
              </Typography>
              <List>
                {["Governance voting rights", "Platform incentives and rewards",
                  "Access to premium features", "Staking for additional benefits"].map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={item}
                      primaryTypographyProps={{ color: 'text.primary' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </Paper>

        {/* Roadmap - Theme aware timeline */}
        <Typography variant="h4" gutterBottom sx={{ mt: 6, mb: 3 }}>
          Development Roadmap
        </Typography>
        <Timeline position="alternate">
          {roadmap.map((phase, index) => (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <TimelineDot
                  sx={{
                    bgcolor: phase.status === "completed"
                      ? theme.palette.success.main
                      : phase.status === "in-progress"
                        ? theme.palette.primary.main
                        : theme.palette.grey[500]
                  }}
                />
                {index < roadmap.length - 1 && (
                  <TimelineConnector sx={{ bgcolor: theme.palette.divider }} />
                )}
              </TimelineSeparator>
              <TimelineContent>
                <Paper elevation={3} sx={{
                  p: 2,
                  bgcolor: theme.palette.background.paper,
                  color: theme.palette.text.primary
                }}>
                  <Typography variant="h6" component="h1" color="primary">
                    {phase.title}
                  </Typography>
                  <List dense>
                    {phase.items.map((item, itemIndex) => (
                      <ListItem key={itemIndex}>
                        <ListItemText
                          primary={item}
                          primaryTypographyProps={{ color: 'text.primary' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Container>

      {/* Footer - Theme aware */}
      <Box sx={{
        bgcolor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        py: 4,
        mt: 6
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Contact
              </Typography>
              <Typography variant="body2">Website: odoc.app</Typography>
              <Typography variant="body2">Email: contact@odoc.app</Typography>
              <Typography variant="body2">Twitter: @ODOC_IC</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Resources
              </Typography>
              <Typography
                component={Link}
                to="https://github.com/aliscie/odoc"
                sx={{
                  color: 'inherit',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
                variant="body2"
              >
                GitHub
              </Typography>
              <Typography
                component={Link}
                to="https://discord.gg/uxMJHBk8"
                sx={{
                  color: 'inherit',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
                variant="body2"
              >
                Community
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Legal
              </Typography>
              <Typography variant="body2">Terms of Service</Typography>
              <Typography variant="body2">Privacy Policy</Typography>
              <Typography variant="body2">Disclaimer</Typography>
            </Grid>
          </Grid>
          <Divider sx={{
            my: 3,
            bgcolor: alpha(theme.palette.primary.contrastText, 0.2)
          }} />
          <Typography variant="body2" align="center">
            © 2025 Odoc. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default SNSWhitepaper;
