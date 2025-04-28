import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import store from "./redux/store";
import ThemeProvider from "./ThemeProvider";
import { BackendProvider } from "./contexts/BackendContext";
import { SnackbarProvider } from "notistack";
import { WagmiProvider } from "wagmi";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { mainnet } from "wagmi/chains";
import { canisterId, idlFactory } from "$/declarations/backend";
import { _SERVICE } from "$/declarations/backend/backend.did";
import { SiweIdentityProvider } from "ic-use-siwe-identity";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth';
import { SessionProvider } from 'next-auth/react';
import "@rainbow-me/rainbowkit/styles.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('Root element with id "root" not found in the document');
}

const root = createRoot(rootElement);

const config = getDefaultConfig({
  appName: "ODOC App",
  projectId: "YOUR_PROJECT_ID", // Replace with your actual project ID
  chains: [mainnet],
  ssr: true, // Changed from false to true to match tutorial
});

const queryClient = new QueryClient();

// SIWE message configuration
const getSiweMessageOptions = () => ({
  statement: "Sign in to ODOC with your Ethereum account",
});

root.render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider refetchInterval={0}>
          <RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
            <RainbowKitProvider>
              <Provider store={store}>
                <ThemeProvider>
                  <SiweIdentityProvider<_SERVICE>
                    canisterId={canisterId}
                    idlFactory={idlFactory}
                  >
                    <BackendProvider>
                      <SnackbarProvider
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        maxSnack={3}
                      >
                        <App />
                      </SnackbarProvider>
                    </BackendProvider>
                  </SiweIdentityProvider>
                </ThemeProvider>
              </Provider>
            </RainbowKitProvider>
          </RainbowKitSiweNextAuthProvider>
        </SessionProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
