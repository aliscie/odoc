import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme, useMediaQuery } from "@mui/material";
import {
  AppBar,
  Avatar,
  Button,
  Toolbar,
  Box,
  IconButton,
  Tooltip
} from "@mui/material";

import GavelIcon from "@mui/icons-material/Gavel";
import Person2Icon from '@mui/icons-material/Person2';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LogoutIcon from "@mui/icons-material/Logout";

import { Routes, Route } from "react-router-dom";

import BasicMenu from "../genral/basic_menu";
import BreadPage from "../genral/breadcrumbs";
import ShareFileButton from "../genral/copy_link";
import MultiSaveButton from "../actions/multi_save";
import { Notifications } from "../notifcations/notification";
import ChatsComponent from "../chat_component";
import Workspaces from "./work_spaces";

import { handleRedux } from "../../redux/main";
import { agent } from "../../backend_connect/main";
import { convertToBlobLink } from "../../data_processing/image_to_vec";
import { Z_INDEX_TOP_NAVBAR } from "../../constants/zIndex";

const TopNavBar = () => {
    const dispatch = useDispatch();
    const { isNavOpen, isDarkMode, isLoggedIn, searchTool } = useSelector(
      (state: any) => state.uiReducer
    );
    const { profile, current_file, files } = useSelector(
      (state: any) => state.filesReducer
    );
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
    useEffect(() => {
      if (isLoggedIn) {
        dispatch(handleRedux("LOGIN"));
      }
    }, [dispatch, isLoggedIn]);
  
    const handleLogin = async () => {
      await agent.identify();
      dispatch(handleRedux("LOGIN"));
    };
  
    const handleLogout = async () => {
      await agent.logout();
      dispatch(handleRedux("LOGOUT"));
    };
  
    const imageLink = profile ? convertToBlobLink(profile.photo) : "";
    const isOwnerCurrentFile = current_file && files.find((file: any) => file.id === current_file.id);
  
    return (
      <AppBar position="fixed" color="default" sx={{ zIndex: Z_INDEX_TOP_NAVBAR }}>
        <Toolbar sx={{ transition: "0.4s", ml: isNavOpen ? "250px" : 0, justifyContent: "space-between" }}>
          {/* Left Side: Navigation */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton edge="start" color="inherit" onClick={() => dispatch(handleRedux("TOGGLE_NAV"))}>
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
              <IconButton color="inherit" onClick={() => dispatch(handleRedux("SEARCH_TOOL"))} size="small">
                {searchTool ? <CloseIcon /> : <SearchIcon />}
              </IconButton>
            </Tooltip>
          </Box>
  
          {/* Right Side: User Actions */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton color="inherit" onClick={() => dispatch(handleRedux("TOGGLE_DARK"))}>
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
  
            {isLoggedIn && (
              <>
                <Notifications />
                <ChatsComponent />
                <BasicMenu
                  options={[
                    { content: "Profile", to: "profile", icon: <Person2Icon /> },
                    { content: "Contracts", to: "contracts", icon: <GavelIcon /> },
                    { content: "Settings", icon: <SettingsIcon /> },
                    { content: "Logout", to: "/", icon: <LogoutIcon />, onClick: handleLogout }
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
