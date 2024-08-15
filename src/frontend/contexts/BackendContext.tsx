import React, {createContext, ReactNode, useCallback, useContext, useEffect, useState} from "react";
import {AuthClient} from "@dfinity/auth-client";
import {Actor, ActorMethod, ActorSubclass, HttpAgent, Identity} from "@dfinity/agent";
import {canisterId, idlFactory} from "../../declarations/backend";
import {_SERVICE} from "../../declarations/backend/backend.did";
import {useDispatch} from "react-redux";
import {handleRedux} from "../redux/store/handleRedux";


interface State {
    principal: string | null;
    identity: Identity | null;
    backendActor: ActorSubclass<Record<string, ActorMethod<unknown[], unknown>>> | null;
    isAuthenticated: boolean;
    hasLoggedIn: boolean;
    agent: HttpAgent | null;
    isAuthenticating?: boolean;
}

interface BackendContextProps {
    authClient: AuthClient | null;
    agent: HttpAgent | null;
    backendActor: ActorSubclass<Record<string, ActorMethod<unknown[], unknown>>> | null;
    isAuthenticating: boolean;
    isAuthenticated: boolean;
    hasLoggedIn: boolean;
    login: () => Promise<void>;
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

interface BackendProviderProps {
    children: ReactNode;
}

async function handleAgent() {
    const client = await AuthClient.create()
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
    try {
        const res = await actor.get_initial_data();
        console.log("Initial Data: ", res);
    } catch (e) {
        console.log("Error get_initial_data: ", e);
    }
    return {actor, agent, principal, identity, client};
}

export const BackendProvider: React.FC<BackendProviderProps> = ({children}) => {
    const dispatch = useDispatch();

    const port = import.meta.env.VITE_DFX_PORT;

    const [state, setState] = useState<State>({
        principal: null,
        identity: null,
        backendActor: null,
        isAuthenticated: false,
        hasLoggedIn: false,
        agent: null
    });

    const [authClient, setAuthClient] = useState<AuthClient | null>(null);


    const login = useCallback(async () => {

        if (!authClient) {
            console.log("Auth client not initialized");
            return
        }
        const alreadyAuthenticated = await authClient.isAuthenticated();

        if (alreadyAuthenticated) {
            setState((prevState: State) => {
                return {...prevState, isAuthenticated: true, hasLoggedIn: true}
            })
            dispatch(handleRedux('LOGIN'));

        } else {
            let identityProvider = "https://identity.ic0.app/#authorize";
            if (import.meta.env.VITE_DFX_NETWORK === "local") {
                identityProvider = `http://${import.meta.env.VITE_INTERNET_IDENTITY}.localhost:${port}`;
            }
            setState((prevState) => {
                return {...prevState, isAuthenticated: true}
            });

            await authClient.login({
                identityProvider: identityProvider,
                onSuccess: async () => {
                    setState((prevState: State) => {
                        return {...prevState, isAuthenticated: true, isAuthenticating: false, hasLoggedIn: true}
                    });
                    window.location.reload()
                },
            });
        }
    }, [authClient, port]);


    const logout = () => {
        setState((prevState: State) => {
            return {...prevState, isAuthenticated: false}
        })
        authClient?.logout({returnTo: "/"});
    };

    useEffect(() => {

        const initializeAuthClient = async () => {
            const {actor, agent, principal, identity, client} = await handleAgent();
            setState({
                principal,
                identity,
                backendActor: actor,
                isAuthenticated: true,
                hasLoggedIn: true,
                agent
            });
            setAuthClient(client);
            const alreadyAuthenticated = await client.isAuthenticated();
            if (alreadyAuthenticated) {
                dispatch(handleRedux('LOGIN'));
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

