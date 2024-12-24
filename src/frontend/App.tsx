import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import Pages from "./pages";
import { BrowserRouter } from "react-router-dom";
import useInitialData from "./redux/initialData/useInitialData";
import { useSnackbar } from "notistack";
import NavBar from "./components/MainComponents/NavBar";
import TopNavBar from "./components/MainComponents/TopNavBar";
import RegistrationForm from "./components/MainComponents/RegistrationForm";
import SearchPopper from "./components/SearchComponent";
import useSocket from "./websocket/use_socket";
import { useBackendContext } from "./contexts/BackendContext";
import { Box, CircularProgress } from "@mui/material";
import { Principal } from "@dfinity/principal";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state: any) => state.filesState);
  const { backendActor, ckUSDCActor } = useBackendContext();
  const { enqueueSnackbar } = useSnackbar();
  useInitialData();
  useSocket();

  useEffect(() => {
    if (backendActor && ckUSDCActor && profile?.id) {
      (async () => {
        try {
          // Check CKUSDT balance first
          const balance = await ckUSDCActor.icrc1_balance_of({
            owner: Principal.fromText(profile.id),
            subaccount: [],
          });

          if (Number(balance) > 0) {
            enqueueSnackbar(`Depositing ${Number(balance)} CKUSDT...`, {
              variant: "info",
              persist: true,
              action: (key) => <CircularProgress size={24} color="inherit" />,
            });

            const result = await backendActor.deposit_ckusdt();
            console.log("Deposit CKUSDT result:", result);
            if (result?.Ok) {
              // Update wallet state in Redux
              dispatch({ type: "SET_WALLET", wallet: result.Ok });
              enqueueSnackbar(
                `Successfully deposited ${Number(balance)} CKUSDT`,
                {
                  variant: "success",
                },
              );
            }
          }
        } catch (error) {
          console.error("Error checking/depositing CKUSDT:", error);
        }
      })();
    }
  }, [backendActor, ckUSDCActor, profile, dispatch]);

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

  return (
    <BrowserRouter>
      <SearchPopper />

      <RegistrationForm />
      <TopNavBar />
      <NavBar>
        <Pages />
      </NavBar>
    </BrowserRouter>
  );
};

export default App;
