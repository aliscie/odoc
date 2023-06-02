import BasicMenu from "../genral/basic_menu";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import LogoutIcon from "@mui/icons-material/Logout";
import {reduxLogin, reduxLogout, toggle, toggleDarkMode, toggleSearchTool} from "../../redux/main";
import {Avatar, Button, Typography} from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import {Link, Route, Routes} from "react-router-dom";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import TopNavBar from "../genral/top_nav_bar";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Tooltip from "@mui/material/Tooltip";
import {BreadPage} from "../genral/breadcrumbs";
import CopyButton from "../genral/copy_link";

export function NavAppBar() {

    const dispatch = useDispatch();
    const isNavOpen = useSelector((state: any) => state.isNavOpen);
    const isDarkMode = useSelector((state: any) => state.isDarkMode);
    const isLoggedIn = useSelector((state: any) => state.isLoggedIn);
    const searchTool = useSelector((state: any) => state.searchTool);

    return (

        <TopNavBar>
            <Button
                color={"inherit"}
                onClick={() => dispatch(toggle())}
            >
                {isNavOpen ? <MenuOpenIcon/> : <MenuIcon/>}
            </Button>


            <Routes>
                <Route path="*" element={<BreadPage/>}/>
            </Routes>
            <CopyButton/>

            <Tooltip title={'You can press "Command+F"'} placement="top">
                <IconButton
                    onClick={() => dispatch(toggleSearchTool())}
                    size="small" color="primary">
                    {searchTool ? <CloseIcon/> : <SearchIcon/>}
                </IconButton>
            </Tooltip>


            <Button color={"inherit"} onClick={() => dispatch(toggleDarkMode())}>
                {isDarkMode ? <LightModeIcon/> : <DarkModeIcon/>}
            </Button>
            {isLoggedIn ? <BasicMenu options={[
                {content: "profile", icon: <GavelRoundedIcon/>},
                {content: "settings", icon: <EditNoteRoundedIcon/>},
                {content: "logout", icon: <LogoutIcon/>, onClick: () => dispatch(reduxLogout())}
            ]}>
                <Avatar style={{display: "inline"}} alt="Remy Sharp"
                        src="https://avatars.githubusercontent.com/u/58806996?v=4"/>
            </BasicMenu> : <Button color={"inherit"} onClick={() => dispatch(reduxLogin())}> login</Button>}
        </TopNavBar>
    )

}