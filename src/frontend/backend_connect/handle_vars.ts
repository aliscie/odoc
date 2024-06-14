import canister_id from "../../../.dfx/local/canister_ids.json";
// const getCenterCanisterActor = async () => {
//     const authClient = await AuthClient.create();
//     const identity = await authClient.getIdentity();
//     const centerActor = createActor(import.meta.env.VITE_CENTER_CANISTER_ID, {
//         agentOptions: {
//             identity,
//             host: window.location.href,
//         }
//     });
//     return centerActor;
// }

//TODO
// let central_canister_actor = await getCenterCanisterActor();
// let res = await central_canister_actor.create_canister()
// let backend_id = await central_canister_actor.get_backend()
// TODO canisterId = backend_id.ik


// import.meta.env.VITE_IDENTITY_PROVIDER_ID
// import.meta.env.VITE_backend_CANISTER_ID
export const canisterId = canister_id.backend.local;
// export const identityCanisterId = canister_id.internet_identity.local;
