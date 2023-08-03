import React, {useEffect} from "react";
import "./App.css";
import NavBar from "./components/spesific/nav_bar";
import Pages from "./pages/main";
import {BrowserRouter} from "react-router-dom";
import {NavAppBar} from "./components/spesific/app_bar";
import SearchPopper from "./components/spesific/search_popper";
import Theme from "./components/genral/theme_provider";
import {SnackbarProvider} from "notistack";
import RegistrationForm from "./components/spesific/registeration_form";
import {get_initial_data} from "./backend_connect/connect";
import {handleRedux} from "./redux/main";
import {useDispatch} from "react-redux";
import {agent} from "./backend_connect/main";


function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        (async () => {
            await get_initial_data();
            if (await agent.is_logged()) {
                dispatch(handleRedux('LOGIN'));
            }

        })()
    }, []);

    return (
        <Theme>
            <BrowserRouter>
                <SearchPopper/>
                <SnackbarProvider maxSnack={3}>
                    <RegistrationForm/>
                    <NavAppBar/>
                    <NavBar>
                        <Pages/>
                    </NavBar>
                </SnackbarProvider>
            </BrowserRouter>
        </Theme>
    )
        ;
}

export default App;
