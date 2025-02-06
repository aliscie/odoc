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

interface TokenDistribution {
  category: string;
  percentage: number;
  description: string;
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

  const tokenDistribution: TokenDistribution[] = [
    {
      category: "Community Rewards",
      percentage: 40,
      description: "Distributed through platform engagement and task completion"
    },
    {
      category: "Development Fund",
      percentage: 30,
      description: "Reserved for platform development and technical improvements"
    },
    {
      category: "Team and Advisors",
      percentage: 20,
      description: "Vested over 3 years with 6-month cliff"
    },
    {
      category: "Marketing and Partnerships",
      percentage: 10,
      description: "Allocated for growth initiatives and strategic partnerships"
    }
  ];

  const tokenMechanics = [
    "Dynamic Burning: Token burn rate increases proportionally with transaction value in refunds and disputes",
    "Stake-to-Participate: Token staking required for creating non-refundable escrow agreements",
    "Trust Multiplier: Higher trust scores reduce required burn amounts",
    "Governance Power: Staked tokens grant voting rights on platform proposals",
    "Reward Distribution: Earn tokens through successful contract completion and positive ratings"
  ];

  const features: Feature[] = [
    {
      title: "Smart Contract Escrow",
      description: "Automated token burning mechanism for dispute resolution and refunds, with burn amount proportional to transaction value.",
    },
    {
      title: "Trust-Based Governance",
      description: "Decentralized decision-making powered by token staking and reputation scores.",
    },
    {
      title: "Cross-Chain Integration",
      description: "Support for ckUSDC, USDT, and major cryptocurrencies with transparent fee structure.",
    },
    {
      title: "Reputation System",
      description: "Dynamic trust scoring affecting token burn rates and platform privileges.",
    }
  ];

  const roadmap: RoadmapPhase[] = [
    {
      title: "Foundation Phase",
      status: "completed",
      items: [
        "Token smart contract deployment",
        "Basic escrow functionality",
        "ckUSDC integration"
      ],
    },
    {
      title: "Token Economy Phase",
      status: "in-progress",
      items: [
        "Dynamic burn rate implementation",
        "Governance system activation",
        "Staking mechanism deployment"
      ],
    },
    {
      title: "Ecosystem Growth",
      status: "future",
      items: [
        "Cross-chain expansion",
        "Advanced dispute resolution",
        "DAO transition"
      ],
    }
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
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
            Decentralized Collaboration Platform with Dynamic Token Economics
          </Typography>
          <Typography variant="subtitle1">
            Version 2.0 | February 2025
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Abstract
          </Typography>
          <Typography variant="body1" paragraph>
            Odoc introduces a revolutionary token-burning mechanism on the Internet Computer (ICP) blockchain,
            where the amount of tokens burned scales dynamically with transaction values during refunds and disputes.
            This innovative approach, combined with our trust-based governance system, creates a self-regulating
            ecosystem that incentivizes honest collaboration and efficient dispute resolution.
          </Typography>
        </Paper>

        <Typography variant="h4" gutterBottom sx={{ mt: 6, mb: 3 }}>
          Key Features
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card
                sx={{
                  height: '100%',
                  bgcolor: theme.palette.background.paper,
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
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

        <Typography variant="h4" gutterBottom sx={{ mt: 6, mb: 3 }}>
          Token Economics
        </Typography>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom color="primary">
                Token Distribution
              </Typography>
              <List>
                {tokenDistribution.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`${item.category} (${item.percentage}%)`}
                      secondary={item.description}
                      primaryTypographyProps={{ color: "text.primary" }}
                      secondaryTypographyProps={{ color: "text.secondary" }}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom color="primary">
                Token Mechanics
              </Typography>
              <List>
                {tokenMechanics.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={item}
                      primaryTypographyProps={{
                        color: "text.primary",
                        variant: "body2",
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </Paper>

        <Typography variant="h4" gutterBottom sx={{ mt: 6, mb: 3 }}>
          Development Roadmap
        </Typography>
        <Timeline position="alternate">
          {roadmap.map((phase, index) => (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <TimelineDot
                  sx={{
                    bgcolor:
                      phase.status === "completed"
                        ? theme.palette.success.main
                        : phase.status === "in-progress"
                        ? theme.palette.primary.main
                        : theme.palette.grey[500],
                  }}
                />
                {index < roadmap.length - 1 && (
                  <TimelineConnector sx={{ bgcolor: theme.palette.divider }} />
                )}
              </TimelineSeparator>
              <TimelineContent>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  }}
                >
                  <Typography variant="h6" component="h1" color="primary">
                    {phase.title}
                  </Typography>
                  <List dense>
                    {phase.items.map((item, itemIndex) => (
                      <ListItem key={itemIndex}>
                        <ListItemText
                          primary={item}
                          primaryTypographyProps={{ color: "text.primary" }}
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

      <Box
        sx={{
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          py: 4,
          mt: 6,
        }}
      >
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
                  color: "inherit",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
                variant="body2"
              >
                GitHub
              </Typography>
              <Typography
                component={Link}
                to="https://discord.gg/uxMJHBk8"
                sx={{
                  color: "inherit",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
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
          <Divider
            sx={{
              my: 3,
              bgcolor: alpha(theme.palette.primary.contrastText, 0.2),
            }}
          />
          <Typography variant="body2" align="center">
            © 2025 Odoc. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default SNSWhitepaper;
