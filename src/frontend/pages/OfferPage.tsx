import React, { useState, useEffect } from "react";
import {
  styled,
  ThemeProvider,
  createTheme,
  keyframes,
} from "@mui/material/styles";
import { Box, Card, CardContent, Button } from "@mui/material";
import {
  Sparkles,
  Wallet,
  Crown,
  Infinity,
  Timer,
  Shield,
  Rocket,
} from "lucide-react";

// Keyframe Animations
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const shine = keyframes`
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
`;

const glowPulse = keyframes`
  0%, 100% { opacity: 1; filter: brightness(1); }
  50% { opacity: 0.8; filter: brightness(1.2); }
`;

const borderGlow = keyframes`
  0%, 100% { border-color: rgba(139, 92, 246, 0.2); }
  50% { border-color: rgba(139, 92, 246, 0.5); }
`;

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4F46E5",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

const StyledWrapper = styled("div")({
  all: "initial",
  fontFamily: "Inter, -apple-system, sans-serif",
  "*": {
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "1rem",
  position: "relative",
  overflow: "hidden",
  // background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #000000 100%)',
  // '&::before': {
  //   content: '""',
  //   position: 'absolute',
  //   inset: 0,
  //   background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
  //   animation: `${glowPulse} 4s ease-in-out infinite`,
  // },
});

const BackgroundEffect = styled("div")({
  position: "absolute",
  borderRadius: "50%",
  filter: "blur(64px)",
  "&.top": {
    top: "5rem",
    left: "5rem",
    width: "24rem",
    height: "24rem",
    background: "rgba(79, 70, 229, 0.1)",
    animation: `${glowPulse} 2s infinite`,
  },
  "&.bottom": {
    bottom: "-8rem",
    right: "-8rem",
    width: "24rem",
    height: "24rem",
    background: "rgba(124, 58, 237, 0.1)",
    animation: `${glowPulse} 2s infinite 1s`,
  },
});

const MainCard = styled(Card)({
  width: "100%",
  maxWidth: "48rem",
  background: "rgba(17, 24, 39, 0.85) !important",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(139, 92, 246, 0.2)",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  borderRadius: "1rem",
  overflow: "visible",
  animation: `${borderGlow} 2s infinite`,
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)",
    animation: `${shine} 2s linear infinite`,
  },
});

const FloatingBadge = styled("div")({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "0.75rem 1.5rem",
  borderRadius: "9999px",
  background: "linear-gradient(to right, #6B21A8, #3730A3)",
  border: "1px solid rgba(139, 92, 246, 0.3)",
  color: "#E9D5FF",
  marginBottom: "1.5rem",
  animation: `${float} 3s ease-in-out infinite`,
  position: "relative",
  backdropFilter: "blur(10px)",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
    animation: `${shine} 3s linear infinite`,
  },
});

const GlassCard = styled("div")({
  background:
    "linear-gradient(135deg, rgba(76, 29, 149, 0.1), rgba(49, 46, 129, 0.2))",
  backdropFilter: "blur(10px)",
  borderRadius: "0.75rem",
  padding: "1.5rem",
  border: "1px solid rgba(139, 92, 246, 0.2)",
  display: "flex",
  gap: "1rem",
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-4px)",
    background:
      "linear-gradient(135deg, rgba(91, 33, 182, 0.2), rgba(55, 48, 163, 0.3))",
    "&::before": {
      transform: "translateX(100%)",
    },
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
    transform: "translateX(-100%)",
    transition: "transform 0.5s ease",
  },
});

const IconWrapper = styled("div")({
  background:
    "linear-gradient(135deg, rgba(109, 40, 217, 0.4), rgba(79, 70, 229, 0.4))",
  backdropFilter: "blur(10px)",
  padding: "0.75rem",
  borderRadius: "0.5rem",
  color: "#E9D5FF",
  animation: `${glowPulse} 2s ease-in-out infinite`,
  "& svg": {
    width: "1.5rem",
    height: "1.5rem",
  },
});

const StyledButton = styled(Button)({
  position: "relative",
  overflow: "hidden",
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
    transform: "translateX(-100%)",
  },
  "&:hover::after": {
    transform: "translateX(100%)",
    transition: "transform 0.5s ease",
  },
});

const GradientHeading = styled("h1")({
  fontSize: "clamp(2.5rem, 5vw, 4rem)",
  fontWeight: "bold",
  background: "linear-gradient(to right, #E9D5FF, #A5B4FC, #E9D5FF)",
  backgroundSize: "200% auto",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginBottom: "1rem",
  textAlign: "center",
  lineHeight: 1.2,
  animation: `${shine} 3s linear infinite`,
});

