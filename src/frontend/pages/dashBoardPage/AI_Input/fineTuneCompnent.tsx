import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  createTheme,
  CssBaseline,
  Paper,
  TextField,
  ThemeProvider,
  Typography,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import fineTuneGemeni from "./fineTuneGemeni";
import { LoadingButton } from "@mui/lab";
import LoaderButton from "../../../components/MuiComponents/LoaderButton";
// import { logger } from "../../../DevUtils/logData";

// Types
interface JsonEditorProps {
  initialValue?: string;
}

// Utility Functions
const isValidJson = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

// Theme Configuration
const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#dc004e",
      },
    },
  });

// JSON Editor Component
const JsonEditor: React.FC<JsonEditorProps> = () => {
  const dispatch = useDispatch();
  const { training_data } = useSelector((state: any) => state.calendarState);
  console.log({ training_data });
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  const handleJsonChange = (value: string) => {
    dispatch({
      type: "SET_TRAINING_DATA",
      training_data: {
        output: JSON.parse(JSON.stringify(value)),
      },
    });
    if (value.trim() === "") {
      setError(null);
      return;
    }

    if (!isValidJson(value)) {
      setError("Invalid JSON format");
      return;
    }

    setError(null);
    try {
    } catch (e) {
      setError("Error updating training data");
    }
  };

  const handleTuning = async () => {
    // logger({ training_data });
    await fineTuneGemeni(training_data);
    return { Ok: "" };
  };

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <TextField
        fullWidth
        multiline
        rows={15}
        defaultValue={JSON.stringify(training_data?.output, null, 2)}
        onChange={(e) => handleJsonChange(e.target.value)}
        error={!!error}
        variant="outlined"
        sx={{
          "& .MuiInputBase-root": {
            fontFamily: "monospace",
            fontSize: "0.9rem",
          },
        }}
      />
      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <LoaderButton
          variant="contained"
          onClick={handleTuning}
          disabled={!training_data?.output}
          sx={{ ml: 1 }}
        >
          FINE-TUNE
        </LoaderButton>
      </Box>
    </Box>
  );
};

// Main Container Component
const JsonEditorContainer: React.FC<JsonEditorProps> = () => {
  const theme = useTheme();
  const { training_data } = useSelector((state: any) => state.calendarState);

  useEffect(() => {
    if (training_data?.output) {
      // Handle initial data if needed
    }
  }, [training_data]);

  return (
    <Container maxWidth="lg">
      {/*<CalendarExample />*/}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 4,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Edit Training Data Output
        </Typography>

        <JsonEditor />
      </Paper>
    </Container>
  );
};

// Theme-Wrapped Export
export const ThemedJsonEditor: React.FC<JsonEditorProps> = () => {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const theme = React.useMemo(() => getTheme(mode), [mode]);

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    setMode(prefersDark ? "dark" : "light");
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <JsonEditorContainer />
    </ThemeProvider>
  );
};

export default ThemedJsonEditor;
