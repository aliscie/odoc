import {AuthClient} from "@dfinity/auth-client";
import {createActor} from "../../declarations/central_canister";
import canister_id from "../../../.dfx/local/canister_ids.json";
const getCenterCanisterActor = async () => {
    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();
    const centerActor = createActor(import.meta.env.VITE_CENTER_CANISTER_ID, {
        agentOptions: {
            identity,
            host: window.location.href,
        }
    });
    return centerActor;
}

//TODO
// let central_canister_actor = await getCenterCanisterActor();
// let res = await central_canister_actor.create_canister()
// let user_canister_id = await central_canister_actor.get_user_canister()
// TODO canisterId = user_canister_id.ik


// import.meta.env.VITE_IDENTITY_PROVIDER_ID
// import.meta.env.VITE_USER_CANISTER_CANISTER_ID
export const canisterId = canister_id.user_canister.local;
export const identityCanisterId = canister_id.internet_identity.local;
