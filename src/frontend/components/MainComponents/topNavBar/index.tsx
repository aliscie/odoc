import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  alpha,
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  IconButton,
  LinearProgress,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Theme,
  Toolbar,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import {
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Close as CloseIcon,
  DarkMode as DarkModeIcon,
  Gavel as GavelIcon,
  LightMode as LightModeIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  MenuOpen as MenuOpenIcon,
  Notifications as NotificationsIcon,
  Person2 as Person2Icon,
  Search as SearchIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import BasicMenu from "../../MuiComponents/BasicMenu";
import BreadPage from "../../MuiComponents/Breadcrumbs";
import ShareFileButton from "../../MuiComponents/CopyLink";
import MultiSaveButton from "../../Actions/MultiSave";
import NotificationsButton from "../../NotifcationList";
import ChatsComponent from "../../Chat";
import UserAvatar from "../UserAvatar";

import { handleRedux } from "../../../redux/store/handleRedux";
import { useBackendContext } from "../../../contexts/BackendContext";
import { convertToBlobLink } from "../../../DataProcessing/imageToVec";
import { Z_INDEX_TOP_NAVBAR } from "../../../constants/zIndex";
import { RootState } from "../../../redux/reducers";
import HandshakeIcon from "@mui/icons-material/Handshake";
import WorkspaceManager from "../Workspaces";
import ShareButton from "../../MuiComponents/CopyLink";

interface File {
  id: string;
  [key: string]: any;
}

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

export default function TopNavBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const commonIconStyles = {
    transition: theme.transitions.create(["color", "background-color"], {
      duration: theme.transitions.duration.shorter,
    }),
    color: theme.palette.text.primary,
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
    },
  };

  const styles = {
    ...getStyles(theme),
    mobileIcon: {
      ...commonIconStyles,
      fontSize: "1.5rem",
    },
    desktopIcon: {
      ...commonIconStyles,
      fontSize: "1.2rem",
    },
  };
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { login, logout, backendActor } = useBackendContext();

  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(
    null,
  );
  const [mobileNotificationAnchor, setMobileNotificationAnchor] =
    useState<null | HTMLElement>(null);

  const { isNavOpen, isDarkMode, isFetching, isLoggedIn, searchTool } =
    useSelector((state: RootState) => state.uiState);

  const { profile, profile_history, current_file, files } = useSelector(
    (state: RootState) => state.filesState,
  );

  const { chats } = useSelector((state: RootState) => state.chatsState);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch({ type: "LOGIN" });
    }
  }, [isLoggedIn, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      if (isLoggedIn && backendActor) {
        const [notificationRes, chatsList] = await Promise.all([
          backendActor.get_user_notifications(),
          backendActor.get_my_chats(),
        ]);

        dispatch(handleRedux("UPDATE_NOT_LIST", { new_list: notificationRes }));
        dispatch(handleRedux("SET_CHATS", { chats: chatsList }));
      }
    };

    fetchData();
  }, [isLoggedIn, backendActor, dispatch]);

  const handleLogin = async () => {
    await login();
  };

  const handleLogout = async () => {
    logout();
    dispatch(handleRedux("LOGOUT"));
    navigate("/");
  };

  const handleMobileMenuToggle = (
    event: React.MouseEvent<HTMLElement> | null,
  ) => {
    setMobileMenuAnchor(event ? event.currentTarget : null);
  };

  const handleMobileNotificationToggle = (
    event: React.MouseEvent<HTMLElement> | null,
  ) => {
    setMobileNotificationAnchor(event ? event.currentTarget : null);
  };

  const imageLink = profile ? convertToBlobLink(profile.photo) : "";
  // const [isOwnerCurrentFile, setIsOwnerCurrentFile] = useState(false);
  // useEffect(() => {
  //   setIsOwnerCurrentFile(
  //     current_file &&
  //       files.find((file: File) => file && file.id === current_file.id),
  //   );
  // }, [current_file, files]);

  const mobileMenuOptions = [
    { content: "Profile", to: "/profile", icon: <Person2Icon /> },
    { content: "Contracts", to: "/contracts", icon: <GavelIcon /> },
    { content: "Wallet", to: "/wallet", icon: <AccountBalanceWalletIcon /> },
    // { content: "Settings", to: "/settings", icon: <SettingsIcon /> },
    { content: "Affiliate", to: "/affiliate", icon: <HandshakeIcon /> },
    { content: "Logout", to: "/", icon: <LogoutIcon />, onClick: handleLogout },
  ];

  const renderAuthContent = () => {
    if (isFetching) {
      return <LinearProgress sx={styles.progressBar} />;
    }

    if (!isLoggedIn) {
      return (
        <Button
          variant="outlined"
          className="login"
          onClick={handleLogin}
          sx={styles.loginButton}
        >
          Login
        </Button>
      );
    }

    return (
      <>
        <NotificationsButton />
        <ChatsComponent key={chats.length} chats={chats} />
        <WorkspaceManager />
        <BasicMenu options={mobileMenuOptions}>
          <UserAvatar
            actions_rate={profile_history?.actions_rate ?? 0}
            photo={imageLink}
            style={{ width: 24, height: 24 }}
          />
        </BasicMenu>
        <MultiSaveButton />
      </>
    );
  };

  const renderMobileAuthContent = () => {
    if (isFetching) {
      return <LinearProgress sx={styles.progressBar} />;
    }

    if (!isLoggedIn) {
      return (
        <BottomNavigationAction
          label="Login"
          icon={<Person2Icon />}
          onClick={handleLogin}
        />
      );
    }

    return (
      <>
        <BottomNavigationAction
          label="Notifications"
          icon={<NotificationsIcon />}
          onClick={(e) => handleMobileNotificationToggle(e)}
        />
        <BottomNavigationAction
          label="Chat"
          icon={
            <ChatsComponent key={chats.length} chats={chats} isMobile={true} />
          }
        />
        <BottomNavigationAction
          label="Profile"
          icon={
            <UserAvatar
              actions_rate={profile_history?.actions_rate ?? 0}
              photo={imageLink}
              style={styles.mobileAvatar}
            />
          }
          onClick={(e) => handleMobileMenuToggle(e)}
        />
        <BottomNavigationAction
          label="Save"
          icon={<MultiSaveButton isMobile={true} />}
        />
      </>
    );
  };

  const renderMobileContent = () => (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: Z_INDEX_TOP_NAVBAR + 1,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        overflow: "hidden",
      }}
    >
      <Paper elevation={3}>
        <BottomNavigation
          sx={styles.mobileNavigation}
          showLabels
          value={location.pathname}
        >
          <BottomNavigationAction
            label="Menu"
            icon={isNavOpen ? <MenuOpenIcon /> : <MenuIcon />}
            onClick={() => dispatch(handleRedux("TOGGLE_NAV"))}
          />
          <BottomNavigationAction
            label="Theme"
            icon={isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            onClick={() => dispatch(handleRedux("TOGGLE_DARK"))}
          />
          {renderMobileAuthContent()}
        </BottomNavigation>

        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={() => handleMobileMenuToggle(null)}
          PaperProps={{ sx: styles.menuPaper }}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          transformOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          {mobileMenuOptions.map((option, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                handleMobileMenuToggle(null);
                if (option.onClick) option.onClick();
                if (option.to) navigate(option.to);
              }}
            >
              <ListItemIcon>{option.icon}</ListItemIcon>
              <ListItemText primary={option.content} />
            </MenuItem>
          ))}
        </Menu>

        <Menu
          anchorEl={mobileNotificationAnchor}
          open={Boolean(mobileNotificationAnchor)}
          onClose={() => handleMobileNotificationToggle(null)}
          PaperProps={{
            sx: {
              ...styles.menuPaper,
              width: "300px",
            },
          }}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          transformOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <NotificationsButton
          // onClose={() => handleMobileNotificationToggle(null)}
          // isMobile={true}
          />
        </Menu>
      </Paper>
    </Box>
  );

  const renderDesktopContent = () => (
    <Toolbar
      variant="dense"
      sx={{
        ...styles.toolbar,
        ...(isNavOpen && styles.toolbarShift),
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => dispatch(handleRedux("TOGGLE_NAV"))}
          sx={styles.iconButton}
        >
          {isNavOpen ? <MenuOpenIcon /> : <MenuIcon />}
        </IconButton>
        <Routes>
          <Route path="*" element={<BreadPage />} />
        </Routes>
        <ShareButton
          fileId={current_file?.id}
          currentFile={current_file}
        />

      </Box>

      <Box sx={{ flexGrow: 1, mx: 2 }}>
        <Tooltip title={'You can press "Command+F"'} placement="top">
          <IconButton
            color="inherit"
            onClick={() => dispatch(handleRedux("SEARCH_TOOL"))}
            sx={styles.iconButton}
          >
            {searchTool ? <CloseIcon /> : <SearchIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton
          color="inherit"
          onClick={() => dispatch(handleRedux("TOGGLE_DARK"))}
          sx={styles.iconButton}
        >
          {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
        {renderAuthContent()}
      </Box>
    </Toolbar>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          ...styles.appBar,
          display: isMobile ? "none" : "block",
        }}
      >
        {renderDesktopContent()}
      </AppBar>
      {isMobile && renderMobileContent()}
    </>
  );
}
