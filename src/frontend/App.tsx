import React, {useEffect, useState} from "react";
import "./App.css";
import NavBar from "./components/spesific/nav_bar";
import Pages from "./pages/main";
import {BrowserRouter} from "react-router-dom";
import {NavAppBar} from "./components/spesific/app_bar";
import SearchPopper from "./components/spesific/search_popper";
import Theme from "./components/genral/theme_provider";
import {SnackbarProvider} from "notistack";
import RegistrationForm from "./components/spesific/registeration_form";
import {handleRedux} from "./redux/main";
import {useDispatch} from "react-redux";
import {agent} from "./backend_connect/main";
import {get_initial_data} from "./redux/files";
import {get_actor} from "./backend_connect/ic_agent";
import {ActorSubclass} from "@dfinity/agent";
import {_SERVICE} from "../declarations/user_canister/user_canister.did";

export let actor: ActorSubclass<_SERVICE> | undefined;

function App() {
    const dispatch = useDispatch();
    const [state, setState] = useState(false);
    useEffect(() => {
        (async () => {

            actor = await get_actor();
            await get_initial_data();

            if (await agent.is_logged()) {
                dispatch(handleRedux('LOGIN'));
            }
            setState(true)

        })()
    }, []);

    return (
        <Theme>
            {state && <BrowserRouter>
                <SearchPopper/>
                <SnackbarProvider maxSnack={3}>
                    <RegistrationForm/>
                    <NavAppBar/>
                    <NavBar>
                        <Pages/>
                    </NavBar>
                </SnackbarProvider>
            </BrowserRouter>}
        </Theme>
    )
        ;
}

export default App;
