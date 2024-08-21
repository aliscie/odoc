import React, {useEffect, useState} from "react";
import "./App.css";
import Pages from "./pages";
import {BrowserRouter} from "react-router-dom";
import InitialDataFetcher from "./redux/initialData/InitialDataFetcher";

import {SnackbarProvider, useSnackbar} from "notistack";
import {handleRedux} from "./redux/store/handleRedux";
import {useDispatch, useSelector} from "react-redux";
import useSocket from "./websocket/use_socket";
import { CircularProgress, Box } from "@mui/material";
import NavBar from "./components/MainComponents/NavBar";
import TopNavBar from "./components/MainComponents/TopNavBar";
import RegistrationForm from "./components/MainComponents/RegistrationForm";
import TopDialog from "./components/MuiComponents/TopDialog";
import MessagesDialogBox from "./components/ChatSendMessage/MessagesBoxDialog";
import SearchPopper from "./components/SearchComponent";

const App: React.FC = () => {
    const dispatch = useDispatch();
    const {ws} = useSocket();
    const {enqueueSnackbar} = useSnackbar();
    const {isLoggedIn, anonymous} = useSelector((state: any) => state.filesState);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            try {
                if (isLoggedIn) {
                    dispatch(handleRedux('LOGIN'));
                } else {
                    enqueueSnackbar("Please login to continue", {variant: "info"});
                }
                setLoggedIn(true);
            } catch (error) {
                console.error("Error initializing app:", error);
                setLoggedIn(true);
            }
        })();
    }, [dispatch]);

    return (
        <>
            {loggedIn ? (
                <BrowserRouter>
                    <SearchPopper/>
                    <SnackbarProvider maxSnack={3}>
                        <RegistrationForm/>
                        <MessagesDialogBox/>
                        <TopNavBar/>
                        <TopDialog/>
                        <NavBar>
                            <Pages/>
                        </NavBar>
                        <InitialDataFetcher/>
                    </SnackbarProvider>
                </BrowserRouter>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box>
            )}
        </>
    );
};

export default App;