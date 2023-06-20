import BasicMenu from "../genral/basic_menu";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import LogoutIcon from "@mui/icons-material/Logout";
import {handleRedux} from "../../redux/main";
import {Avatar, Button} from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import {Route, Routes} from "react-router-dom";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import TopNavBar from "../genral/top_nav_bar";
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Tooltip from "@mui/material/Tooltip";
import {BreadPage} from "../genral/breadcrumbs";
import CopyButton from "../genral/copy_link";
import {agent} from "../../backend_connect/main";
import ContentSave from "../actions/contents_save";

export function NavAppBar() {


    const dispatch = useDispatch();
    const {isNavOpen, isDarkMode, isLoggedIn, searchTool} = useSelector((state: any) => state.uiReducer);

    async function loginProfile() {
        if (isLoggedIn) {
            // let user = await backend.register({name: "Ali", description: "descr"});
            // console.log(user)
            dispatch(handleRedux("LOGIN"))
        }
    }

    useEffect(() => {
        loginProfile()

    }, [])

    async function handleLogin() {
        await agent.identify()
    }

    async function handleLogout() {
        await agent.logout()
        // dispatch(handleRedux("LOGOUT"))
    }

    return (

        <TopNavBar>
            <Button
                onClick={() => dispatch(handleRedux("TOGGLE_NAV"))}
            >
                {isNavOpen ? <MenuOpenIcon/> : <MenuIcon/>}
            </Button>


            <Routes>
                <Route path="*" element={<BreadPage/>}/>
            </Routes>
            <CopyButton/>

            <Button onClick={() => dispatch(handleRedux("TOGGLE_DARK"))}>
                {isDarkMode ? <LightModeIcon/> : <DarkModeIcon/>}
            </Button>


            <Tooltip title={'You can press "Command+F"'} placement="top">
                <IconButton
                    onClick={() => dispatch(handleRedux("SEARCH_TOOL"))}
                    size="small" color="primary">
                    {searchTool ? <CloseIcon/> : <SearchIcon/>}
                </IconButton>
            </Tooltip>
            {isLoggedIn ? <BasicMenu options={[
                {content: "profile", icon: <GavelRoundedIcon/>},
                {content: "settings", icon: <EditNoteRoundedIcon/>},
                {content: "logout", icon: <LogoutIcon/>, onClick: handleLogout}
            ]}>
                <Avatar style={{display: "inline"}} alt="Remy Sharp"
                        src="https://avatars.githubusercontent.com/u/58806996?v=4"/>
            </BasicMenu> : <Button onClick={handleLogin}> login</Button>}
            <ContentSave/>
        </TopNavBar>
    )

}