// Feature data
const features = [
  {
    icon: <Wallet />,
    title: "Zero Transaction Fees",
    description: "Never pay transaction fees on any of your operations",
  },
  {
    icon: <Crown />,
    title: "Premium Features",
    description: "Access all premium features completely free forever",
  },
  {
    icon: <Infinity />,
    title: "Lifetime Access",
    description: "Your premium benefits never expire",
  },
  {
    icon: <Shield />,
    title: "Early Adopter Status",
    description: "Special benefits for our first 100 users",
  },
];

const FloatingText = styled("div")({
  animation: `${float} 3s ease-in-out infinite`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  "& svg": {
    animation: `${glowPulse} 2s ease-in-out infinite`,
  },
});

// Button animations
const buttonShine = keyframes`
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
`;

const sparkleAnimation = keyframes`
  0% { transform: scale(0) rotate(0deg); opacity: 0; }
  50% { transform: scale(1) rotate(180deg); opacity: 1; }
  100% { transform: scale(0) rotate(360deg); opacity: 0; }
`;

// Golden Button Component
const GoldenButton = styled(Button)(({ theme }) => ({
  position: "relative",
  background: "linear-gradient(90deg, #FFD700, #FFA500, #FFD700)",
  backgroundSize: "200% auto",
  animation: `${buttonShine} 3s linear infinite`,
  color: "#000",
  fontWeight: "bold",
  padding: "1rem 2rem",
  fontSize: "1.25rem",
  borderRadius: "1rem",
  border: "2px solid rgba(255, 215, 0, 0.5)",
  boxShadow: "0 0 20px rgba(255, 215, 0, 0.3)",
  overflow: "visible",
  transition: "all 0.3s ease",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: -4,
    background:
      "linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.4), transparent)",
    animation: `${buttonShine} 2s linear infinite`,
    zIndex: -1,
    borderRadius: "inherit",
  },
  "&:hover": {
    transform: "translateY(-2px) scale(1.02)",
    boxShadow: "0 0 30px rgba(255, 215, 0, 0.5)",
    background: "linear-gradient(90deg, #FFD700, #FFA500, #FFD700)",
    backgroundSize: "200% auto",
  },
}));

// Sparkle Element
const ButtonSparkle = styled("div")({
  position: "absolute",
  width: "4px",
  height: "4px",
  background: "#FFD700",
  borderRadius: "50%",
  pointerEvents: "none",
  animation: `${sparkleAnimation} 1.5s infinite`,
});
const LandingPage = ({ login }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <StyledWrapper>
        <BackgroundEffect className="top" />
        <BackgroundEffect className="bottom" />

        <MainCard>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: "center", mb: 6 }}>
              <FloatingBadge>
                <Timer size={20} />
                <span>Limited Time Offer</span>
              </FloatingBadge>

              <GradientHeading>Join ODoc's Exclusive Launch</GradientHeading>

              <Box
                sx={{
                  color: "#E9D5FF",
                  fontSize: "1.25rem",
                  maxWidth: "36rem",
                  margin: "0 auto",
                }}
              >
                Be among the first 100 users and unlock lifetime premium access
              </Box>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 3,
                mb: 6,
              }}
            >
              {features.map((feature, index) => (
                <GlassCard key={index}>
                  <IconWrapper>{feature.icon}</IconWrapper>
                  <div>
                    <Box
                      sx={{
                        color: "#F3E8FF",
                        fontSize: "1.25rem",
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      {feature.title}
                    </Box>
                    <Box sx={{ color: "#E9D5FF" }}>{feature.description}</Box>
                  </div>
                </GlassCard>
              ))}
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <GlassCard sx={{ mb: 3, display: "block" }}>
                <Box
                  sx={{
                    color: "#F3E8FF",
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    mb: 2,
                  }}
                >
                  To activate premium features:
                </Box>
                <Box
                  component="ol"
                  sx={{
                    color: "#E9D5FF",
                    listStylePosition: "inside",
                    "& > li": { mb: 1 },
                  }}
                >
                  <li>Deposit 100 CKUSDC</li>
                  <li>Make at least one transaction</li>
                  <li>
                    Your lifetime premium access will be automatically activated
                  </li>
                </Box>
              </GlassCard>

              <GoldenButton
                variant="contained"
                size="large"
                onClick={async () => await login()}
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: "1.1rem",
                  bgcolor: "white",
                  color: "#1e1e1e",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  "&:hover": {
                    bgcolor: "#f8fafc",
                  },
                }}
              >
                <Rocket size={20} />
                Join ODOC Today
              </GoldenButton>

              <FloatingText
                sx={{ mt: 3, color: "#A78BFA", fontSize: "0.875rem" }}
              >
                <Sparkles size={16} />
                <span>Limited to first 100 users only</span>
              </FloatingText>
            </Box>
          </CardContent>
        </MainCard>
      </StyledWrapper>
    </ThemeProvider>
  );
};

export default LandingPage;
