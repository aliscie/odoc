import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, ActorMethod, ActorSubclass, HttpAgent, Identity } from "@dfinity/agent";
import { canisterId, idlFactory } from "../../declarations/backend";

interface BackendContextProps {
  authClient: AuthClient | null;
  agent: HttpAgent | null;
  backendActor: ActorSubclass<Record<string, ActorMethod<unknown[], unknown>>> | null;
  isAuthenticating: boolean;
  isAuthenticated: boolean;
  hasLoggedIn: boolean;
  login: () => Promise<void>;
  logout: () => void;
  identity: Identity | null;
  principal: string | null;
}

const BackendContext = createContext<BackendContextProps | undefined>(undefined);

export const useBackendContext = (): BackendContextProps => {
  const context = useContext(BackendContext);
  if (!context) {
    throw new Error("useBackendContext must be used within a BackendProvider");
  }
  return context;
};

interface BackendProviderProps {
  children: ReactNode;
}

export const BackendProvider: React.FC<BackendProviderProps> = ({ children }) => {
  const port = import.meta.env.VITE_DFX_PORT;

  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [hasLoggedIn, setHasLoggedIn] = useState<boolean>(false);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [agent, setAgent] = useState<HttpAgent | null>(null);
  const [backendActor, setBackendActor] = useState<ActorSubclass<Record<string, ActorMethod<unknown[], unknown>>> | null>(null);
  const [principal, setPrincipal] = useState<string | null>(null);

  const login = useCallback(async () => {
    if (!authClient) return;
    const alreadyAuthenticated = await authClient.isAuthenticated();
    if (alreadyAuthenticated) {
      setIsAuthenticated(true);
      setHasLoggedIn(true);
    } else {
      setIsAuthenticating(true);
      authClient.login({
        identityProvider: 
          import.meta.env.VITE_DFX_NETWORK === "ic" ? "https://identity.ic0.app/#authorize" :
          import.meta.env.VITE_DFX_NETWORK === "playground" ? "https://identity.ic0.app/#authorize" :
          import.meta.env.VITE_DFX_NETWORK === "local" ? `http://${import.meta.env.VITE_INTERNET_IDENTITY}.localhost:${port}` :
          undefined,
        onSuccess: async () => {
          setIsAuthenticating(false);
          setIsAuthenticated(true);
          setHasLoggedIn(true);
        },
      });
    }
  }, [authClient, port]);

  const logout = () => {
    setIsAuthenticated(false);
    authClient?.logout({ returnTo: "/" });
  };

  useEffect(() => {
    if (!authClient) {
      setIsAuthenticating(true);
      AuthClient.create().then(async (client) => {
        await client.isAuthenticated();
        setIsAuthenticating(false);
        setAuthClient(client);
      });
    }
  }, [authClient]);

  useEffect(() => {
    const fetchData = async () => {
      if (authClient) {
        const authenticated = await authClient.isAuthenticated();
        if (authenticated) {
          const identity = authClient.getIdentity();
          setIdentity(identity);
          const principal = identity.getPrincipal().toString();
          setPrincipal(principal);
          console.log("Principal: ", principal);
          const agent = new HttpAgent({
            identity,
            host: import.meta.env.VITE_DFX_NETWORK === "local" ? "http://localhost:4943" : "https://icp0.io",
          });
          console.log("Agent: ", agent);
          setAgent(agent);

          const actor = Actor.createActor(idlFactory, {
            agent,
            canisterId,
          });
          setBackendActor(actor);
        }
      }
    };
    fetchData();
  }, [authClient]);

  return (
    <BackendContext.Provider
      value={{
        authClient,
        agent,
        backendActor,
        isAuthenticating,
        isAuthenticated,
        hasLoggedIn,
        login,
        logout,
        identity,
        principal,
      }}
    >
      {children}
    </BackendContext.Provider>
  );
};
