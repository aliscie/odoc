import IcWebSocket, {createWsConfig, generateRandomIdentity} from "ic-websocket-js";
import {IDL} from "@dfinity/candid";
import {canisterId, user_canister} from "../../declarations/user_canister";

const gatewayUrl = "ws://127.0.0.1:8080";
const icUrl = "http://127.0.0.1:4943";


console.log("test from socket_connect.tsx")

const wsConfig = createWsConfig({
    canisterId: canisterId,
    canisterActor: user_canister
    identity: generateRandomIdentity(),
    networkUrl: icUrl,
});

const ws = new IcWebSocket(gatewayUrl, undefined, wsConfig);


// message Candid type
const AppMessageIdl = IDL.Record({'text': IDL.Text});

ws.onopen = () => {
    console.log("Connected to the canister");
};

ws.onmessage = async (event) => {
    const receivedMessage = IDL.decode([AppMessageIdl], event.data)[0]
    console.log("Received message:", receivedMessage);


    // serialize the message with candid before sending it
    // const messageToSend = IDL.encode([AppMessageIdl], [
    //     {
    //         text: event.data.text + "-pong test message here",
    //     }
    // ]);
    // ws.send(new Uint8Array(messageToSend));
};

ws.onclose = () => {
    console.log("Disconnected from the canister");
};

ws.onerror = (error) => {
    console.log("Error:", error);
};
