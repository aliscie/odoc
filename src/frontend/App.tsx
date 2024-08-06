import React, { useEffect, useState } from "react";
import "./App.css";
import NavBar from "./components/Specific/NavBar";
import Pages from "./pages/main";
import { BrowserRouter } from "react-router-dom";
import { getInitialData } from "./redux/initialData/getInitialData";
import TopNavBar from "./components/Specific/TopNavBar";
import SearchPopper from "./components/Specific/SearchPopper";
// import Theme from "./components/genral/theme_provider";
import { SnackbarProvider } from "notistack";
import RegistrationForm from "./components/Specific/RegistrationForm";
import Regist
import { handleRedux } from "./redux/store/handleRedux";
import { useDispatch } from "react-redux";
import MessagesDialog from "./components/Chat/MessagesBoxDialog";
import useSocket from "./websocket/use_socket";
import { CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import TopDialog from "./components/General/TopDialog";
import OdocEditor from "odoc_editor_v2";
import { useBackendContext } from "./contexts/BackendContext";

interface Plugin {
    plugin: any; 
    key: string;
    icon: React.ReactNode;
}

const App: React.FC = () => {
    const dispatch = useDispatch();
    const { ws } = useSocket();
    const { enqueueSnackbar } = useSnackbar();
    const { isAuthenticated } = useBackendContext();

    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
          try {
            await getInitialData();
            if (isAuthenticated) {
              dispatch(handleRedux('LOGIN'));
            } else {
              enqueueSnackbar("Please login to continue", { variant: "info" });
            }
            setLoggedIn(true);
          } catch (error) {
            console.error("Error initializing app:", error);
            setLoggedIn(true);
          }
        })();
    }, [dispatch]);

    const onInsertComponent = (component: any): void => {
        console.log(component);
    };

    const onChange = (value: any): void => {
        console.log({ value });
    };

    const extraPlugins: Plugin[] = [
        // { plugin: createAmazingPlugin, key: KEY_AMAZING, icon: Icons.kbd }
    ];

    const initialValue = [
        {
            id: "lkdf",
            type: 'h1',
            children: [{ text: "This is a paragraph." }]
        },
        {
            id: "98ryw",
            type: 'amazing',
            children: [{ text: "Amazing" }],
            data: "test",
        }
    ];

    const mentions = [
        { key: '0', text: 'Aayla Secura' },
        { key: '1', text: 'Adi Gallia' },
    ];

    return (
        <>
          {loggedIn ? (
            <BrowserRouter>
              <SearchPopper />
              <SnackbarProvider maxSnack={3}>
                <RegistrationForm />
                <MessagesDialog />
                <TopNavBar />
                <TopDialog />
                <NavBar>
                  {/* <OdocEditor
                    initialValue={initialValue}
                    onChange={onChange}
                    extraPlugins={extraPlugins}
                    onInsertComponent={onInsertComponent}
                    mentions={mentions}
                  /> */}
                  <Pages />
                </NavBar>
              </SnackbarProvider>
            </BrowserRouter>
          ) : (
            <CircularProgress
              size="100px"
              style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            />
          )}
        </>
      );
}

export default App;
