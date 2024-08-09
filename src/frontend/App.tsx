import React, { useState, useEffect } from "react";
import "./App.css";
import NavBar from "./components/Specifics/NavBar";
import Pages from "./pages/main";
import { BrowserRouter } from "react-router-dom";
import InitialDataFetcher from "./redux/initialData/InitialDataFetcher";
import TopNavBar from "./components/Specifics/TopNavBar";
import SearchPopper from "./components/Specifics/SearchPopper";
// import Theme from "./components/genral/theme_provider";
import { SnackbarProvider } from "notistack";
import RegistrationForm from "./components/Specifics/RegistrationForm";
import { handleRedux } from "./redux/store/handleRedux";
import { useDispatch } from "react-redux";
import MessagesDialog from "./components/Chat/MessagesBoxDialog";
import useSocket from "./websocket/use_socket";
import { CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import TopDialog from "./components/General/TopDialog";
import OdocEditor from "odoc_editor_v2";
import { useBackendContext } from "./contexts/BackendContext";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { ws } = useSocket();
  const { enqueueSnackbar } = useSnackbar();
  const { isAuthenticated } = useBackendContext();

  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
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
            <InitialDataFetcher /> {/* Add the component here */}
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
};

export default App;