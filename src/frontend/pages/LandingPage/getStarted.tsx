import React from "react";
import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckIcon from "@mui/icons-material/Check";

const steps = [
  <>
    After you login, go to the{" "}
    <Link
      style={{
        color: "lightblue",
        textDecoration: "underline",
      }}
      type={"text"}
      to={"./Discover"}
    >
      Discover
    </Link>{" "}
    page
  </>,
  "Create a new post about yourself",
  "Check other people's posts and visit their profiles",
  "Send someone a friend request",
  "Create a new document from the side bar",
  <>
    Create a new contract from{" "}
    <Link
      style={{
        color: "lightblue",
        textDecoration: "underline",
      }}
      type={"text"}
      to={"./Contracts"}
    >
      Contracts
    </Link>{" "}
    page, or inside any document
  </>,
];

const StepGuide: React.FC = () => {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ width: "100%" }}>
        <Typography variant="body" align="center">
          What todo now
        </Typography>
      </Box>

      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      {activeStep === steps.length ? (
        <Box sx={{ mt: 2 }}>
          <Typography>All steps completed!</Typography>
          <Button onClick={handleReset} sx={{ mt: 1 }}>
            Reset
          </Button>
        </Box>
      ) : (
        <Box sx={{ mt: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              pt: 2,
            }}
          >
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              <ArrowBackIcon />
            </Button>
            <Button variant="contained" onClick={handleNext}>
              {activeStep === steps.length - 1 ? (
                <CheckIcon />
              ) : (
                <ArrowForwardIcon />
              )}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default StepGuide;
