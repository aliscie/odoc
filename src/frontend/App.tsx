import React, {useEffect} from "react";
import "./App.css";
import Pages from "./pages";
import { BrowserRouter } from "react-router-dom";
import useInitialData from "./redux/initialData/useInitialData";
import { SnackbarProvider } from "notistack";
import NavBar from "./components/MainComponents/NavBar";
import TopNavBar from "./components/MainComponents/TopNavBar";
import RegistrationForm from "./components/MainComponents/RegistrationForm";
import SearchPopper from "./components/SearchComponent";
import useSocket from "./websocket/use_socket";
import { useBackendContext } from "./contexts/BackendContext";
import { Box, CircularProgress } from "@mui/material";

const App: React.FC = () => {
  const { backendActor } = useBackendContext();
  useInitialData();
  useSocket();

  let Loadder = (
    <Box
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // This will make it center vertically for the whole viewport
      }}
    >
      <CircularProgress size={100} />
    </Box>
  );
  if (!backendActor) {
    return Loadder;
  }

  useEffect(() => {
      (async ()=>{
          // let res = backendActor?.getInitialData()
      })()
  },[])

  return (
    <BrowserRouter>
      <SearchPopper />
      <SnackbarProvider maxSnack={3}>
        <RegistrationForm />
        <TopNavBar />
        <NavBar>
          <Pages />
        </NavBar>
      </SnackbarProvider>
    </BrowserRouter>
  );
};

export default App;
