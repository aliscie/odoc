import {canisterId, user_canister} from "../../declarations/user_canister";
import IcWebSocket, {createWsConfig} from "ic-websocket-js";
import {SignIdentity} from "@dfinity/agent";
import {useDispatch} from "react-redux";


import React, {useEffect, useState} from "react";
import {handleRedux} from "../redux/main";
import {AuthClient} from "@dfinity/auth-client";
import {actor} from "../App";
import {Principal} from "@dfinity/principal";


function useSocket() {


    const gatewayUrl = "ws://127.0.0.1:8084";
    const icUrl = `http://127.0.0.1:${import.meta.env.VITE_DFX_PORT}`;


    const dispatch = useDispatch();
    const [ws, setWs] = useState<IcWebSocket | undefined>(undefined);
    // let anonymuseIdenity = Principal.fromText("2vxsx-fae");
    useEffect(() => {
        (async () => {
            const authClient = await AuthClient.create();
            const _identity = authClient.getIdentity();
            if (await authClient.isAuthenticated() && !ws) {
                const wsConfig = createWsConfig({
                    canisterId: canisterId,
                    canisterActor: user_canister,
                    identity: _identity as SignIdentity,
                    networkUrl: icUrl,
                });
                setWs(new IcWebSocket(gatewayUrl, undefined, wsConfig));
            }
        })()
    }, [])


    useEffect(() => {
        if (ws) {
            ws.onopen = () => {
                console.log("Connected to the canister");
            };

            ws.onmessage = async (event) => {
                // if (event.data.notification.length == 0) {
                //     return
                // }
                console.log("Received message:", event.data);


                // check if the key is `FriendRequest` or ContractUpdate in event.data.notification[0].content[key]
                let keys = event.data.notification[0] && Object.keys(event.data.notification[0].content);
                // NewMessage
                if (keys[0] != "NewMessage") {
                    console.log("Notification:", event.data.notification[0].content.NewMessage);
                    // dispatch(handleRedux('ADD_NOTIFICATION', {message: event.data.notification[0]}));
                }
                switch (keys[0]) {
                    case "NewMessage":
                        dispatch(handleRedux('ADD_NOTIFICATION', {message: event.data.notification[0].content.NewMessage }));
                        break
                    case "FriendRequest":
                        // TODO this does not seams to update live.
                        let new_friends = actor && await actor.get_friends();
                        new_friends && dispatch(handleRedux("UPDATE_FRIEND", {friends: new_friends[0]}))
                        break
                    case "ContractUpdate":
                        // let new_contracts = actor && await actor.get_contracts();
                        // new_contracts && dispatch(handleRedux("UPDATE_CONTRACT", {contracts: new_contracts[0]}))
                        break
                    case"SharePayment":
                        let share_payment = event.data.notification[0].content["SharePayment"];
                        dispatch(handleRedux("UPDATE_CONTRACT", {contract: share_payment}))
                        break
                    case "Unfriend":
                        actor && dispatch(handleRedux('UPDATE_NOTIFY', {new_list: await actor.get_notifications()}));
                        let new_friends_list = actor && await actor.get_friends();
                        new_friends && dispatch(handleRedux("UPDATE_FRIEND", {friends: new_friends_list[0]}))
                        break
                    default:
                        console.log("No match")

                }

            };

            ws.onclose = () => {
                console.log("Disconnected from the ws canister");
            };

            ws.onerror = (error) => {
                console.log("Error:", error);
            };
        }


    }, [ws])


    return {ws}
}

export default useSocket;