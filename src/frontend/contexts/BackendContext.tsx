import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, ActorMethod, ActorSubclass, HttpAgent, Identity } from "@dfinity/agent";
import { canisterId, idlFactory } from "../../declarations/backend";
import { _SERVICE } from "../../declarations/backend/backend.did";
import { useDispatch, useSelector } from "react-redux";
import getLedgerActor from "./ckudc_ledger_actor";
import { useTheme, useMediaQuery } from "@mui/material";
import { useSiweIdentity } from "ic-use-siwe-identity";
import { useAccount, useDisconnect } from "wagmi";
import { useSession } from 'next-auth/react';

interface State {
  principal: string | null;
  identity: Identity | null;
  backendActor: ActorSubclass<Record<string, ActorMethod<unknown[], unknown>>> | null;
  agent: HttpAgent | null;
  isAuthenticating?: boolean;
  ckUSDCActor?: any;
  loginMethod?: 'internet-identity' | 'metamask';
}

interface BackendContextProps extends State {
  authClient: AuthClient | null;
  login: () => Promise<void>;
  loginWithMetaMask: () => Promise<void>;
  logout: () => void;
}

const BackendContext = createContext<BackendContextProps | undefined>(undefined);

export const useBackendContext = (): BackendContextProps => {
  const context = useContext(BackendContext);
  if (!context) {
    throw new Error("useBackendContext must be used within a BackendProvider");
  }
  return context;
};

const createAuthClient = async (): Promise<AuthClient> => {
  return await AuthClient.create();
};

const createHttpAgent = async (identity: Identity, host: string): Promise<HttpAgent> => {
  const agent = new HttpAgent({
    identity,
    host,
  });

  if (import.meta.env.VITE_DFX_NETWORK === "local") {
    await agent.fetchRootKey()
      .then(() => console.log("Successfully fetched root key"))
      .catch((err) => console.log("Error fetching root key: ", err));
  }

  return agent;
};

const createBackendActor = (agent: HttpAgent): ActorSubclass<Record<string, ActorMethod<unknown[], unknown>>> => {
  return Actor.createActor<_SERVICE>(idlFactory, {
    agent,
    canisterId,
  });
};

const getIdentityProvider = (port: string): string => {
  if (import.meta.env.VITE_DFX_NETWORK === "local") {
    return `http://${import.meta.env.VITE_INTERNET_IDENTITY}.localhost:${port}`;
  }
  return "https://identity.ic0.app/#authorize";
};

const getHost = (): string => {
  return import.meta.env.VITE_DFX_NETWORK === "local" 
    ? import.meta.env.VITE_IC_HOST 
    : "https://ic0.app";
};

async function handleAgent(client: AuthClient, siweIdentity?: Identity) {
  const host = getHost();
  let identity: Identity;
  let principal: string;
  const identityComputer = await client.getIdentity();
  console.log({identityComputer,siweIdentity});
  if (siweIdentity) {
    identity = siweIdentity;
    principal = identity.getPrincipal().toString();
  } else {
    identity = identityComputer;
    principal = identity.getPrincipal().toString();
  }

  const agent = await createHttpAgent(identity, host);
  const actor = createBackendActor(agent);
  
  return { actor, agent, principal, identity, client };
}

interface BackendProviderProps {
  children: ReactNode;
}

