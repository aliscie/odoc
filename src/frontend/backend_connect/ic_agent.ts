import {AuthClient} from "@dfinity/auth-client";
import {Actor, HttpAgent} from "@dfinity/agent";
import {canisterId, identityCanisterId} from "./handle_vars";
import {idlFactory} from "../../declarations/user_canister";

let backendActor, loading = false

const createActor = (canisterId, options = {}) => {
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

// get center canister actor


export const get_actor = async () => {
    await new Promise(resolve => !loading && resolve());
    loading = true

    if (!backendActor) {
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

function get_identity_url() {
    let identityProvider = "https://identity.ic0.app/#authorize";
    if (import.meta.env.VITE_DFX_NETWORK != "ic") {
        let port = import.meta.env.VITE_DFX_PORT;
        identityProvider = `http://${identityCanisterId}.localhost:${port}/#authorize`
    }
    return identityProvider
}

export async function identify() {

    const authClient = await AuthClient.create();
    if (await authClient.isAuthenticated()) {
        return authClient.getIdentity();
    }
    let identityProvider = get_identity_url();
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
    window.location.reload()
}


export const actor = await get_actor();
// export const actor = user_canister;