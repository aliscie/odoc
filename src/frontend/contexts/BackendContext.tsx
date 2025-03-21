import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, ActorMethod, ActorSubclass, HttpAgent, Identity } from "@dfinity/agent";
import { canisterId, idlFactory } from "../../declarations/backend";
import { _SERVICE } from "../../declarations/backend/backend.did";
import { useDispatch, useSelector } from "react-redux";
import getLedgerActor from "./ckudc_ledger_actor";
import { useTheme, useMediaQuery } from "@mui/material";
import { MsqClient } from "@fort-major/msq-client";

// Types and Interfaces
interface State {
  principal: string | null;
  identity: Identity | null;
  backendActor: ActorSubclass<Record<string, ActorMethod<unknown[], unknown>>> | null;
  agent: HttpAgent | null;
  isAuthenticating?: boolean;
  ckUSDCActor?: any;
}

interface BackendContextProps extends State {
  authClient: AuthClient | null;
  login: () => Promise<void>;
  loginWithMetaMask: () => Promise<void>;
  logout: () => void;
}

// Context
const BackendContext = createContext<BackendContextProps | undefined>(undefined);

// Custom Hooks
export const useBackendContext = (): BackendContextProps => {
  const context = useContext(BackendContext);
  if (!context) {
    throw new Error("useBackendContext must be used within a BackendProvider");
  }
  return context;
};

// Helper Functions
const createAuthClient = async (): Promise<AuthClient> => {
  return await AuthClient.create();
};

