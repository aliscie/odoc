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
import {get_user_actor} from "./backend_connect/ic_agent";
import {ActorSubclass} from "@dfinity/agent";
import {_SERVICE} from "../declarations/user_canister/user_canister.did";
import MessagesDialog from "./components/chat/messages_box_dialog";
import useSocket from "./websocket/use_socket";
import SlateCustomContract from "./components/contracts/custom_contract/custom_contract";
import FormulaCom from "./components/contracts/custom_contract/column_formula";

export let actor: ActorSubclass<_SERVICE> | undefined; // TODo maybe set the actor in redux


function App() {
    const dispatch = useDispatch();
    const [state, setState] = useState(false);
    const {ws} = useSocket();

    // Use a ref to track whether the WebSocket has already been set up
    // const isWebSocketSetup = useRef(false);


    useEffect(() => {

        (async () => {


            // actor = user_canister;
            actor = await get_user_actor();
            await get_initial_data();

            if (await agent.is_logged()) {
                dispatch(handleRedux('LOGIN'));
            }
            setState(true)

        })()
    }, []);

    return (
        <Theme>
            <SlateCustomContract/>
            {/*{state && <BrowserRouter>*/}
            {/*    <SearchPopper/>*/}
            {/*    <SnackbarProvider maxSnack={3}>*/}
            {/*        <RegistrationForm/>*/}
            {/*        <MessagesDialog/>*/}
            {/*        <NavAppBar/>*/}
            {/*        <NavBar>*/}
            {/*            <Pages/>*/}
            {/*        </NavBar>*/}
            {/*    </SnackbarProvider>*/}
            {/*</BrowserRouter>}*/}
        </Theme>
    )
        ;
}

export default App;
