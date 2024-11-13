import React from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Typography,
  Box,
  Button,
  Link,
} from "@mui/material";

const steps = [
  <>
    After you login, go to the <Link href={"./discover"}>Discover</Link> page
  </>,
  "Create a new post about yourself",
  "Check other people's posts and visit their profiles",
  "Send someone a friend request",
  "Create a new document",
  "Create a new contract",
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
      <Typography variant="h5" align="center">
        What todo now
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length ? (
        <Box sx={{ mt: 2 }}>
          <Typography>All steps completed!</Typography>
          <Button onClick={handleReset} sx={{ mt: 1 }}>
            Reset
          </Button>
        </Box>
      ) : (
        <Box sx={{ mt: 2 }}>
          <Typography>{steps[activeStep]}</Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Button variant="contained" onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default StepGuide;
