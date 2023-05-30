import BasicMenu from "../genral/basic_menu";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import LogoutIcon from "@mui/icons-material/Logout";
import {reduxLogin, reduxLogout, toggle, toggleDarkMode} from "../../redux/main";
import {Avatar, Button, Typography} from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import {Link} from "react-router-dom";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import TopNavBar from "../genral/top_nav_bar";
import React from "react";
import {useDispatch, useSelector} from "react-redux";

export function NavAppBar() {

    const dispatch = useDispatch();
    const isNavOpen = useSelector((state: any) => state.isNavOpen);
    const isDarkMode = useSelector((state: any) => state.isDarkMode);
    const isLoggedIn = useSelector((state: any) => state.isLoggedIn);
    return (

        <TopNavBar>
            <Button
                onClick={() => dispatch(toggle())}
            >
                {isNavOpen ? <MenuOpenIcon/> : <MenuIcon/>}
            </Button>

            <Button><Link to="/">Home</Link></Button>
            <Button><Link to="/Whitepaper">Whitepaper</Link></Button>
            <Button><Link to="/books">Books</Link></Button>
            <Button onClick={() => dispatch(toggleDarkMode())}>
                {isDarkMode ? <LightModeIcon/> : <DarkModeIcon/>}
            </Button>
            {isLoggedIn ? <BasicMenu options={[
                {content: "profile", icon: <GavelRoundedIcon/>},
                {content: "settings", icon: <EditNoteRoundedIcon/>},
                {content: "logout", icon: <LogoutIcon/>, onClick: () => dispatch(reduxLogout())}
            ]}>
                <Avatar style={{display: "inline"}} alt="Remy Sharp"
                        src="https://avatars.githubusercontent.com/u/58806996?v=4"/>
            </BasicMenu> : <Button onClick={() => dispatch(reduxLogin())}> login</Button>}
        </TopNavBar>
    )

}