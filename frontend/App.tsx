import React, {useEffect} from "react";
import "./App.css";
import NavBar from "./components/spesific/nav_bar";
import Pages from "./pages/main";
import {BrowserRouter} from "react-router-dom";
import {NavAppBar} from "./components/spesific/app_bar";
import SearchPopper from "./components/genral/search_popper";
import ModeThemeProvider from "./components/genral/theme_provider";


function App() {
    const [message, setMessage] = React.useState("");
    const [islogin, setLogin] = React.useState(false);

    async function doGreet() {
        setMessage("calling the backend....");
        // let actor = await get_actor();
        // const greeting = await actor.greet("world connection is correct");
        // console.log("greeting", greeting)
        // setMessage(greeting);
    }


    useEffect(() => {
        doGreet();
    }, []);

    return (
        <BrowserRouter>
            <ModeThemeProvider>

                <div>
                    <NavAppBar/>
                    <NavBar>
                        <SearchPopper/>
                        <Pages/>
                    </NavBar>
                </div>
            </ModeThemeProvider>
        </BrowserRouter>
    )
        ;
}

export default App;
