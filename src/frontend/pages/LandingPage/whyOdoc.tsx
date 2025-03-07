import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  useTheme,
  alpha,
  Paper,
  Link,
} from "@mui/material";
import { Clock, Users, Github } from "lucide-react";

interface FeatureCardProps {
  Icon: React.ElementType;
  title: string;
  description: string;
  extraComponent?: React.ReactNode;
}

const FeatureCard = ({
  Icon,
  title,
  description,
  extraComponent,
}: FeatureCardProps) => {
  const theme = useTheme();
  const [hover, setHover] = useState(false);

  return (
    <Paper
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{
        height: "100%",
        background:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.paper, 0.9)
            : alpha(theme.palette.background.paper, 0.9),
        p: 4,
        borderRadius: 2,
        transition: "transform 500ms cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: "50%",
            background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          }}
        >
          <Icon size={32} color="white" />
        </Paper>

        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            mb: 1,
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            color: theme.palette.text.secondary,
            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>

        {extraComponent}
      </Box>
    </Paper>
  );
};

const RepoLink = () => {
  const theme = useTheme();
  return (
    <Link
      href="https://github.com/aliscie/odoc"
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        mt: 2,
        fontSize: "0.9rem",
        color: theme.palette.primary.main,
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        "&:hover": {
          color: theme.palette.primary.dark,
          textDecoration: "underline",
        },
      }}
    >
      Here is our repo →
    </Link>
  );
};

const WhyOdoc: React.FC = () => {
  const theme = useTheme();

  const features = [
    {
      icon: Clock,
      title: "Free, Time, resources",
      description:
        "Save your time and resources with odoc, In addition to Zero transaction fees Odoc Replace three jobs with one platform - handle tasks, payments, and contracts without commissions or middlemen. Streamline your workflow and cut costs instantly.",
    },
    {
      icon: Users,
      title: "Community First",
      description:
        "Join a thriving community of innovators. Vote on platform decisions and collaborate globally to shape the future of decentralized work.",
    },
    {
      icon: Github,
      title: "Open Source & SNS",
      description:
        "Built transparently on Internet Computer Protocol with Service Nervous System governance. Your platform, your voice - true community ownership.",
      extraComponent: <RepoLink />,
    },
  ];

  return (
    <Box
      sx={{
        py: 8,
        background:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.paper, 0.5)
            : alpha(theme.palette.background.paper, 0.5),
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              mb: 2,
            }}
          >
            Why Odoc?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: "800px",
              mx: "auto",
            }}
          >
            Experience the future of decentralized platform with our open-source
            platform
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, 1fr)",
            },
            gap: 4,
          }}
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              Icon={feature.icon}
              title={feature.title}
              description={feature.description}
              extraComponent={feature.extraComponent}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default WhyOdoc;
