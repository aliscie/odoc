import {AuthClient} from "@dfinity/auth-client";
import {createActor} from "../../declarations/central_canister";

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
// console.log({res})
// TODO canisterId = user_canister_id.ik
export const canisterId = import.meta.env.VITE_USER_CANISTER_CANISTER_ID;

