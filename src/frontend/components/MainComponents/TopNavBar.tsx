import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme, useMediaQuery } from "@mui/material";
import {
  AppBar,
  Avatar,
  Button,
  Toolbar,
  Box,
  IconButton,
  Tooltip,
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

import { Routes, Route } from "react-router-dom";

import BasicMenu from "../MuiComponents/BasicMenu";
import BreadPage from "../MuiComponents/Breadcrumbs";
import ShareFileButton from "../MuiComponents/CopyLink";
import MultiSaveButton from "../Actions/MultiSave";

import { Notifications } from "../NotifcationList";
import ChatsComponent from "../Chat/NavBarChatButton";
import Workspaces from "./WorkSpaces";

import { handleRedux } from "../../redux/store/handleRedux";
import { useBackendContext } from "../../contexts/BackendContext";
import { convertToBlobLink } from "../../DataProcessing/imageToVec";
import { Z_INDEX_TOP_NAVBAR } from "../../constants/zIndex";
import { agent } from "../../backend_connect/main";

const TopNavBar = () => {
  const dispatch = useDispatch();
  const { login, logout } = useBackendContext();

  const { isNavOpen, isDarkMode, isLoggedIn, searchTool } = useSelector(
    (state: any) => state.uiState,
  );
  const { profile, isRegistered, current_file, files } = useSelector(
    (state: any) => state.filesState,
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(handleRedux("LOGIN"));
    }
  }, [isLoggedIn]);

  const handleLogin = async () => {
    await login();
    dispatch(handleRedux("LOGIN"));
  };

  const handleLogout = async () => {
    logout();
    dispatch(handleRedux("LOGOUT"));
  };

  const imageLink = profile ? convertToBlobLink(profile.photo) : "";
  const isOwnerCurrentFile =
    current_file && files.find((file: any) => file.id === current_file.id);

  // if (isAuthenticating || !isRegistered) {
  //     return <h3> Loading... </h3>
  // }

  return (
    <AppBar
      position="fixed"
      color="default"
      sx={{ zIndex: Z_INDEX_TOP_NAVBAR }}
    >
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
              <Notifications />
              <ChatsComponent />
              <BasicMenu
                options={[
                  { content: "Profile", to: "profile", icon: <Person2Icon /> },
                  {
                    content: "Contracts",
                    to: "contracts",
                    icon: <GavelIcon />,
                  },
                  { content: "Settings", icon: <SettingsIcon /> },
                  {
                    content: "Logout",
                    to: "/",
                    icon: <LogoutIcon />,
                    onClick: handleLogout,
                  },
                ]}
              >
                <Avatar alt="User Avatar" src={imageLink} />
              </BasicMenu>
              <Workspaces />
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
    </AppBar>
  );
};

export default TopNavBar;
