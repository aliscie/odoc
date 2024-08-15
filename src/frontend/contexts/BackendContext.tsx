import React, {createContext, ReactNode, useCallback, useContext, useEffect, useState} from "react";
import {AuthClient} from "@dfinity/auth-client";
import {Actor, ActorMethod, ActorSubclass, HttpAgent, Identity} from "@dfinity/agent";
import {canisterId, idlFactory} from "../../declarations/backend";
import {_SERVICE} from "../../declarations/backend/backend.did";
import {useDispatch} from "react-redux";
import {handleRedux} from "../redux/store/handleRedux";

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

async function handleAgent(client: { getIdentity: () => any; }) {

    let host = 'https://ic0.app';
    if (import.meta.env.VITE_DFX_NETWORK === "local") {
        host = import.meta.env.VITE_IC_HOST;
    }

    const identity = await client.getIdentity()
    const agent = new HttpAgent({
        identity,
        host
    });
    const principal = identity.getPrincipal().toString();


    // ---------------------- root key fetch ---------------------- \\
    if (import.meta.env.VITE_DFX_NETWORK === "local") {
        agent.fetchRootKey().then((rootKey) => {
                // console.log("Root Key: ", rootKey);
            }
        ).catch(
            (err) => {
                console.log("Error fetching root key: ", err);
            }
        )
    }


    const actor = Actor.createActor<_SERVICE>(idlFactory, {
        agent,
        canisterId,
    });
    // console.log("before: ", actor);
    try {
        const res = await actor.get_initial_data();
        console.log("Initial Data: ", res);
    } catch (e) {
        console.log("Error get_initial_data: ", e);
    }
    return {actor, agent, principal, identity};
}

export const BackendProvider: React.FC<BackendProviderProps> = ({children}) => {
    const dispatch = useDispatch();

    const port = import.meta.env.VITE_DFX_PORT;

    const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
    const [authClient, setAuthClient] = useState<AuthClient | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [hasLoggedIn, setHasLoggedIn] = useState<boolean>(false);
    const [stateIdenitity, setStateIdenitity] = useState<Identity | null>(null);
    const [stateAgent, setStateAgent] = useState<HttpAgent | null>(null);
    const [backendActor, setBackendA̵ctor] = useState<ActorSubclass<Record<string, ActorMethod<unknown[], unknown>>> | null>(null);
    const [statePrincipal, setStatePrincipal] = useState<string | null>(null);


    const login = useCallback(async () => {

        if (!authClient) {
            console.log("Auth client not initialized");
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

            if (authenticated && !isAuthenticated) {
                const {actor, agent, principal, identity} = await handleAgent(client);
                setStatePrincipal(principal);
                setStateIdenitity(identity)
                setBackendA̵ctor(actor);
                setIsAuthenticated(true);
                setHasLoggedIn(true);
                setStateAgent(agent);
            }
        };

        initializeAuthClient().catch((error) => {
            console.log("Failed to initialize auth client:", error);
        });
    }, []);

    return (
        <BackendContext.Provider
            value={{
                authClient,
                agent: stateAgent,
                backendActor,
                isAuthenticating,
                isAuthenticated,
                hasLoggedIn,
                login,
                logout,
                identity: stateIdenitity,
                principal: statePrincipal?.toString(),
            }}
        >
            {children}
        </BackendContext.Provider>
    );
};

