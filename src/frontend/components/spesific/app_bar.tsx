import BasicMenu from "../genral/basic_menu";
import LogoutIcon from "@mui/icons-material/Logout";
import {handleRedux} from "../../redux/main";
import {AppBar, Avatar, Button, Toolbar, Box} from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import {Route, Routes} from "react-router-dom";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Tooltip from "@mui/material/Tooltip";
import BreadPage from "../genral/breadcrumbs";
import ShareFileButton from "../genral/copy_link";
import {agent} from "../../backend_connect/main";
import MultiSaveButton from "../actions/multi_save";
import Person2Icon from '@mui/icons-material/Person2';
import SettingsIcon from '@mui/icons-material/Settings';
import {convertToBlobLink} from "../../data_processing/image_to_vec";
import {Notifications} from "../notifcations/notification";
import ChatsComponent from "../chat_component";
import Workspaces from "./work_spaces";
import { useTheme, useMediaQuery } from "@mui/material";

export function NavAppBar() {
    const dispatch = useDispatch();
    const {isNavOpen, isDarkMode, isLoggedIn, searchTool} = useSelector((state: any) => state.uiReducer);
    const {profile, current_file, files} = useSelector((state: any) => state.filesReducer);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


    async function loginProfile() {
        if (isLoggedIn) {
            // let user = await backend.register({name: "Ali", description: "descr"});
            // console.log(user)
            dispatch(handleRedux('LOGIN'));
        }
    }

    useEffect(() => {
        loginProfile();
    }, []);

    async function handleLogin() {
        await agent.identify();
        dispatch(handleRedux('LOGIN'));
    }

    async function handleLogout() {
        await agent.logout();
        // dispatch(handleRedux("LOGOUT"))
    }

    let image_link = profile ? convertToBlobLink(profile.photo) : '';

    return (
        <AppBar position="fixed" color="default" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
            <Toolbar sx={{ transition: '0.4s', ml: isNavOpen ? "250px" : 0, justifyContent: 'space-between'}}>
                 {/* Left Side: Navigation */}
                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton edge="start" color="inherit" onClick={() => dispatch(handleRedux('TOGGLE_NAV'))}>
                        {isNavOpen ? <MenuOpenIcon /> : <MenuIcon />}
                    </IconButton>
                    <Routes>
                        <Route path="*" element={<BreadPage />} />
                    </Routes>
                    <ShareFileButton />
                </Box>

                {/* Center: Search Bar */}
                <Box sx={{ flexGrow: 1, mx: 2 }}>   
                    <Tooltip title={'You can press "Command+F"'} placement="top">
                        <IconButton color="inherit" onClick={() => dispatch(handleRedux('SEARCH_TOOL'))} size="small">
                            {searchTool ? <CloseIcon /> : <SearchIcon />}
                        </IconButton>
                    </Tooltip>
                </Box>
              
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton color="inherit" onClick={() => dispatch(handleRedux('TOGGLE_DARK'))}>
                        {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>

                    {isLoggedIn && <Notifications />}
                    {isLoggedIn && <ChatsComponent />}

                    {isLoggedIn ? (
                        <BasicMenu
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            options={[
                                { content: "Profile", to: "Profile", icon: <Person2Icon /> },
                                { content: 'Settings', icon: <SettingsIcon /> },
                                { content: 'Logout', icon: <LogoutIcon />, onClick: handleLogout },
                            ]}
                        >
                            <Avatar alt="User Avatar" src={image_link} />
                        </BasicMenu>
                    ) : (
                        <Button className="login" color="inherit" onClick={handleLogin}>Login</Button>
                    )}

                    {isLoggedIn && <Workspaces />}
                    {isLoggedIn && <MultiSaveButton />}
                </Box>
            </Toolbar>
        </AppBar>
    );
}