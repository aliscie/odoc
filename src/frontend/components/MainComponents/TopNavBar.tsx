import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Tooltip,
  useMediaQuery,
  useTheme,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import GavelIcon from "@mui/icons-material/Gavel";
import Person2Icon from "@mui/icons-material/Person2";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

import { Route, Routes, useNavigate } from "react-router-dom";

import BasicMenu from "../MuiComponents/BasicMenu";
import BreadPage from "../MuiComponents/Breadcrumbs";
import ShareFileButton from "../MuiComponents/CopyLink";
import MultiSaveButton from "../Actions/MultiSave";
import NotificationsButton from "../NotifcationList";
import ChatsComponent from "../Chat";
import UserAvatar from "./UserAvatar";

import { handleRedux } from "../../redux/store/handleRedux";
import { useBackendContext } from "../../contexts/BackendContext";
import { convertToBlobLink } from "../../DataProcessing/imageToVec";
import { Z_INDEX_TOP_NAVBAR } from "../../constants/zIndex";
import { RootState } from "../../redux/reducers";

interface File {
  id: string;
  [key: string]: any;
}

const TopNavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { login, logout } = useBackendContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);
  const [mobileNotificationAnchor, setMobileNotificationAnchor] = useState<null | HTMLElement>(null);

  const { isNavOpen, isDarkMode, isLoggedIn, searchTool } = useSelector(
    (state: RootState) => state.uiState
  );

  const { profile, profile_history, current_file, files } = useSelector(
    (state: RootState) => state.filesState
  );

  const { chats } = useSelector(
    (state: RootState) => state.chatsState
  );

  const { notifications } = useSelector(
    (state: RootState) => state.notificationState
  );

  const { backendActor } = useBackendContext();

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(handleRedux("LOGIN"));
    }
  }, [isLoggedIn, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      if (isLoggedIn && backendActor) {
        const res = await backendActor.get_user_notifications();
        dispatch(handleRedux("UPDATE_NOT_LIST", { new_list: res }));

        const chatsList = await backendActor.get_my_chats();
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

  const handleMobileProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleMobileNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setMobileNotificationAnchor(event.currentTarget);
  };

  const handleMobileNotificationClose = () => {
    setMobileNotificationAnchor(null);
  };

  const imageLink = profile ? convertToBlobLink(profile.photo) : "";
  const isOwnerCurrentFile = current_file &&
    files.find((file: File) => file && file.id === current_file.id);

  const mobileMenuOptions = [
    { content: "Profile", to: "/profile", icon: <Person2Icon /> },
    { content: "Contracts", to: "/contracts", icon: <GavelIcon /> },
    { content: "Wallet", to: "/wallet", icon: <AccountBalanceWalletIcon /> },
    { content: "Settings", to: "/settings", icon: <SettingsIcon /> },
    { content: "Logout", to: "/", icon: <LogoutIcon />, onClick: handleLogout },
  ];

  const renderMobileContent = () => (
    <Box sx={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: Z_INDEX_TOP_NAVBAR + 1
    }}>
      <Paper elevation={3} sx={{ borderRadius: 0 }}>
        <BottomNavigation
          sx={{
            width: '100%',
            height: 'auto',
            minHeight: 56,
            bgcolor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider'
          }}
        >
          <BottomNavigationAction
            label="Menu"
            icon={isNavOpen ? <MenuOpenIcon /> : <MenuIcon />}
            onClick={() => dispatch(handleRedux("TOGGLE_NAV"))}
            sx={{ minWidth: 'auto', px: 1 }}
          />

          <BottomNavigationAction
            label="Theme"
            icon={isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            onClick={() => dispatch(handleRedux("TOGGLE_DARK"))}
            sx={{ minWidth: 'auto', px: 1 }}
          />

          {isLoggedIn ? (
            <>
              <BottomNavigationAction
                label="Notifications"
                icon={<NotificationsIcon />}
                onClick={handleMobileNotificationClick}
                sx={{ minWidth: 'auto', px: 1 }}
              />

              <BottomNavigationAction
                label="Chat"
                icon={<ChatsComponent key={chats.length} chats={chats} isMobile={true} />}
                sx={{ minWidth: 'auto', px: 1 }}
              />

              <BottomNavigationAction
                label="Profile"
                icon={
                  <UserAvatar
                    actions_rate={profile_history ? profile_history.actions_rate : 0}
                    photo={imageLink}
                    style={{ width: 24, height: 24 }}
                  />
                }
                onClick={handleMobileProfileClick}
                sx={{ minWidth: 'auto', px: 1 }}
              />

              <BottomNavigationAction
                label="Save"
                icon={<MultiSaveButton isMobile={true} />}
                sx={{ minWidth: 'auto', px: 1 }}
              />
            </>
          ) : (
            <BottomNavigationAction
              label="Login"
              icon={<Person2Icon />}
              onClick={handleLogin}
              sx={{ minWidth: 'auto', px: 1 }}
            />
          )}
        </BottomNavigation>

        {/* Mobile Profile Menu */}
        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMobileMenuClose}
          PaperProps={{
            sx: {
              mt: -40,
              maxHeight: '80vh',
              width: '200px',
              '& .MuiMenuItem-root': {
                py: 1.5,
              },
            },
          }}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
        >
          {mobileMenuOptions.map((option, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                handleMobileMenuClose();
                if (option.onClick) {
                  option.onClick();
                }
                if (option.to) {
                  navigate(option.to);
                }
              }}
            >
              <ListItemIcon>{option.icon}</ListItemIcon>
              <ListItemText primary={option.content} />
            </MenuItem>
          ))}
        </Menu>

        {/* Mobile Notifications Menu */}
        <Menu
          anchorEl={mobileNotificationAnchor}
          open={Boolean(mobileNotificationAnchor)}
          onClose={handleMobileNotificationClose}
          PaperProps={{
            sx: {
              mt: -40,
              maxHeight: '80vh',
              width: '300px',
            },
          }}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
        >
          <NotificationsButton
            notifications={notifications}
            onClose={handleMobileNotificationClose}
            isMobile={true}
          />
        </Menu>
      </Paper>
    </Box>
  );

  const renderDesktopContent = () => (
    <Toolbar
      sx={{
        transition: "0.4s",
        ml: isNavOpen ? "250px" : 0,
        justifyContent: "space-between",
      }}
    >
      {/* Left Side: Navigation */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => dispatch(handleRedux("TOGGLE_NAV"))}
        >
          {isNavOpen ? <MenuOpenIcon /> : <MenuIcon />}
        </IconButton>
        <Routes>
          <Route path="*" element={<BreadPage />} />
        </Routes>
        {isOwnerCurrentFile && <ShareFileButton />}
      </Box>

      {/* Center: Search Bar */}
      <Box sx={{ flexGrow: 1, mx: 2 }}>
        <Tooltip title={'You can press "Command+F"'} placement="top">
          <IconButton
            color="inherit"
            onClick={() => dispatch(handleRedux("SEARCH_TOOL"))}
            size="small"
          >
            {searchTool ? <CloseIcon /> : <SearchIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Right Side: User Actions */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton
          color="inherit"
          onClick={() => dispatch(handleRedux("TOGGLE_DARK"))}
        >
          {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>

        {isLoggedIn && (
          <>
            <NotificationsButton notifications={notifications} />
            <ChatsComponent key={chats.length} chats={chats} />
            <BasicMenu
              options={mobileMenuOptions}
            >
              <UserAvatar
                actions_rate={profile_history ? profile_history.actions_rate : 0}
                photo={imageLink}
                style={{ width: 40, height: 40 }}
              />
            </BasicMenu>
            <MultiSaveButton />
          </>
        )}

        {!isLoggedIn && (
          <Button className="login" color="inherit" onClick={handleLogin}>
            Login
          </Button>
        )}
      </Box>
    </Toolbar>
  );

  return (
    <>
      <AppBar
        position="fixed"
        color="default"
        sx={{
          zIndex: Z_INDEX_TOP_NAVBAR,
          display: isMobile ? 'none' : 'block'
        }}
      >
        {renderDesktopContent()}
      </AppBar>
      {isMobile && renderMobileContent()}
    </>
  );
};

export default TopNavBar;
