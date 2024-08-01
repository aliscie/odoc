import React, {useEffect, useState} from "react";
import "./App.css";
import NavBar from "./components/spesific/nav_bar";
import Pages from "./pages/main";
import {BrowserRouter} from "react-router-dom";
import TopNavBar from "./components/spesific/TopNavBar";
import SearchPopper from "./components/spesific/search_popper";
// import Theme from "./components/genral/theme_provider";
import {SnackbarProvider} from "notistack";
import RegistrationForm from "./components/spesific/registeration_form";
import {handleRedux} from "./redux/main";
import {useDispatch} from "react-redux";
import {agent} from "./backend_connect/main";
import {get_initial_data} from "./redux/files";
import {get_user_actor} from "./backend_connect/ic_agent";
import {ActorSubclass} from "@dfinity/agent";
import {_SERVICE} from "../declarations/backend/backend.did";
import MessagesDialog from "./components/chat/messages_box_dialog";
import useSocket from "./websocket/use_socket";
import {CircularProgress} from "@mui/material";
import TopDialog from "./components/genral/TopDialog";
import OdocEditor from "odoc_editor_v2";

export let actor: ActorSubclass<_SERVICE> | undefined; // TODo maybe set the actor in redux


function App() {
    const dispatch = useDispatch();
    const [state, setState] = useState(false);
    const {ws} = useSocket();

    // Use a ref to track whether the WebSocket has already been set up
    // const isWebSocketSetup = useRef(false);

    useEffect(() => {

        (async () => {
            // actor = backend;
            actor = await get_user_actor();
            await get_initial_data();

            if (await agent.is_logged()) {
                dispatch(handleRedux('LOGIN'));
            }
            setState(true)

        })()
    }, []);


    let onInsertComponent = (component: any) => {
        console.log(component);
    };

    let onChange = (value: any) => {
        console.log({value})
    };

    let extraPlugins = [
        // {plugin: createAmazingPlugin, key: KEY_AMAZING, icon: Icons.kbd}
    ];


    const initialValue = [
        {
            id: "lkdf",
            type: 'h1',
            children: [{text: "This is a paragraph."}]
        },
        {
            id: "98ryw",
            type: 'amazing',
            children: [{text: "Amaing"}],
            data: "test",

        }
    ]

    const mentions = [
        {key: '0', text: 'Aayla Secura'},
        {key: '1', text: 'Adi Gallia'},
    ];


    return (
        <>
            {state ? (
                <BrowserRouter>
                    <SearchPopper/>
                    <SnackbarProvider maxSnack={3}>
                        <RegistrationForm/>
                        <MessagesDialog/>
                        <TopNavBar/>
                        <TopDialog/>
                        <NavBar>
                            {/*<OdocEditor*/}
                            {/*    initialValue={initialValue}*/}
                            {/*    onChange={onChange}*/}
                            {/*    extraPlugins={extraPlugins}*/}
                            {/*    onInsertComponent={onInsertComponent}*/}
                            {/*    mentions={mentions}*/}
                            {/*/>*/}
                            <Pages/>
                        </NavBar>
                    </SnackbarProvider>
                </BrowserRouter>
            ) : (
                <CircularProgress
                    size="100px"
                    style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}
                />
            )}
        </>
    );
}

export default App;
