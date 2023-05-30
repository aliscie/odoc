import React, {useEffect} from "react";
import "./App.css";
import {get_actor} from "./backend_connect/ic_agent";
import NavBar from "./components/spesific/nav_bar";
import TopNavBar from "./components/genral/top_nav_bar";
import Pages from "./pages/main";
import {BrowserRouter, Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import {reduxLogin, reduxLogout, toggle, toggleDarkMode} from "./redux/main";
import {Avatar, Button, Typography} from "@mui/material";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import BasicMenu from "./components/genral/basic_menu";
import LogoutIcon from '@mui/icons-material/Logout';
import {NavAppBar} from "./components/spesific/app_bar";

function App() {
    const [message, setMessage] = React.useState("");
    const [islogin, setLogin] = React.useState(false);

    async function doGreet() {
        setMessage("calling the backend....");
        let actor = await get_actor();
        const greeting = await actor.greet("world");
        setMessage(greeting);
    }


    useEffect(() => {
        doGreet();
        ``
    }, []);


    return (
        <BrowserRouter>
            <div>
                <NavAppBar/>
                <NavBar>
                    {/*{message}*/}


                    <Pages/>

                </NavBar>
            </div>
        </BrowserRouter>
    )
        ;
}

export default App;
