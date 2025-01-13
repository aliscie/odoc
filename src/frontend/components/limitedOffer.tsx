import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Gift } from "lucide-react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Paper,
  Slide,
  styled,
  LinearProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useBackendContext } from "../contexts/BackendContext";

// Styled Components
const GradientPaper = styled(Paper)(({ theme }) => ({
  background: "linear-gradient(90deg, #7c3aed, #3b82f6, #7c3aed)",
  color: "#fff",
  padding: theme.spacing(2, 4),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  maxWidth: "960px",
  width: "100%",
  margin: theme.spacing(1),
  borderRadius: theme.spacing(2),
  border: "1px solid rgba(255, 255, 255, 0.2)",
  backdropFilter: "blur(8px)",
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.2)",
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: theme.spacing(3),
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const DigitContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  height: "1.5em",
  width: "0.8em",
  overflow: "hidden",
  display: "inline-block",
  backgroundColor: "rgba(0, 0, 0, 0.2)",
  borderRadius: "4px",
  margin: "0 1px",
}));

const NumberStrip = styled(Box)({
  position: "absolute",
  width: "100%",
  transition: "transform 300ms ease-in-out",
});

const DigitBox = styled(Box)({
  height: "1.5em",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "monospace",
  fontWeight: "bold",
  color: "white",
});

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: theme.spacing(4),
  right: theme.spacing(4),
  height: '2px',
  marginBottom: theme.spacing(1),
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: theme.spacing(0.5),
  '& .MuiLinearProgress-bar': {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: theme.spacing(0.5),
  },
}));

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error in PromoNotification:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null; // Silently fail if there's an error
    }

    return this.props.children;
  }
}

// Digit Component
const Digit = ({ value }: { value: number }) => {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const itemHeight = 24;
  const offset = -value * itemHeight;

  return (
    <DigitContainer>
      <NumberStrip style={{ transform: `translateY(${offset}px)` }}>
        {numbers.map((num) => (
          <DigitBox key={num}>{num}</DigitBox>
        ))}
      </NumberStrip>
    </DigitContainer>
  );
};

// CountUp Component
const CountUp = ({ endValue = 0 }: { endValue: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 25;
    const interval = duration / steps;

    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev >= endValue) {
          clearInterval(timer);
          return endValue;
        }
        const increment = Math.max(1, Math.ceil((endValue - prev) / 8));
        return Math.min(prev + increment, endValue);
      });
    }, interval);

    return () => clearInterval(timer);
  }, [endValue]);

  const digits = count.toString().padStart(3, "0").split("").map(Number);

  return (
    <Box component="span" sx={{ display: "inline-flex", alignItems: "center", mx: 0.5 }}>
      {digits.map((digit, index) => (
        <Digit key={index} value={digit} />
      ))}
    </Box>
  );
};

// Main Component
const PromoNotification: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [userCount, setUserCount] = useState<number>(0);
  const [startCounter, setStartCounter] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(100);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const remainingTimeRef = useRef<number>(15000);

  const { isLoggedIn } = useSelector((state: any) => state.uiState);
  const navigate = useNavigate();
  const location = useLocation();
  const isOfferPage = location.pathname === "/offer";
  const { backendActor } = useBackendContext();

  useEffect(() => {
    const fetchUserCount = async () => {
      if (backendActor) {
        try {
          const users = await backendActor?.get_users();
          setUserCount(Number(users));
          setStartCounter(true);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      }
    };

    fetchUserCount();
  }, [backendActor]);

  useEffect(() => {
    if (isLoggedIn) {
      setIsVisible(false);
      return;
    }

    const startTimer = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      startTimeRef.current = Date.now();

      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const remaining = remainingTimeRef.current - elapsed;
        const newProgress = (remaining / 15000) * 100;

        if (remaining <= 0) {
          setIsVisible(false);
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
        } else {
          setProgress(Math.max(0, newProgress));
        }
      }, 100);
    };

    if (!isHovering && isVisible) {
      startTimer();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isLoggedIn, isHovering, isVisible]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      remainingTimeRef.current = (progress / 100) * 15000;
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleClick = () => {
    navigate("/offer");
    setIsVisible(false);
  };

  if (!isVisible || isLoggedIn) return null;

  return (
    <ErrorBoundary>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          display: "flex",
          justifyContent: "center",
          mt: 0,
        }}
      >
        <Slide
          direction="down"
          in={0 < userCount && userCount <= 100 && isVisible}
          mountOnEnter
          unmountOnExit
        >
          <GradientPaper
            elevation={4}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            sx={{ position: 'relative' }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconWrapper>
                <Gift color="#fff" size={24} />
              </IconWrapper>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 0.5 }}>
                  🎉 Limited Time Offer!{" "}
                  <Typography component="span" sx={{ fontWeight: "bold", display: "inline-block" }}>
                    {startCounter ? <CountUp endValue={userCount} /> : "0"} seats already taken
                  </Typography>
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Only 100 seats available. Book your seat now for{" "}
                  <Box component="span" sx={{ fontWeight: "bold" }}>
                    FREE lifetime access
                  </Box>{" "}
                  to oDoc Premium
                  {!isOfferPage && (
                    <>
                      {" - "}
                      <Button
                        sx={{
                          color: "white",
                          textDecoration: "underline",
                          textTransform: "none",
                          padding: "0 4px",
                          minWidth: "auto",
                          "&:hover": {
                            backgroundColor: "transparent",
                            opacity: 0.8,
                          },
                        }}
                        onClick={handleClick}
                      >
                        click here
                      </Button>
                    </>
                  )}
                </Typography>
              </Box>
            </Box>
            <IconButton
              size="small"
              onClick={() => setIsVisible(false)}
              sx={{
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
            <ProgressBar
              variant="determinate"
              value={progress}
            />
          </GradientPaper>
        </Slide>
      </Box>
    </ErrorBoundary>
  );
};

export default PromoNotification;
