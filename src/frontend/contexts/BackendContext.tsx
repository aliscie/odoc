import React, {createContext, ReactNode, useCallback, useContext, useEffect, useState} from "react";
import {AuthClient} from "@dfinity/auth-client";
import {Actor, ActorMethod, ActorSubclass, HttpAgent, Identity} from "@dfinity/agent";
import {canisterId, idlFactory} from "../../declarations/backend";
import {_SERVICE} from "../../declarations/backend/backend.did";
import {useDispatch} from "react-redux";
import {handleRedux} from "../redux/store/handleRedux";
import {logger} from "../DevUtils/logData";

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

async function handleAgent(client) {

    const identity = await client.getIdentity();
    // setIdentity(identity);
    const principal = identity.getPrincipal().toString();
    // setPrincipal(principal);
    let host = 'https://ic0.app';
    if (import.meta.env.VITE_DFX_NETWORK === "local") {
        host = import.meta.env.VITE_IC_HOST;
    }
    const newAgent = new HttpAgent({
        identity,
        host
    });


    // ---------------------- root key fetch ---------------------- \\
    if (import.meta.env.VITE_DFX_NETWORK === "local") {
        newAgent.fetchRootKey().catch((err) => {
            console.error(
                "Unable to fetch root key. Check to ensure that your local replica is running"
                +
                "------------------ root key error ------------------"
                +
                err
            );
            console.error({identity, host})
        });
    }


    const actor = Actor.createActor<_SERVICE>(idlFactory, {
        agent: newAgent,
        canisterId,
    });
    // console.log("before: ", actor);
    // const res = await actor.get_initial_data();
    // console.log("Initial Data: ", res);
    return {actor, newAgent, principal, identity};


}

export const BackendProvider: React.FC<BackendProviderProps> = ({children}) => {

    const dispatch = useDispatch();

    const port = import.meta.env.VITE_DFX_PORT;

    const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
    const [authClient, setAuthClient] = useState<AuthClient | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [hasLoggedIn, setHasLoggedIn] = useState<boolean>(false);
    const [identity, setIdentity] = useState<Identity | null>(null);
    const [agent, setAgent] = useState<HttpAgent | null>(null);
    const [backendActor, setBackendA̵ctor] = useState<ActorSubclass<Record<string, ActorMethod<unknown[], unknown>>> | null>(null);
    const [principal, setPrincipal] = useState<string | null>(null);


    const login = useCallback(async () => {

        if (!authClient) {
            console.error("Auth client not initialized");
            return
        }
        const alreadyAuthenticated = await authClient.isAuthenticated();

        if (alreadyAuthenticated) {
            setIsAuthenticated(true);
            setHasLoggedIn(true);
            dispatch(handleRedux('LOGIN'));

        } else {
            let identityProvider = "https://identity.ic0.app/#authorize";
            if (import.meta.env.VITE_DFX_NETWORK === "local") {
                identityProvider = `http://${import.meta.env.VITE_INTERNET_IDENTITY}.localhost:${port}`;
            }
            setIsAuthenticating(true);
            console.log({authClient})
            await authClient.login({
                identityProvider: identityProvider,
                onSuccess: async () => {
                    setIsAuthenticating(false);
                    setIsAuthenticated(true);
                    setHasLoggedIn(true);
                    window.location.reload()
                },
            });
        }
    }, [authClient, port]);


    const logout = () => {
        setIsAuthenticated(false);
        authClient?.logout({returnTo: "/"});
    };

    useEffect(() => {

        const initializeAuthClient = async () => {
            const client = await AuthClient.create();
            setAuthClient(client);

            // setAuthClient(client);
            const alreadyAuthenticated = await client.isAuthenticated();
            if (alreadyAuthenticated) {
                setIsAuthenticated(true);
                setHasLoggedIn(true);
                dispatch(handleRedux('LOGIN'));
            }


            setIsAuthenticating(false);

            const authenticated = await client.isAuthenticated();

            if (authenticated) {

                const {actor, newAgent, principal, identity} = await handleAgent(client);
                setPrincipal(principal);
                setIdentity(identity)
                setBackendA̵ctor(actor);
                setIsAuthenticated(true);
                setHasLoggedIn(true);
                setAgent(newAgent);
            }
        };

        initializeAuthClient().catch((error) => {
            console.error("Failed to initialize auth client:", error);
        });
    }, []);

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

