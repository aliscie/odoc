import {AuthClient} from "@dfinity/auth-client";
import {Actor, HttpAgent} from "@dfinity/agent";
import {idlFactory} from "../declarations/backend";

// const {ic} = window;
// const {plug} = ic;

let backendActor, loading = false

// CANISTER_ID is replaced by webpack based on node environment
export const canisterId = "bkyz2-fmaaa-aaaaa-qaaaq-cai" // TODO fix this instead of manually setting the canister id, // import.meta.env.VITE_BACKEND_CANISTER_ID;
console.log('canisterId: ', canisterId)

export const createActor = (canisterId, options = {}) => {
    const agent = options.agent || new HttpAgent({...options.agentOptions});

    if (options.agent && options.agentOptions) {
        console.warn(
            "Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent."
        );
    }

    // Fetch root key for certificate validation during development
    if (import.meta.env.VITE_DFX_NETWORK !== "ic") {
        agent.fetchRootKey().catch((err) => {
            console.warn(
                "Unable to fetch root key. Check to ensure that your local replica is running"
            );
            console.error(err);
        });
    }

    // Creates an actor with using the candid interface and the HttpAgent
    return Actor.createActor(idlFactory, {
        agent,
        canisterId,
        ...options.actorOptions,
    });
};

export const backend = createActor(canisterId);

export const get_actor = async () => {
    await new Promise(resolve => !loading && resolve());
    console.log('get_actor')
    loading = true

    if (!backendActor) {
        // if (import.meta.env.VITE_USE_WALLET) {
        //     try {
        //         if (!(await is_logged())) {
        //             await plug.requestConnect({
        //                 whitelist: [import.meta.env.VITE_BACKEND_CANISTER_ID],
        //                 host: import.meta.env.VITE_DFX_NETWORK === "ic" ? 'https://mainnet.dfinity.network' : 'http://localhost:8510',
        //                 timeout: 50000,
        //                 onConnectionUpdate: () => {
        //                     console.log('sessionData: ', plug.sessionManager.sessionData)
        //                 },
        //             });
        //         }
        //     } catch (e) {
        //         console.log(e)
        //         return
        //     }
        //
        //     backendActor = await plug.createActor({canisterId, interfaceFactory: idlFactory, agent: plug.agent});
        // } else {
            const authClient = await AuthClient.create();
            const identity = await authClient.getIdentity();
            backendActor = createActor(canisterId, {
                agentOptions: {
                    identity,
                    host: window.location.href,
                }
            });
        // }
    }

    loading = false
    return backendActor;
}

export async function identify() {
    const authClient = await AuthClient.create();
    if (await authClient.isAuthenticated()) {
        return authClient.getIdentity();
    }
    let identityProvider = "https://identity.ic0.app/#authorize";
    if (import.meta.env.VITE_DFX_NETWORK != "ic") {
        identityProvider = `http://${import.meta.env.VITE_IDENTITY_PROVIDER_ID}.localhost:8510/#authorize`
    }
    return await authClient.login({
        identityProvider,
        onSuccess: () => {
            window.location.reload()
        }
    });
}

export async function is_logged() {
    const authClient = await AuthClient.create();
    return await authClient.isAuthenticated()
}

export async function logout() {
    const authClient = await AuthClient.create();
    await authClient.logout()
}



