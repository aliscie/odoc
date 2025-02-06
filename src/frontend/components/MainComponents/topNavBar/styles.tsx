import { alpha, Theme } from "@mui/material";
import { Z_INDEX_TOP_NAVBAR } from "../../../constants/zIndex";

const getStyles = (theme: Theme) => ({
  appBar: {
    zIndex: Z_INDEX_TOP_NAVBAR,
    backgroundColor: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
    transition: theme.transitions.create(
      ["background-color", "border-bottom", "box-shadow"],
      {
        duration: theme.transitions.duration.standard,
      },
    ),
  },
  toolbar: {
    minHeight: "44px !important",
    height: "44px",
    padding: "0 12px",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  toolbarShift: {
    marginLeft: "250px",
    width: `calc(100% - 250px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  iconButton: {
    padding: 4,
    width: "28px",
    height: "28px",
    color: theme.palette.text.primary,
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
    },
    "& .MuiSvgIcon-root": {
      fontSize: "1.2rem",
    },
  },
  mobileNavigation: {
    height: "64px", // Standard MUI Bottom Navigation height
    backgroundColor: theme.palette.background.paper,
    borderTop: `1px solid ${theme.palette.divider}`,
    "& .MuiBottomNavigationAction-root": {
      minWidth: 80,
      maxWidth: 168,
      padding: "8px 12px 6px",
      color: theme.palette.text.secondary,
      "&.Mui-selected": {
        color: theme.palette.primary.main,
        "& .MuiBottomNavigationAction-label": {
          fontSize: "0.875rem",
        },
      },
      "& .MuiSvgIcon-root": {
        fontSize: "1.5rem",
        marginBottom: "4px",
      },
      "& .MuiBottomNavigationAction-label": {
        fontSize: "0.75rem",
        transition: theme.transitions.create(["font-size"], {
          duration: theme.transitions.duration.shorter,
        }),
      },
    },
  },
  menuPaper: {
    marginTop: theme.spacing(-5),
    maxHeight: "80vh",
    width: "200px",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[4],
    "& .MuiMenuItem-root": {
      padding: theme.spacing(1.5),
      color: theme.palette.text.primary,
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
      },
      "& .MuiSvgIcon-root": {
        fontSize: "1.5rem", // Increased icon size for mobile menu
      },
    },
  },
  loginButton: {
    padding: theme.spacing(0.25, 1),
    minHeight: "28px",
    height: "28px",
    fontSize: "14px",
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
    },
  },
  mobileAvatar: {
    width: "40px !important", // Further increased avatar size for mobile
    height: "40px !important",
  },
  progressBar: {
    position: "absolute",
    width: "100%",
    top: 0,
    left: 0,
    zIndex: Z_INDEX_TOP_NAVBAR + 2,
    "& .MuiLinearProgress-bar": {
      backgroundColor: theme.palette.primary.main,
    },
  },
});

export default getStyles;
