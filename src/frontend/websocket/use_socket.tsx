import {canisterId, user_canister} from "../../declarations/user_canister";
import IcWebSocket, {createWsConfig} from "ic-websocket-js";
import {SignIdentity} from "@dfinity/agent";
import {useDispatch} from "react-redux";


import React, {useEffect, useState} from "react";
import {handleRedux} from "../redux/main";
import {AuthClient} from "@dfinity/auth-client";
import {actor} from "../App";
import {AppMessage, Friend} from "../../declarations/user_canister/user_canister.did";


function useSocket() {


    let gatewayUrl = "wss://gateway.icws.io";
    let icUrl = `https://y43fd-5qaaa-aaaal-acbqa-cai.ic0.app`;
    if (import.meta.env.VITE_DFX_NETWORK != "ic") {
        gatewayUrl = "ws://127.0.0.1:8084";
        icUrl = `http://127.0.0.1:${import.meta.env.VITE_DFX_PORT}`;
    }
    ;


    const dispatch = useDispatch();
    const [ws, setWs] = useState<IcWebSocket | undefined>(undefined);
    // let anonymousIdentity = Principal.fromText("2vxsx-fae");
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
                let data: AppMessage = event.data;

                // console.log("Received message:", data);


                // check if the key is `FriendRequest` or ContractUpdate in event.data.notification[0].content[key]
                let keys = data.notification[0] && data.notification[0].content && Object.keys(data.notification[0].content);
                if (data.text == "Delete") {
                    let new_request: Friend = data.notification[0].content.FriendRequest.friend
                    dispatch(handleRedux("REMOVE_FRIEND_REQUEST", {friend_id: new_request.sender.id}))
                    dispatch(handleRedux('DELETE_NOTIFY', {id: data.notification[0].id}));
                    return;
                }
                switch (keys && keys[0]) {
                    case "NewMessage":
                        dispatch(handleRedux('ADD_NOTIFICATION', {message: data.notification[0].content.NewMessage}));
                        break
                    case "FriendRequest":
                        let new_request: Friend = data.notification[0].content.FriendRequest.friend
                        new_request && dispatch(handleRedux("UPDATE_FRIEND", {friend_request: new_request}))
                        dispatch(handleRedux('NOTIFY', {new_notification: data.notification[0]}));
                        break
                    // TODO
                    //     case "CancleFriendRequest":
                    //         let new_request: Friend = data.notification[0].content.FriendRequest.friend
                    //         new_request && dispatch(handleRedux("UPDATE_FRIEND", {cancel_friend_request: new_request}))
                    //         dispatch(handleRedux('NOTIFY', {new_notification: data.notification[0]}));
                    //         break
                    case "ContractUpdate":
                        // let new_contracts = actor && await actor.get_contracts();
                        // new_contracts && dispatch(handleRedux("UPDATE_CONTRACT", {contracts: new_contracts[0]}))
                        break
                    case"SharePayment":
                        let share_payment = data.notification[0].content["SharePayment"];
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