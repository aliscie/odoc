const useCalendarStyles = (isDark) => ({
  ".rbc-calendar": {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    border: "none",
    backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
  },
  ".rbc-header": {
    padding: "8px 4px",
    fontWeight: "500",
    fontSize: "0.9rem",
    backgroundColor: isDark ? "#2d2d2d" : "#f8f9fa",
    color: isDark ? "#ffffff" : "#1a1a1a",
    borderBottom: isDark
      ? "1px solid rgba(255, 255, 255, 0.08)"
      : "1px solid rgba(0, 0, 0, 0.08)",
    height: "36px",
    "& span": {
      display: "block",
      textAlign: "center",
    },
  },
  ".rbc-header + .rbc-header": {
    borderLeft: isDark
      ? "1px solid rgba(255, 255, 255, 0.08)"
      : "1px solid rgba(0, 0, 0, 0.08)",
  },
  ".rbc-time-view": {
    border: isDark
      ? "1px solid rgba(255, 255, 255, 0.08)"
      : "1px solid rgba(0, 0, 0, 0.08)",
    borderRadius: "12px",
    overflow: "hidden",
    backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
  },
  ".rbc-time-header": {
    backgroundColor: isDark ? "#2d2d2d" : "#f8f9fa",
    borderBottom: isDark
      ? "2px solid rgba(255, 255, 255, 0.12)"
      : "2px solid rgba(0, 0, 0, 0.12)",
  },
  ".rbc-time-content": {
    border: "none",
    "& > * + * > *": {
      borderLeft: isDark
        ? "1px solid rgba(255, 255, 255, 0.08)"
        : "1px solid rgba(0, 0, 0, 0.08)",
    },
  },
  ".rbc-timeslot-group": {
    borderBottom: "none",
    minHeight: "80px",
  },
  ".rbc-time-content > * + * > *": {
    borderLeft: isDark
      ? "1px solid rgba(255, 255, 255, 0.04)"
      : "1px solid rgba(0, 0, 0, 0.08)",
  },
  ".rbc-time-gutter": {
    color: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
    fontSize: "0.85rem",
    fontWeight: "500",
    padding: "0 12px",
  },
  ".rbc-time-slot": {
    color: isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
  },
  ".rbc-event": {
    padding: "6px 8px",
    fontSize: "0.9rem",
    fontWeight: "500",
    border: "none",
    borderRadius: "6px",
    backgroundColor: isDark ? "#5856D6" : "#4845d6",
    boxShadow: isDark
      ? "0 2px 4px rgba(0, 0, 0, 0.2)"
      : "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "translateY(-1px)",
      boxShadow: isDark
        ? "0 4px 8px rgba(0, 0, 0, 0.3)"
        : "0 4px 8px rgba(0, 0, 0, 0.15)",
    },
  },
  ".rbc-today": {
    backgroundColor: isDark ? "#2C1F2D" : "#FFE5E5",
  },
  ".rbc-time-header-cell.rbc-today": {
    backgroundColor: isDark ? "#3D2B3D" : "#FFD6D6",
  },
  ".rbc-current-time-indicator": {
    backgroundColor: isDark ? "#FF2D55" : "#FF3B30",
    height: "2px",
    "&::before": {
      content: '""',
      position: "absolute",
      left: "-5px",
      top: "-3px",
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      backgroundColor: "inherit",
    },
  },
  ".rbc-toolbar": {
    marginBottom: "24px",
    padding: "12px",
    borderRadius: "12px",
    backgroundColor: isDark ? "#2d2d2d" : "#f8f9fa",
  },
  ".rbc-toolbar button": {
    padding: "8px 16px",
    borderRadius: "6px",
    fontWeight: "500",
    transition: "all 0.2s ease",
    color: isDark ? "#fff" : "#000",
    "&:hover": {
      backgroundColor: isDark
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.1)",
    },
    "&:active, &.rbc-active": {
      backgroundColor: isDark ? "#9f006a" : "#ff0bae",
      color: "#fff",
      "&:hover": {
        backgroundColor: isDark ? "#0fa259" : "#18ff00",
      },
    },
  },
  // Out of range dates styling
  ".rbc-off-range-bg": {
    backgroundColor: isDark
      ? "rgba(255, 255, 255, 0.02)"
      : "rgba(0, 0, 0, 0.02)",
  },
  ".rbc-off-range": {
    color: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
  },
});

export default useCalendarStyles
