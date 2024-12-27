import { common } from "@mui/material/colors";
import { alpha } from "@mui/material/styles";
import { error, primary, info, neutral, success, warning } from "./colors";

export function createPalette(isDarkMode) {
  if (isDarkMode) {
    return {
      action: {
        active: neutral[500],
        disabled: alpha(neutral[100], 0.38),
        disabledBackground: alpha(neutral[100], 0.12),
        focus: alpha(neutral[100], 0.16),
        hover: alpha(neutral[100], 0.04),
        selected: alpha(neutral[100], 0.12),
      },
      background: {
        default: "#0A0A0F",
        paper: "#1A1A23",
        alternate: "#141420"
      },
      divider: "rgba(139, 92, 246, 0.15)",
      error,
      info,
      mode: "dark",
      neutral,
      primary: {
        lightest: "#EDE9FE",
        light: "#C4B5FD",
        main: "#8B5CF6",
        dark: "#6D28D9",
        darkest: "#4C1D95",
        contrastText: "#FFFFFF",
      },
      success,
      text: {
        primary: "#FFFFFF",
        secondary: alpha(common.white, 0.7),
        disabled: alpha(common.white, 0.5),
      },
      warning,
    };
  } else {
    return {
      action: {
        active: neutral[500],
        disabled: alpha(neutral[900], 0.38),
        disabledBackground: alpha(neutral[900], 0.12),
        focus: alpha(neutral[900], 0.16),
        hover: alpha(neutral[900], 0.04),
        selected: alpha(neutral[900], 0.12),
      },
      background: {
        default: "#F9FAFB",
        paper: "#FFFFFF",
        alternate: "#F3F4F6"
      },
      divider: "rgba(79, 70, 229, 0.12)",
      error,
      info,
      mode: "light",
      neutral,
      primary: {
        lightest: "#E3F2F7",
        light: "#AED4E0",
        main: "#19738D",
        dark: "#125867",
        darkest: "#093542",
        contrastText: "#FFFFFF",
      },
      success,
      text: {
        primary: neutral[900],
        secondary: neutral[500],
        disabled: alpha(neutral[900], 0.38),
      },
      warning,
    };
  }
}
