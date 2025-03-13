import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import Pages from "./pages";
import { BrowserRouter } from "react-router-dom";

import { useSnackbar } from "notistack";
import NavBar from "./components/MainComponents/NavBar";
import TopNavBar from "./components/MainComponents/topNavBar";
import SearchPopper from "./components/SearchComponent";
import useSocket from "./websocket/use_socket";
import { useBackendContext } from "./contexts/BackendContext";
import { Box, CircularProgress, styled, useTheme } from "@mui/material";
import { Principal } from "@dfinity/principal";
import PromoNotification from "./components/limitedOffer";
import BetaWarning from "./betWarning";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { canisterId } from "../declarations/backend";
import getckUsdcBalance from "./utils/getBalance";

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
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const theme = useTheme();
  
  // Extract isLoggedIn directly to ensure we get the primitive value
  const isLoggedIn = useSelector((state: any) => state.uiState.isLoggedIn);
  
  // Track previous login state to detect changes


  useEffect(() => {

    const fetchInitialData = async () => {

      if (!isLoggedIn || !backendActor) {
        return;
      }
      console.log("before")
      
      try {
        
        dispatch({type:"IS_FETCHING", isFetching: true });
  
        const res = await backendActor.get_initial_data();
        console.log({res})
  
        const workspaces = await backendActor.get_work_spaces();
        if ("Err" in res && res.Err == "Anonymous user.") {
          dispatch( { isRegistered: false, type:"IS_REGISTERED" });
        } else {
          dispatch( { isRegistered: true, type:"IS_REGISTERED" });
  
          const getProfileRes = await backendActor.get_user_profile(
            Principal.fromText(res.Ok.Profile.id),
          );
          dispatch({
            type:"INIT_FILES_STATE",
            data: { ...res.Ok, ProfileHistory: getProfileRes.Ok, workspaces },
          })
        }
      } catch (error) {
        console.log("Issue fetching initial data from backend: ", error);
      }
      dispatch({
        type:"IS_FETCHING",
        isFetching: false
      });
    };
  
    fetchInitialData();

  }, [isLoggedIn,backendActor]);

  
  useSocket();

  // Approve tokens
  const approveTokens = useCallback(
    async (amount) => {
      try {
        console.log("Approving tokens:", {
          amount: amount.toString(),
          spender: canisterId,
        });

        const approveResult = await ckUSDCActor.icrc2_approve({
          from_subaccount: [],
          spender: {
            owner: Principal.fromText(canisterId),
            subaccount: [],
          },
          amount: amount,
          expected_allowance: [],
          expires_at: [],
          fee: [],
          memo: [],
          created_at_time: [],
        });

        console.log("Approve result:", approveResult);
        return approveResult;
      } catch (error) {
        console.error("Error approving tokens:", error);
        throw error;
      }
    },
    [ckUSDCActor],
  );

  // Deposit tokens
  const depositTokens = useCallback(async () => {
    try {
      console.log("Calling deposit_ckusdt...");
      const result = await backendActor.deposit_ckusdt();
      console.log("Deposit result:", result);
      return result;
    } catch (error) {
      console.error("Error depositing tokens:", error);
      throw error;
    }
  }, [backendActor]);

  // Main deposit flow
  useEffect(() => {
    if (backendActor && ckUSDCActor && profile?.id) {
      (async () => {
        try {
          // 1. Get user balance
          const userBalance = await getckUsdcBalance(backendActor, profile.id);
          console.log("User balance:", userBalance);
          // 2. Check if user has balance
          if (Number(userBalance) <= 0) {
            console.log("User has no balance to deposit");
            return;
          }
          if (Number(userBalance) / 1_000_000 < 1) {
            // snackbar
            enqueueSnackbar(
              `You need at least 1 CKUSDT to deposit, otherwise your deposit will be lost in gas fees.`,
              { variant: "error" },
            );
            return;
          }

          // Show notification
          const notificationKey = enqueueSnackbar(
            `Processing deposit of ${Number(userBalance) / 1_000_000} CKUSDT...`,
            {
              variant: "info",
              persist: true,
              action: () => (
                <CircularProgress
                  size={24}
                  sx={{ color: theme.palette.primary.contrastText }}
                />
              ),
            },
          );

          try {
            // 4. Approve tokens
            await approveTokens(userBalance);

            enqueueSnackbar(`Tokens approved successfully`, {
              variant: "info",
            });

            // 5. Deposit tokens
            const depositResult = await depositTokens();

            // 7. Update UI based on result
            if (depositResult?.Ok) {
              dispatch({ type: "SET_WALLET", wallet: depositResult.Ok });
              closeSnackbar(notificationKey);
              enqueueSnackbar(
                `Successfully deposited ${Number(userBalance) / 1_000_000} CKUSDT`,
                { variant: "success" },
              );
            } else {
              closeSnackbar(notificationKey);
              enqueueSnackbar(
                `Deposit failed: ${JSON.stringify(depositResult)}`,
                { variant: "error" },
              );
            }
          } catch (operationError) {
            closeSnackbar(notificationKey);
            enqueueSnackbar(`Operation failed: ${operationError.toString()}`, {
              variant: "error",
            });
          }
        } catch (error) {
          console.error("Error in deposit flow:", error);
          enqueueSnackbar(`Error: ${error.toString()}`, { variant: "error" });
        }
      })();
    }
  }, [
    backendActor,
    ckUSDCActor,
    profile,
    theme.palette.primary.contrastText,
    dispatch,
    enqueueSnackbar,
    closeSnackbar,
    approveTokens,
    depositTokens,
  ]);

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