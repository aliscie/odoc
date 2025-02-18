import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Paper,
  Container,
  useTheme,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Alert,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import fineTuneGemeni from "./fineTuneGemeni";
import { logger } from "../../../DevUtils/logData";

import React from "react";

const CalendarExample = () => {
  const sampleCalendar = {
    id: "cal_123",
    owner: "user_456",
    events: [
      {
        id: "evt_789",
        title: "Team Meeting",
        description: "Weekly sync meeting",
        created_by: "user_456",
        end_time: 1708444800,
        start_time: 1708441200,
        attendees: ["user_123", "user_456"],
      },
    ],
    availabilities: [
      {
        id: "avl_101",
        title: "Office Hours",
        schedule_type: {
          WeeklyRecurring: {
            days: [1, 2, 3, 4, 5],
            valid_until: 1709664000,
          },
        },
        time_slots: [
          {
            end_time: BigInt(1708444800),
            start_time: BigInt(1708441200),
          },
        ],
      },
    ],
    blocked_times: [
      {
        id: "blk_202",
        block_type: {
          SingleBlock: {
            end_time: 1708531200,
            start_time: 1708527600,
          },
        },
        reason: "Lunch Break",
      },
    ],
  };

  const formatTime = (timestamp: number | bigint): string => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (timestamp: number | bigint): string => {
    const date = new Date(Number(timestamp) * 1000);
    return date
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\//g, "-");
  };

  const isTimestamp = (key: string, value: any): boolean => {
    return (
      (typeof value === "number" || typeof value === "bigint") &&
      (key.includes("time") || key.includes("date") || key === "valid_until")
    );
  };

  const getColor = (key: string) => {
    const colors: { [key: string]: string } = {
      id: "text-blue-500",
      title: "text-green-500",
      description: "text-purple-500",
      owner: "text-yellow-600",
      events: "text-red-500",
      availabilities: "text-indigo-500",
      blocked_times: "text-orange-500",
      default: "text-gray-300",
    };
    return colors[key] || colors.default;
  };

  const renderTimestamp = (key: string, value: number | bigint) => {
    if (key.includes("time")) {
      return (
        <span className="text-blue-400">&quot;{formatTime(value)}&quot;</span>
      );
    }
    return (
      <span className="text-blue-400">&quot;{formatDate(value)}&quot;</span>
    );
  };

  const renderValue = (value: any, key: string = ""): JSX.Element => {
    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        return (
          <div className="ml-4">
            [
            <div className="ml-4">
              {value.map((item, index) => (
                <div key={index}>
                  {renderValue(item, key)}
                  {index < value.length - 1 && ","}
                </div>
              ))}
            </div>
            ]
          </div>
        );
      }
      return (
        <div className="ml-4">
          {"{"}
          <div className="ml-4">
            {Object.entries(value).map(([k, v], index, arr) => (
              <div key={k}>
                <span className={getColor(k)}>&quot;{k}&quot;</span>:{" "}
                {renderValue(v, k)}
                {index < arr.length - 1 && ","}
              </div>
            ))}
          </div>
          {"}"}
        </div>
      );
    }
    if (isTimestamp(key, value)) {
      return renderTimestamp(key, value);
    }
    if (typeof value === "string") {
      return <span className="text-green-400">&quot;{value}&quot;</span>;
    }
    if (typeof value === "number" || typeof value === "bigint") {
      return <span className="text-blue-400">{value.toString()}</span>;
    }
    return <span className="text-gray-400">{JSON.stringify(value)}</span>;
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg font-mono text-sm overflow-auto max-h-screen">
      <div className="whitespace-pre">{renderValue(sampleCalendar)}</div>
    </div>
  );
};

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
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  const handleJsonChange = (value: string) => {
    console.log({ value });
    dispatch({
      type: "SET_TRAINING_DATA",
      training_data: {
        output: JSON.parse(value),
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
    logger({ training_data });
    await fineTuneGemeni(training_data);
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
        <Button
          variant="contained"
          onClick={handleTuning}
          disabled={!training_data?.output}
          sx={{ ml: 1 }}
        >
          FINE-TUNE
        </Button>
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
