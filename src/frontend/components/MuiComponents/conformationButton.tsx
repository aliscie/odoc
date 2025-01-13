import { Button, Typography, Paper, Box } from "@mui/material";
import { useState } from "react";
import LoaderButton from "./LoaderButton";
import WarningIcon from "@mui/icons-material/Warning";

function ConformationMessage({
  children,
  conformationMessage,
  onClick,
  message,
  color = "primary",
}) {
  const [state, setState] = useState(false);

  if (!state) {
    return (
      <Button
        color={color}
        variant="contained"
        onClick={() => setState(true)}
        size="small"
        sx={{
          maxWidth: { sm: "auto" },
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          width: "100%",
        }}
      >
        {children}
      </Button>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 400,
        mx: "auto",
        p: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 2,
          mb: 3,
        }}
      >
        <WarningIcon color="warning" />
        <Typography variant="body1" color="text.secondary">
          {conformationMessage}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          bgcolor: "background.default",
          pt: 2,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Button
          variant="outlined"
          onClick={() => setState(false)}
          size="small"
          sx={{ minWidth: 100 }}
        >
          No
        </Button>
        <LoaderButton
          onClick={onClick}
          color={color}
          size="small"
          sx={{ minWidth: 100 }}
        >
          {message}
        </LoaderButton>
      </Box>
    </Paper>
  );
}

export default ConformationMessage;
