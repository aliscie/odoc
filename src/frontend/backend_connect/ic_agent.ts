import {Actor, HttpAgent} from "@dfinity/agent";
import {canisterId as userCanisterId, idlFactory} from "../../declarations/user_canister";
import {AuthClient} from "@dfinity/auth-client";

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
            // console.warn(
            //     "Unable to fetch root key. Check to ensure that your local replica is running"
            // );
            console.error("------------------ root key error ------------------");
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


export const get_user_actor = async () => {
    let host = "https://ic0.app";
    if (import.meta.env.VITE_DFX_NETWORK !== "ic") {
        host = import.meta.env.VITE_IC_HOST;
    };
    await new Promise(resolve => !loading && resolve());
    loading = true

    if (!backendActor) {
        const authClient = await AuthClient.create();
        const identity = await authClient.getIdentity();
        backendActor = createActor(userCanisterId, {
            agentOptions: {
                identity,
                host,
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
        identityProvider = `http://${import.meta.env.VITE_INTERNET_IDENTITY}.localhost:${port}/#authorize`
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
    // if (!(await is_logged())) {
    const authClient = await AuthClient.create();
    await authClient.logout()
    window.location.reload()
    // }

}

export async function get_id() {
    const authClient = await AuthClient.create();

    if (await authClient.isAuthenticated()) {
        const identity = await authClient.getIdentity();
        return identity.getPrincipal().toText(); // Convert Principal to string
    }

    // Handle the case where the user is not authenticated
    console.error("User is not authenticated.");
    return null;
}
