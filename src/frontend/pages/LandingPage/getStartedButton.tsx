import ArrowForward from "@mui/icons-material/ArrowForward";
import { Link as DomLink } from "react-router-dom";
import {
  Button,
  Tooltip,
  Box,
  keyframes,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import { useSelector } from "react-redux";
import { useBackendContext } from "../../contexts/BackendContext";
import { ClickAwayListener } from "@mui/base";
import { Z_INDEX_SIDE_NAVBAR } from "../../constants/zIndex";

const shineAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const AttractiveButton = {
  px: 4,
  py: 2,
  fontSize: "1.1rem",
  position: "relative",
  overflow: "hidden",
  background: "rgba(255, 172, 23, 0.9)",
  color: "black",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "200%",
    height: "100%",
    background: `linear-gradient(
                  to right,
                  transparent 0%,
                  rgba(255, 255, 255, 0.4) 50%,
                  transparent 100%
                )`,
    animation: `${shineAnimation} 3s infinite linear`,
  },
  "&:hover": {
    background: "rgba(255, 71, 71, 0.9)",
    transform: "translateY(-2px)",
    transition: "all 0.3s ease",
  },
  animation: "float 3s ease-in-out infinite",
  "@keyframes float": {
    "0%": { transform: "translateY(0px)" },
    "50%": { transform: "translateY(-10px)" },
    "100%": { transform: "translateY(0px)" },
  },
};

function GetStartedButton() {
  const { all_friends, profile, wallet, inited } = useSelector(
    (state: any) => state.filesState,
  );
  const { login } = useBackendContext();
  const { isLoggedIn } = useSelector((state: any) => state.uiState);
  const [showTooltip, setShowTooltip] = useState(false);
  useEffect(()=>{
    setTimeout(() => setShowTooltip(true), 1500);
  },[profile])

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const PopperProps = {
    sx: {
      zIndex: Z_INDEX_SIDE_NAVBAR - 1,
      "& .MuiTooltip-tooltip": {
        maxWidth: "none",
        width: isMobile ? "calc(100vw - 32px)" : "500px",
        background:
          theme.palette.mode === "dark"
            ? "rgba(255, 172, 23, 0.8)"
            : "rgba(255, 172, 23, 0.9)",
        backdropFilter: "blur(10px)",
        border: 0,
        p: 1,
      },
      "& .MuiTooltip-arrow": {
        color:
          theme.palette.mode === "dark"
            ? "rgba(255, 172, 23, 0.8)"
            : "rgba(255, 172, 23, 0.9)",
      },
    },
  };

  const TooltipContent = ({ videoId }: { videoId: string }) => (
    <Box
      sx={{
        width: "100%",
        height: isMobile ? "180px" : "250px",
      }}
    >
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="Tutorial"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        style={{ borderRadius: "8px" }}
        allowFullScreen
      />
    </Box>
  );

  // Not registered state
  if (!profile && isLoggedIn) {
    return (
      <Button
        variant="contained"
        size="large"
        endIcon={<ArrowForward />}
        sx={{
          px: 4,
          py: 2,
          fontSize: "1.1rem",
          bgcolor: "#ffac17",
          "&:hover": {
            bgcolor: "#ff4747",
          },
        }}
        onClick={() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
      >
        Make sure to register
      </Button>
    );
  }

  // No friends state
  if (
    isLoggedIn &&
    profile?.id &&
    all_friends.filter((f) => f.id !== profile?.id).length === 0
  ) {
    return (
      <ClickAwayListener onClickAway={() => setShowTooltip(false)}>
        <Box onMouseEnter={() => setShowTooltip(true)}>
          <Tooltip
            open={showTooltip}
            arrow
            placement="top"
            PopperProps={PopperProps}
            title={<TooltipContent videoId="f0RVw6RJxos" />}
          >
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              component={DomLink}
              to="/discover"
              sx={AttractiveButton}
            >
              Make your first friend
            </Button>
          </Tooltip>
        </Box>
      </ClickAwayListener>
    );
  }

  // No payments state
  if (isLoggedIn && profile?.id && wallet.exchanges.length === 0) {
    return (
      <ClickAwayListener onClickAway={() => setShowTooltip(false)}>
        <Box onMouseEnter={() => setShowTooltip(true)}>
          <Tooltip
            open={showTooltip}
            arrow
            placement="top"
            PopperProps={PopperProps}
            title={<TooltipContent videoId="XnOF1i1Een8" />}
          >
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              component={DomLink}
              to="/contracts"
              sx={AttractiveButton}
            >
              Make your first payment
            </Button>
          </Tooltip>
        </Box>
      </ClickAwayListener>
    );
  }

  // Default state - Not logged in
  if (!isLoggedIn) {
    return (
      <ClickAwayListener onClickAway={() => setShowTooltip(false)}>
        <Box onMouseEnter={() => setShowTooltip(true)}>
          <Tooltip
            open={showTooltip}
            arrow
            placement="top"
            PopperProps={PopperProps}
            title={<TooltipContent videoId="Lg-0q5oEenk" />}
          >
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={AttractiveButton}
              onClick={async () => await login()}
            >
              Get Started
            </Button>
          </Tooltip>
        </Box>
      </ClickAwayListener>
    );
  }

  return <></>;
}

export default GetStartedButton;
