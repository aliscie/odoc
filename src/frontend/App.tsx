import React from "react";
import "./App.css";
import Pages from "./pages";
import {BrowserRouter} from "react-router-dom";
import useInitialData from "./redux/initialData/useInitialData";

import {SnackbarProvider} from "notistack";
import NavBar from "./components/MainComponents/NavBar";
import TopNavBar from "./components/MainComponents/TopNavBar";
import RegistrationForm from "./components/MainComponents/RegistrationForm";
import MessagesDialogBox from "./components/ChatSendMessage/MessagesBoxDialog";
import SearchPopper from "./components/SearchComponent";
import useSocket from "./websocket/use_socket";

const App: React.FC = () => {
    const {} = useInitialData();
    const {ws} = useSocket();

    return (
        <BrowserRouter>
            <SearchPopper/>
            <SnackbarProvider maxSnack={3}>
                <useInitialData/>
                <RegistrationForm/>
                <MessagesDialogBox/>
                <TopNavBar/>
                <NavBar>
                    <Pages/>
                </NavBar>
            </SnackbarProvider>
        </BrowserRouter>
    );
};

export default App;
