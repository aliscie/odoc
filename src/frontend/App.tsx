import React, {useEffect} from "react";
import "./App.css";
import NavBar from "./components/spesific/nav_bar";
import Pages from "./pages/main";
import {BrowserRouter} from "react-router-dom";
import {NavAppBar} from "./components/spesific/app_bar";
import SearchPopper from "./components/spesific/search_popper";
import ModeThemeProvider from "./components/genral/theme_provider";
import {SnackbarProvider} from "notistack";
import RegistrationForm from "./components/spesific/registeration_form";


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


                <SearchPopper/>
                <SnackbarProvider maxSnack={3}>
                    <RegistrationForm/>
                    <div>
                        <NavAppBar/>
                        <NavBar>

                            <Pages/>
                        </NavBar>
                    </div>
                </SnackbarProvider>
            </ModeThemeProvider>

        </BrowserRouter>
    )
        ;
}

export default App;