const createMsqAgent = async (identity: Identity, host: string): Promise<HttpAgent> => {
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

async function handleAgent(client: AuthClient) {
  const host = getHost();

  // Check if the user is connected to MSQ first
  let identity: Identity;
  let principal: string;
  
  if (window.ic?.msq) {
    try {
      const isConnected = await window.ic.msq.isConnected();
      if (isConnected) {
        // Use MSQ identity if connected
        identity = await window.ic.msq.connect({
          whitelist: [canisterId],
          host: host
        });
        principal = identity.getPrincipal().toString();
        console.log('Using MSQ identity:', principal);
      } else {
        // Fall back to Internet Identity if not connected to MSQ
        identity = await client.getIdentity();
        principal = identity.getPrincipal().toString();
      }
    } catch (error) {
      // Fall back to Internet Identity if MSQ check fails
      console.error('Error checking MSQ connection:', error);
      identity = await client.getIdentity();
      principal = identity.getPrincipal().toString();
    }
  } else {
    // MSQ not available, use Internet Identity
    identity = await client.getIdentity();
    principal = identity.getPrincipal().toString();
  }

  const agent = await createMsqAgent(identity, host);
  const actor = createBackendActor(agent);
  
  return { actor, agent, principal, identity, client };
}

// Main Provider Component
interface BackendProviderProps {
  children: ReactNode;
}

export const BackendProvider: React.FC<BackendProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const port = import.meta.env.VITE_DFX_PORT;

  const [state, setState] = useState<State>({
    principal: null,
    identity: null,
    backendActor: null,
    agent: null,
  });

  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const { isLoggedIn } = useSelector((state: any) => state.uiState);

  // Check for MSQ session
  useEffect(() => {
    const checkMsqSession = async () => {
      try {

        
        // Check if it's safe to resume the session
        if (MsqClient.isSafeToResume()) {
          console.log('MSQ session can be resumed');
          const result = await MsqClient.createAndLogin();
          
          if ("Ok" in result) {
            const { msq, identity } = result.Ok;
            const host = getHost();
            const agent = await createMsqAgent(identity, host);
            const actor = createBackendActor(agent);
            const principal = identity.getPrincipal().toString();
            
            setState(prevState => ({
              ...prevState,
              principal,
              identity,
              backendActor: actor,
              agent,
              isAuthenticating: false
            }));
            
            dispatch({type:'LOGIN'});
          }
        }
      } catch (error) {
        console.error('Error checking MSQ session:', error);
      }
    };
    
    // Only check when not already authenticated
    if (!state.principal && !state.isAuthenticating) {
      checkMsqSession();
    }
  }, [state.principal, state.isAuthenticating, dispatch]);

  // Handle MSQ redirect
  const handleRedirectCallback = useCallback(async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const msqAuthToken = urlParams.get('msqAuthToken');
      
      if (!msqAuthToken) return;
      

      const result = await MsqClient.processRedirect(msqAuthToken);
      
      if ("Ok" in result) {
        const { msq, identity } = result.Ok;
        const host = getHost();
        const agent = await createMsqAgent(identity, host);
        const actor = createBackendActor(agent);
        const principal = identity.getPrincipal().toString();
        
        setState({
          principal,
          identity,
          backendActor: actor,
          agent,
          isAuthenticating: false
        });
        
        dispatch({type:'LOGIN'});
        
        // Clean up URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        console.error('Error processing MSQ redirect:', result.Err);
      }
    } catch (error) {
      console.error('Error processing redirect:', error);
    }
  }, [dispatch]);
  
  // Check for redirects
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('msqAuthToken')) {
      handleRedirectCallback();
    }
  }, [handleRedirectCallback]);

  // Standard login
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

  // MetaMask login
  const loginWithMetaMask = useCallback(async () => {
    try {
      setState(prevState => ({
        ...prevState,
        isAuthenticating: true,
      }));
  
      // Check if MetaMask is available first
      if (!window.ethereum) {
        alert('MetaMask is required for this login method. Please install MetaMask first.');
        setState(prevState => ({
          ...prevState,
          isAuthenticating: false,
        }));
        return;
      }

      
      // Save the current URL to session storage
      // sessionStorage.setItem('msqRedirectUrl', window.location.href);
      
      // Get the result of the login attempt
      const result = await MsqClient.createAndLogin();
      
      if ("Ok" in result) {
        const { msq, identity } = result.Ok;
        const host = getHost();
        const agent = await createMsqAgent(identity, host);
        const actor = createBackendActor(agent);
        const principal = identity.getPrincipal().toString();
        

        
        // Try to get user's pseudonym and avatar
        try {
          const pseudonym = await identity.getPseudonym?.();
          const avatarSrc = await identity.getAvatarSrc?.();

          console.log('User avatar:', avatarSrc);
        } catch (err) {
          console.log('Could not get user pseudonym or avatar', err);
        }
        
        setState(prevState => ({
          ...prevState,
          isAuthenticating: false,
          principal,
          identity,
          backendActor: actor,
          agent,
        }));
        
        dispatch({type:"LOGIN"});
      } else {
        // Handle specific MSQ errors
        console.error('MSQ connection error:', result.Err);
        
        if (result.Err === 'MSQConnectionRejected') {
          alert('MSQ connection was rejected. Please try again and approve the connection.');
          window.location.reload();
        } else {
          // reload the page
          alert(`Failed to connect with MSQ: ${result.Err}`);
          window.location.reload();
        }
        
        setState(prevState => ({
          ...prevState,
          isAuthenticating: false,
        }));
      }
    } catch (error) {
      console.error('Error connecting with MSQ:', error);
      alert('An error occurred when connecting to MSQ. Please try again.');
      setState(prevState => ({
        ...prevState,
        isAuthenticating: false,
      }));
    }
  }, [dispatch]);

  // Logout function
  const logout = useCallback(() => {
    // Check if MSQ is available and attempt to disconnect
    if (window.ic?.msq) {
      window.ic.msq.requestLogout()
        .then(success => {
          console.log('MSQ logout ' + (success ? 'successful' : 'rejected'));
        })
        .catch(err => {
          console.error('Error during MSQ logout:', err);
        });
    } 
    // Standard logout for Internet Identity
    dispatch({type:"LOGOUT"});
    authClient?.logout({ returnTo: "/" });
    
    // Reset state
    setState({
      principal: null,
      identity: null,
      backendActor: null,
      agent: null,
    });
  }, [dispatch, authClient]);

  // Initialize the authentication client
  useEffect(() => {
    const initializeAuthClient = async () => {
      const client = await createAuthClient();
      setAuthClient(client);
      const { actor, agent, principal, identity } = await handleAgent(client);
      const ckUSDCActor = await getLedgerActor(agent);
      
      setState(prevState => ({
        ...prevState,
        ckUSDCActor,
        backendActor: actor,
        agent,
        principal,
        identity,
      }));

      const alreadyAuthenticated = await client.isAuthenticated();
      if (alreadyAuthenticated) {
        dispatch({type:'LOGIN'});
      }
    };

    initializeAuthClient().catch((error) => {
      console.log("Failed to initialize auth client:", error);
    });
  }, [isLoggedIn, dispatch]);

  // Context value with all the necessary props
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

// TypeScript declarations for window extensions
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (request: { method: string; params?: any[] }) => Promise<any>;
      on: (eventName: string, callback: (...args: any[]) => void) => void;
    };
    ic?: {
      msq?: {
        connect: (options: {
          whitelist: string[];
          host?: string;
        }) => Promise<Identity>;
        disconnect: () => Promise<void>;
        requestLogout: () => Promise<boolean>;
        getPrincipal: () => Promise<string>;
        isConnected: () => Promise<boolean>;
      };
    };
  }
}