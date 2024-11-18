import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthClient } from "@dfinity/auth-client";
import {
  Actor,
  ActorMethod,
  ActorSubclass,
  HttpAgent,
  Identity,
} from "@dfinity/agent";
import { canisterId, idlFactory } from "../../declarations/backend";
import { _SERVICE } from "../../declarations/backend/backend.did";
import { useDispatch } from "react-redux";
import { handleRedux } from "../redux/store/handleRedux";
import getLedgerActor from "./ckudc_ledger_actor";

interface State {
  principal: string | null;
  identity: Identity | null;
  backendActor: ActorSubclass<
    Record<string, ActorMethod<unknown[], unknown>>
  > | null;
  agent: HttpAgent | null;
  isAuthenticating?: boolean;
}

interface BackendContextProps {
  authClient: AuthClient | null;
  agent: HttpAgent | null;
  backendActor: ActorSubclass<Record<string, ActorMethod<unknown[], unknown>>>;
  isAuthenticating: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

const BackendContext = createContext<BackendContextProps | undefined>(
  undefined,
);

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

async function handleAgent(client) {
  let host = "https://ic0.app";
  if (import.meta.env.VITE_DFX_NETWORK === "local") {
    host = import.meta.env.VITE_IC_HOST;
  }

  const identity = await client.getIdentity();
  const agent = new HttpAgent({
    identity,
    host,
  });
  const principal = identity.getPrincipal().toString();

  // ---------------------- root key fetch ---------------------- \\
  if (import.meta.env.VITE_DFX_NETWORK === "local") {
    agent
      .fetchRootKey()
      .then((rootKey) => {
        console.log("successfully fetched root key: ");
      })
      .catch((err) => {
        console.log("Error fetching root key: ", err);
      });
  }

  const actor = Actor.createActor<_SERVICE>(idlFactory, {
    agent,
    canisterId,
  });
  return { actor, agent, principal, identity, client };
}

export const BackendProvider: React.FC<BackendProviderProps> = ({
  children,
}) => {
  const dispatch = useDispatch();

  const port = import.meta.env.VITE_DFX_PORT;

  const [state, setState] = useState<State>({
    principal: null,
    identity: null,
    backendActor: null,
    agent: null,
  });

  const [authClient, setAuthClient] = useState<AuthClient | null>(null);

  const login = useCallback(async () => {
    if (!authClient) {
      console.log("Auth client not initialized");
      return;
    }

    const alreadyAuthenticated = await authClient.isAuthenticated();

    if (alreadyAuthenticated) {
      dispatch(handleRedux("LOGIN"));
    } else {
      let identityProvider = "https://identity.ic0.app/#authorize";
      if (import.meta.env.VITE_DFX_NETWORK === "local") {
        identityProvider = `http://${import.meta.env.VITE_INTERNET_IDENTITY}.localhost:${port}`;
      }

      await authClient.login({
        identityProvider: identityProvider,
        onSuccess: async () => {
          setState((prevState: State) => {
            return { ...prevState, isAuthenticating: false };
          });
          window.location.reload();
        },
      });
    }
  }, [authClient, port]);

  const logout = () => {
    dispatch(handleRedux("LOGIN"));
    authClient?.logout({ returnTo: "/" });
  };

  useEffect(() => {
    const initializeAuthClient = async () => {
      const client = await AuthClient.create();
      setAuthClient(client);
      const { actor, agent, principal, identity } = await handleAgent(client);
      const ckUSDCActor = await getLedgerActor(agent);
      setState((pre) => {
        return {
          ckUSDCActor,
          backendActor: actor,
          agent,
          principal,
          identity,
        };
      });

      const alreadyAuthenticated = await client.isAuthenticated();
      if (alreadyAuthenticated) {
        dispatch(handleRedux("LOGIN"));
      }
    };

    initializeAuthClient().catch((error) => {
      console.log("Failed to initialize auth client:", error);
    });
  }, []);

  return (
    <BackendContext.Provider
      value={{
        ...state,
        login,
        logout,
      }}
    >
      {children}
    </BackendContext.Provider>
  );
};
