import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import "./App.css";
import Pages from "./pages";
import {BrowserRouter} from "react-router-dom";
import useInitialData from "./redux/initialData/useInitialData";
import {useSnackbar} from "notistack";
import NavBar from "./components/MainComponents/NavBar";
import TopNavBar from "./components/MainComponents/topNavBar";
import SearchPopper from "./components/SearchComponent";
import useSocket from "./websocket/use_socket";
import {useBackendContext} from "./contexts/BackendContext";
import {Box, CircularProgress, styled, useTheme} from "@mui/material";
import {Principal} from "@dfinity/principal";
import PromoNotification from "./components/limitedOffer";
import BetaWarning from "./betWarning";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";

// Create a styled component for the main content
const MainContent = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  transition: theme.transitions.create(["background-color", "color"], {
    duration: theme.transitions.duration.standard,
  }),
}));

// Create a styled component for the page content
const PageContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  paddingTop: theme.spacing(8), // Height of Index
  [theme.breakpoints.down("sm")]: {
    paddingTop: 0, // No top padding on mobile since Index is at bottom
    paddingBottom: theme.spacing(7), // Space for bottom mobile navigation
  },
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundColor: theme.palette.background.default,
}));

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state: any) => state.filesState);
  const { backendActor, ckUSDCActor } = useBackendContext();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  useInitialData();
  useSocket();

  useEffect(() => {
    if (backendActor && ckUSDCActor && profile?.id) {
      (async () => {
        // console.log("Checking CKUSDT balance...");
        // console.log({ res });
        try {
          const balance = await ckUSDCActor.icrc1_balance_of({
            owner: Principal.fromText(profile.id),
            subaccount: [],
          });

          if (Number(balance) > 0) {
            enqueueSnackbar(`Depositing ${Number(balance)} CKUSDT...`, {
              variant: "info",
              persist: true,
              action: (key) => (
                <CircularProgress
                  size={24}
                  sx={{ color: theme.palette.primary.contrastText }}
                />
              ),
            });

            const result = await backendActor.deposit_ckusdt();
            if (result?.Ok) {
              dispatch({ type: "SET_WALLET", wallet: result.Ok });
              enqueueSnackbar(
                `Successfully deposited ${Number(balance)} CKUSDT`,
                { variant: "success" },
              );
            }
          }
        } catch (error) {
          console.error("Error checking/depositing CKUSDT:", error);
        }
      })();
    }
  }, [backendActor, ckUSDCActor, profile, theme.palette.primary.contrastText]);

  if (!backendActor) {
    return (
      <LoadingContainer>
        <CircularProgress
          size={100}
          sx={{ color: theme.palette.primary.main }}
        />
      </LoadingContainer>
    );
  }

  // document.querySelector("body")?.classList.add("dark");
  // const isDarkMode = localStorage.getItem("isDarkMode") === "true";
  // !isDarkMode && document.querySelector("body")?.classList.remove("dark");

  return (
    <BrowserRouter>
      <MainContent>
        <BetaWarning />

        <SearchPopper />
        <PromoNotification />
        <TopNavBar />
        <DndProvider backend={HTML5Backend}>
          <NavBar>
            <PageContainer>
              <Pages />
            </PageContainer>
          </NavBar>
        </DndProvider>
      </MainContent>
    </BrowserRouter>
  );
};

export default App;
