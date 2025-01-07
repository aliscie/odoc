import React from 'react';
import { Clock, LeafyGreen, Globe2, Shield, Users, TrendingUp } from 'lucide-react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Paper,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";

interface FeatureCardProps {
  Icon: React.ElementType;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ Icon, title, description }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: '24rem',
        width: '18rem',
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`
          : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
        backdropFilter: 'blur(8px)',
        transition: 'all 0.3s ease',
        '&:hover': {
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.secondary.main, 0.2)})`
            : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
        },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(4),
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          borderRadius: '50%',
          padding: theme.spacing(2),
          marginBottom: theme.spacing(3),
          boxShadow: theme.shadows[2],
        }}
      >
        <Icon
          size={40}
          color="white"
          strokeWidth={1.5}
        />
      </Paper>
      <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
        <Typography
          variant="h5"
          component="h3"
          gutterBottom
          color="text.primary"
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            opacity: 0.8,
            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const WhyOdoc: React.FC = () => {
  const theme = useTheme();

  const features = [
    {
      icon: Clock,
      title: "SAVE TIME",
      description: "All-in-One Solution, Integrate tasks, payments, and contracts in one seamless platform.",
    },
    {
      icon: LeafyGreen,
      title: "SAVE RESOURCES",
      description: "Enjoy simple, transparent pricing with no hidden fees or middlemen.",
    },
    {
      icon: Globe2,
      title: "FREEDOM",
      description: "Work remotely, collaborate globally, and manage your business from anywhere. And the best part you can vote.",
    },
    {
      icon: Shield,
      title: "SECURITY",
      description: "Enterprise-grade security for your data and payments.",
    },
    {
      icon: Users,
      title: "EMPOWER YOU",
      description: "Enhance productivity and foster better teamwork with seamless collaboration.",
    },
    {
      icon: TrendingUp,
      title: "SCALE",
      description: "Tools that grow with your business, from freelancer to enterprise.",
    },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        py: 10,
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(to bottom, #212121, #000000)'
          : `linear-gradient(to bottom, ${alpha(theme.palette.primary.main, 0.03)}, ${alpha(theme.palette.background.default, 1)})`,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            sx={{
              color: 'text.primary',
              fontWeight: 'bold',
              mb: 2,
            }}
          >
            Why Choose oDoc?
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{
              maxWidth: '800px',
              mx: 'auto',
              opacity: 0.8,
            }}
          >
            Experience the future of work with our comprehensive platform designed for modern businesses
          </Typography>
        </Box>

        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              display: 'flex',
              overflowX: 'auto',
              gap: 3,
              pb: 3,
              scrollSnapType: 'x mandatory',
              '&::-webkit-scrollbar': {
                display: 'none'
              },
              '-ms-overflow-style': 'none',
              'scrollbarWidth': 'none',
            }}
          >
            {features.map((feature, index) => (
              <Box key={index} sx={{ scrollSnapAlign: 'start' }}>
                <FeatureCard
                  Icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </Box>
            ))}
          </Box>

          {/* Gradient fade effects */}
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: theme => theme.spacing(3),
              width: '80px',
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(to right, #000000, transparent)'
                : `linear-gradient(to right, ${theme.palette.background.default}, transparent)`,
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: theme => theme.spacing(3),
              width: '80px',
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(to left, #000000, transparent)'
                : `linear-gradient(to left, ${theme.palette.background.default}, transparent)`,
              pointerEvents: 'none',
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default WhyOdoc;
