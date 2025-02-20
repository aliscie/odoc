const useCalendarStyles = (isDark) => {
  const borderColor = isDark
    ? "rgba(75, 75, 75, 0.3)"
    : "rgba(210, 210, 210, 0.8)";

  return {
    ".rbc-calendar": {
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
      backgroundColor: isDark ? "#242526" : "#FAFAFA",
      border: `1px solid ${borderColor}`,
      borderRadius: "8px",
      overflow: "hidden",
    },

    // Header styles
    ".rbc-header": {
      padding: "12px 4px",
      fontWeight: "500",
      fontSize: "0.9rem",
      backgroundColor: isDark ? "#2A2B2D" : "#F5F5F5",
      color: isDark ? "rgba(255, 255, 255, 0.75)" : "rgba(0, 0, 0, 0.75)",
      borderBottom: `1px solid ${borderColor}`,
      height: "36px",
      "& span": {
        display: "block",
        textAlign: "center",
      },
    },

    ".rbc-header + .rbc-header": {
      borderLeft: `1px solid ${borderColor}`,
    },

    // Time view
    ".rbc-time-view": {
      border: `1px solid ${borderColor}`,
      borderRadius: "8px",
      overflow: "hidden",
      backgroundColor: isDark ? "#242526" : "#FAFAFA",
    },

    ".rbc-time-header": {
      backgroundColor: isDark ? "#2A2B2D" : "#F5F5F5",
      borderBottom: `1px solid ${borderColor}`,
    },

    // Content area
    ".rbc-time-content": {
      border: "none",
      "& > * + * > *": {
        borderLeft: `1px solid ${borderColor}`,
      },
    },

    ".rbc-timeslot-group": {
      borderBottom: `1px solid ${borderColor}`,
      minHeight: "80px",
    },

    // Time gutter
    ".rbc-time-gutter": {
      fontWeight: "500",
      fontSize: "0.85rem",
      color: isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
      padding: "0 12px",
      borderRight: `1px solid ${borderColor}`,
      backgroundColor: isDark ? "#2A2B2D" : "#F5F5F5",
    },

    // Time column lines
    ".rbc-time-column": {
      "& .rbc-timeslot-group": {
        borderBottom: `1px solid ${borderColor}`,
      },
    },

    // Time slots
    ".rbc-time-slot": {
      color: isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)",
    },

    // Day columns
    ".rbc-day-slot": {
      "& .rbc-timeslot-group": {
        borderBottom: `1px solid ${borderColor}`,
      },
    },

    // Available slots
    ".available-slot": {
      backgroundColor: isDark
        ? "rgba(88, 101, 242, 0.08)"
        : "rgba(88, 101, 242, 0.06)",
      borderLeft: isDark
        ? "2px solid rgba(88, 101, 242, 0.4)"
        : "2px solid rgba(88, 101, 242, 0.7)",
      cursor: "pointer",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: isDark
          ? "rgba(88, 101, 242, 0.12)"
          : "rgba(88, 101, 242, 0.1)",
      },
    },

    // Past time slots
    ".past-time-slot": {
      backgroundColor: isDark
        ? "rgba(255, 255, 255, 0.01)"
        : "rgba(0, 0, 0, 0.02)",
      color: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.3)",
      cursor: "not-allowed",
      pointerEvents: "none",
    },

    // Events
    ".rbc-event": {
      padding: "6px 8px",
      fontSize: "0.875rem",
      fontWeight: "500",
      border: "none",
      borderRadius: "4px",
      backgroundColor: isDark
        ? "rgba(88, 101, 242, 0.7)"
        : "rgba(88, 101, 242, 0.9)",
      color: isDark ? "rgba(255, 255, 255, 0.9)" : "#FFFFFF",
      boxShadow: isDark
        ? "0 1px 2px rgba(0, 0, 0, 0.2)"
        : "0 1px 2px rgba(0, 0, 0, 0.1)",
      transition: "all 0.2s ease",
      "&:hover": {
        transform: "translateY(-1px)",
      },
    },

    // Today styling
    ".rbc-today": {
      backgroundColor: isDark
        ? "rgba(255, 255, 255, 0.015)"
        : "rgba(0, 0, 0, 0.02)",
    },

    // Current time indicator
    // Current time indicator
    ".rbc-current-time-indicator": {
      backgroundColor: "rgba(255,0,0,0.7)",
      height: "2px",
      boxShadow: "0 1px 1px rgba(255,0,0,0.3)",
      position: "absolute",
      right: "0",
      left: "0",
      zIndex: 99,
      "&::before": {
        content: '""',
        position: "absolute",
        left: "-4px",
        top: "50%",
        transform: "translateY(-50%)",
        width: "8px",
        height: "8px",
        backgroundColor: "rgba(255,0,0,0.7)",
        borderRadius: "50%",
      },
    },

    // All timeslot borders
    ".rbc-timeslot-group, .rbc-time-slot, .rbc-day-slot .rbc-time-slot": {
      borderBottom: `1px solid ${borderColor}`,
    },

    // Toolbar
    ".rbc-toolbar": {
      marginBottom: "20px",
      padding: "10px",
      backgroundColor: isDark ? "#2A2B2D" : "#F5F5F5",
      borderRadius: "6px",
      border: `1px solid ${borderColor}`,
    },

    ".rbc-toolbar button": {
      padding: "6px 12px",
      borderRadius: "4px",
      fontWeight: "500",
      transition: "all 0.2s ease",
      color: isDark ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)",
      border: `1px solid ${borderColor}`,
      "&:hover": {
        backgroundColor: isDark
          ? "rgba(255, 255, 255, 0.05)"
          : "rgba(0, 0, 0, 0.05)",
      },
      "&:active, &.rbc-active": {
        backgroundColor: isDark
          ? "rgba(88, 101, 242, 0.2)"
          : "rgba(88, 101, 242, 0.1)",
        borderColor: isDark
          ? "rgba(88, 101, 242, 0.4)"
          : "rgba(88, 101, 242, 0.3)",
      },
    },

    // Off-range dates
    ".rbc-off-range-bg": {
      backgroundColor: isDark
        ? "rgba(255, 255, 255, 0.01)"
        : "rgba(0, 0, 0, 0.01)",
    },

    ".rbc-off-range": {
      color: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
    },

    // Override any remaining white borders
    ".rbc-time-content > * + * > *, .rbc-time-content, .rbc-day-bg + .rbc-day-bg":
      {
        borderLeft: `1px solid ${borderColor}`,
      },
  };
};

export default useCalendarStyles;
