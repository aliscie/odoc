import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tooltip,
  styled,
} from "@mui/material";
import { CheckCircle, Warning } from "@mui/icons-material";
import GetStartedButton from "./LandingPage/getStartedButton";

// Custom styled components
const GradientCard = styled(Card)(({ theme, variant }) => ({
  height: "100%",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-8px)",
  },
  ...(variant === "premium" && {
    // Use theme-aware background color
    background:
      theme.palette.mode === "dark"
        ? `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`
        : "linear-gradient(145deg, #ffffff 0%, #f5f7ff 100%)",
    // Use theme-aware border color
    border: `2px solid ${theme.palette.mode === "dark" ? theme.palette.warning.dark : "#ffd700"}`,
    // Use theme-aware box shadow
    boxShadow:
      theme.palette.mode === "dark"
        ? `0 8px 16px -4px ${theme.palette.background.default}`
        : theme.shadows[10],
  }),
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #ffd700 30%, #ffeb3b 90%)",
  border: 0,
  borderRadius: 3,
  boxShadow: "0 3px 5px 2px rgba(255, 215, 0, .3)",
  // Change from white to a dark color
  color: theme.palette.common.black, // or you could use "#000000" or "#333333"
  padding: "8px 30px",
  "&:hover": {
    background: "linear-gradient(45deg, #ffeb3b 30%, #ffd700 90%)",
  },
  // Style for disabled state to maintain readability
  "&.Mui-disabled": {
    color: "rgba(0, 0, 0, 0.7)", // slightly faded black for disabled state
  },
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: "100%",
  "&:hover": {
    boxShadow: theme.shadows[4],
  },
}));

const SubscriptionPlans = () => {
  const coreServices = [
    {
      title: "Contract Creation and Management",
      features: [
        "Easy-to-use templates for drafting professional contracts",
        "Customizable options to suit various industries and agreements",
        "Legally binding contracts with secure storage",
      ],
    },
    {
      title: "Task Assignment and Collaboration",
      features: [
        "Assign and manage tasks within contracts or projects",
        "Integrated tools for seamless team collaboration",
      ],
    },
    {
      title: "Payment Integration",
      features: [
        "Tools to manage payments directly within the platform",
        "Payment tracking for milestones or deliverables",
        "Support for various payment gateways",
      ],
    },
    {
      title: "Workspaces for Categorization",
      features: [
        "Organize projects, files, and contracts into specific workspaces",
        "Enhanced workflow efficiency for teams and individuals",
      ],
    },
  ];

  const valueFeatures = [
    {
      title: "Success Rate Display",
      features: ["Metrics to showcase user performance and reliability"],
    },
    {
      title: "Group Chats and Communication",
      features: [
        "Built-in chat for contract discussions and task updates",
        "Real-time communication for better collaboration",
      ],
    },
    {
      title: "Introductory Guides for New Users",
      features: ["Tutorials and help pages to onboard users quickly"],
    },
    {
      title: "File Management and Pagination",
      features: ["Efficient organization and pagination for files and lists"],
    },
    {
      title: "Custom Domain Setup",
      features: ["Option to use a custom domain for businesses"],
    },
    {
      title: "Freelancer and Digital Nomad Focus",
      features: [
        "Tailored tools for remote workers, including tax-free pricing and global access",
      ],
    },
  ];

  const whyChooseUs = [
    " Platform: Contracts, tasks, and payments in one place",
    "Global Reach: Available in all countries, ensuring accessibility",
    "Cost Efficiency: Saves time and money by simplifying workflows",
    "Transparent Pricing: Premium tools for $14/month",
    "Secure and Reliable: Ensures data protection and legal compliance",
  ];

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "Contract Creation and Management",
        "Task Assignment and Collaboration",
        "Basic Payment Integration",
        "Workspaces for Categorization",
        "Success Rate Display",
        "Basic Group Chats",
        "Introductory Guides",
      ],
      description: "Perfect for individuals starting their journey",
      buttonText: <GetStartedButton />,
    },
    {
      name: "Premium",
      price: "$14",
      period: "per month",
      features: [
        "Everything in Free plan",
        "AI-Powered Presentations",
        "AI Grammar Correction",
        "Custom Views",
        "Advanced File Management",
        "Priority Support",
      ],
      description: "Ideal for growing professionals",
      buttonText: "Upgrade Now",
      variant: "premium",
    },
    {
      name: "Advanced Client",
      price: "Custom",
      period: "contact us",
      features: [
        "Everything in Premium plan",
        "Custom Feature Development",
        "White-label Solutions",
        "API Access",
        "Advanced Analytics",
        "SLA Guarantees",
      ],
      description: "For enterprises requiring tailored solutions",
      buttonText: "Contact Sales",
      variant: "premium",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Core Services Section */}
      <Typography variant="h3" component="h2" gutterBottom>
        Core Services
      </Typography>
      <Grid container spacing={4} sx={{ mb: 8 }}>
        {coreServices.map((service, index) => (
          <Grid item xs={12} md={6} key={index}>
            <FeatureCard>
              <Typography variant="h5" gutterBottom>
                {index + 1}. {service.title}
              </Typography>
              <List>
                {service.features.map((feature, i) => (
                  <ListItem key={i}>
                    <ListItemIcon>
                      <CheckCircle color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
            </FeatureCard>
          </Grid>
        ))}
      </Grid>

      {/* Pricing Plans Section */}
      <Typography
        variant="h3"
        component="h2"
        align="center"
        gutterBottom
        sx={{ mb: 6 }}
      >
        Choose Your Plan
      </Typography>
      <Grid container spacing={4}>
        {plans.map((plan) => (
          <Grid item xs={12} md={4} key={plan.name}>
            <GradientCard variant={plan.variant}>
              <CardContent>
                <Typography variant="h4" align="center" gutterBottom>
                  {plan.name}
                </Typography>
                <Typography variant="h3" align="center" gutterBottom>
                  {plan.price}
                </Typography>
                <Typography
                  variant="subtitle1"
                  align="center"
                  color="text.secondary"
                  gutterBottom
                >
                  {plan.period}
                </Typography>
                <Typography variant="body1" align="center" paragraph>
                  {plan.description}
                </Typography>
                <List>
                  {plan.features.map((feature) => (
                    <ListItem key={feature}>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
                {plan.name === "Free" ? (
                  plan.buttonText
                ) : (
                  <Tooltip
                    title={
                      <Typography color="error">
                        This option is not available now. We will upgrade our system in the next 3 months.
                      </Typography>
                    }
                    arrow
                  >
                    <Box width="100%">
                      <GradientButton
                        fullWidth
                        size="large"
                        sx={{ mt: 2 }}
                        disabled
                        endIcon={<Warning />}
                      >
                        {plan.buttonText}
                      </GradientButton>
                    </Box>
                  </Tooltip>
                )}
              </CardContent>
            </GradientCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SubscriptionPlans;
