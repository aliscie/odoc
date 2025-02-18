import React, { useState, useCallback } from "react";
import {
  Box,
  Fab,
  Slide,
  Paper,
  IconButton,
  useTheme,
  styled,
  Typography,
  Zoom,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TuneIcon from "@mui/icons-material/Tune";
import ThemedFineTuneComponent from "./fineTuneCompnent";

// Styled Components
const FloatingContainer = styled(Box)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  zIndex: 1000,
}));

const ChatBox = styled(Paper)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(9),
  right: theme.spacing(3),
  width: "100%",
  height: "600px",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    height: "100%",
    bottom: 0,
    right: 0,
  },
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  flexShrink: 0, // Prevent header from shrinking
}));

const ChatContent = styled(Box)({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  minHeight: 0, // Important for nested flex scrolling
  overflow: "hidden", // Hide overflow at container level
});

const ScrollableContent = styled(Box)({
  flex: 1,
  overflow: "auto", // Enable scrolling here
  padding: "16px",
  '& > *': {
    marginBottom: '16px', // Add spacing between children
  },
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '4px',
    '&:hover': {
      background: '#555',
    },
  },
});

// Main Component
export const FloatingFineTune = () => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClickOutside = useCallback(
    (event) => {
      if (event.target === event.currentTarget) {
        setIsOpen(false);
      }
    },
    [],
  );

  return (
    <>
      {isOpen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
            display: { xs: "block", sm: "none" },
          }}
          onClick={handleClickOutside}
        />
      )}

      <FloatingContainer>
        <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
          <ChatBox elevation={4}>
            <ChatHeader>
              <Typography variant="h6" component="div">
                Fine-Tune Model
              </Typography>
              <IconButton
                size="small"
                onClick={handleToggle}
                sx={{ color: "inherit" }}
              >
                <CloseIcon />
              </IconButton>
            </ChatHeader>

            <ChatContent>
              <ScrollableContent>
                <ThemedFineTuneComponent />
              </ScrollableContent>
            </ChatContent>
          </ChatBox>
        </Slide>

        <Zoom in={!isOpen}>
          <Fab
            color="primary"
            onClick={handleToggle}
            sx={{
              position: "fixed",
              bottom: theme.spacing(3),
              right: theme.spacing(3),
              transition: theme.transitions.create(["transform", "box-shadow"]),
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
          >
            <TuneIcon />
          </Fab>
        </Zoom>
      </FloatingContainer>
    </>
  );
};

// Animation Wrapper
// const AnimatedFloatingFineTune = () => {
//   return (
//     <Box sx={{ zIndex: 1000 }}>
//       <FloatingFineTune />
//     </Box>
//   );
// };

export default FloatingFineTune;