export const BackendProvider: React.FC<BackendProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const port = import.meta.env.VITE_DFX_PORT;
  const { disconnect } = useDisconnect();
  const { isConnected: isWagmiConnected } = useAccount();
  const { identity: siweIdentity, login: MetaMaskLogin, loginStatus: prepareLoginStatus } = useSiweIdentity();
  const { data: session } = useSession();
  
  console.log({loginStatus: prepareLoginStatus, siweIdentity, session},'siweIdentity');

  const [state, setState] = useState<State>({
    principal: null,
    identity: null,
    backendActor: null,
    agent: null,
  });

  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const { isLoggedIn } = useSelector((state: any) => state.uiState);

  const login = async () => {
    if (!authClient) {
      console.log("Auth client not initialized");
      return;
    }

    const alreadyAuthenticated = await authClient.isAuthenticated();

    if (alreadyAuthenticated) {
      // dispatch({type:'LOGIN'});
    } else {
      const identityProvider = getIdentityProvider(port);
      setState(prevState => ({ ...prevState, isAuthenticating: true }));
      
      await authClient.login({
        identityProvider,
        onSuccess: async () => {
          dispatch({type:"LOGIN"});
        },
      });
    }
  }

  // Update loginWithMetaMask to handle RainbowKit integration
  const loginWithMetaMask = async () => {
    console.log(siweIdentity, 'Attempting to connect with MetaMask...');
    
    // First check if wallet is connected
    if (!isWagmiConnected && !session?.address) {
      console.error("Wallet not connected. Please connect your wallet first.");
      return;
    }
    
    setState(prevState => ({
      ...prevState,
      isAuthenticating: true,
      loginMethod: 'metamask'
    }));
    
    try {
      // If we have a session from NextAuth, we're already authenticated
      if (session?.address) {
        dispatch({type: "LOGIN"});
        return;
      }
      
      if (!siweIdentity) {
        let res = await MetaMaskLogin();
        console.log(res, 'MetaMaskLogin');
        
        if (res) {
          dispatch({type: "LOGIN"});
        } else {
          setState(prevState => ({
            ...prevState,
            isAuthenticating: false
          }));
          console.error("Failed to login with MetaMask");
        }
      }
    } catch (error) {
      console.error("MetaMask login error:", error);
      setState(prevState => ({
        ...prevState,
        isAuthenticating: false
      }));
    }
  }

  const logout = useCallback(() => {
    if (siweIdentity) {
      // siweLogout?.();
    }
    
    if (state.loginMethod === 'metamask' && siweIdentity) {
      disconnect();
    } else if (!siweIdentity) {
      dispatch({type:"LOGOUT"});
      authClient?.logout({ returnTo: "/" });
    }
    
    setState({
      principal: null,
      identity: null,
      backendActor: null,
      agent: null,
      loginMethod: undefined
    });
  }, [dispatch, authClient, state.loginMethod, siweIdentity, disconnect]);

  useEffect(() => {
    const initializeAuthClient = async () => {
      const client = await createAuthClient();
      setAuthClient(client);
      const { actor, agent, principal, identity } = await handleAgent(client, siweIdentity);
      const ckUSDCActor = await getLedgerActor(agent);
      
      setState(prevState => ({
        ...prevState,
        ckUSDCActor,
        backendActor: actor,
        agent,
        principal,
        identity,
        loginMethod: siweIdentity ? 'metamask' : undefined
      }));

      const alreadyAuthenticated = await client.isAuthenticated();
      if (alreadyAuthenticated) {
        dispatch({type:'LOGIN'});
      }
    };

    initializeAuthClient().catch((error) => {
      console.log("Failed to initialize auth client:", error);
    });
  }, [isLoggedIn, dispatch, siweIdentity]);

  // Auto-login effect for MetaMask when conditions are met
  // useEffect(() => {
  //   if (isWagmiConnected && prepareLoginStatus === 'success' && !siweIdentity) {
  //     loginWithMetaMask();
  //   }
  // }, [isWagmiConnected, prepareLoginStatus, siweIdentity]);

  // Add effect to handle session changes
  useEffect(() => {
    if (session?.address) {
      console.log("User authenticated via SIWE:", session.address);
      dispatch({type: "LOGIN"});
    }
  }, [session, dispatch]);

  const contextValue = {
    ...state,
    authClient,
    login,
    loginWithMetaMask,
    logout,
  };

  return (
    <BackendContext.Provider value={contextValue}>
      {children}
    </BackendContext.Provider>
  );
};

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (request: { method: string; params?: any[] }) => Promise<any>;
      on: (eventName: string, callback: (...args: any[]) => void) => void;
    };
  }
}