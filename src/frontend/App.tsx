import React, {useEffect, useRef, useState} from "react";
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
import {ActorSubclass, SignIdentity} from "@dfinity/agent";
import {_SERVICE} from "../declarations/user_canister/user_canister.did";
import {canisterId, user_canister} from "../declarations/user_canister";
import IcWebSocket, {createWsConfig} from "ic-websocket-js";
import {AuthClient} from "@dfinity/auth-client";
import {logger} from "./dev_utils/log_data";

export let actor: ActorSubclass<_SERVICE> | undefined;


function App() {
    const dispatch = useDispatch();
    const [state, setState] = useState(false);

    // Use a ref to track whether the WebSocket has already been set up
    const isWebSocketSetup = useRef(false);

    useEffect(() => {
        (async () => {
            const gatewayUrl = "ws://127.0.0.1:8080";
            const icUrl = "http://127.0.0.1:4943";

            const authClient = await AuthClient.create();
            const _identity = authClient.getIdentity();

            // Check the ref before setting up the WebSocket
            if (await authClient.isAuthenticated() && !isWebSocketSetup.current) {
                const wsConfig = createWsConfig({
                    canisterId: canisterId,
                    canisterActor: user_canister,
                    identity: _identity as SignIdentity,
                    networkUrl: icUrl,
                });

                const ws = new IcWebSocket(gatewayUrl, undefined, wsConfig);

                ws.onopen = () => {
                    console.log("Connected to the canister");
                };

                ws.onmessage = async (event) => {
                    logger(event.data)
                    if (event.data.notification.length == 0) {
                        return
                    }

                    // check if the key is `FriendRequest` or ContractUpdate in event.data.notification[0].content[key]
                    let keys = Object.keys(event.data.notification[0].content);
                    // dispatch(handleRedux('NOTIFY', {title: event.data.text}));

                    let notification_list = actor && await actor.get_notifications();
                    dispatch(handleRedux('UPDATE_NOTIFY', {new_list: notification_list}));
                    if ("FriendRequest" in keys) {
                        // TODO this does not seams to update live.
                        let new_friends = actor && await actor.get_friends();
                        new_friends && dispatch(handleRedux("UPDATE_FRIEND", {friends: new_friends[0]}))


                    } else if ("ContractUpdate" in keys) {
                        // let new_contracts = actor && await actor.get_contracts();
                        // new_contracts && dispatch(handleRedux("UPDATE_CONTRACT", {contracts: new_contracts[0]}))
                    }
                };

                ws.onclose = () => {
                    console.log("Disconnected from the ws canister");
                };

                ws.onerror = (error) => {
                    console.log("Error:", error);
                };

                // Update the ref to indicate that the WebSocket has been set up
                isWebSocketSetup.current = true;
            }
        })();
    }, []);


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
