import {StrictMode} from "react";
import {createRoot} from "react-dom/client";

import App from "./App";
import {Provider} from "react-redux";
import store from "./redux/main";
import IcWebSocket, {createWsConfig, generateRandomIdentity} from "ic-websocket-js";
import {canisterId, user_canister} from "../declarations/user_canister";

//
const gatewayUrl = "ws://127.0.0.1:8080";
const icUrl = "http://127.0.0.1:4943";



const wsConfig = createWsConfig({
    canisterId: canisterId,
    canisterActor: user_canister,
    identity: generateRandomIdentity(),
    networkUrl: icUrl,
});

const ws = new IcWebSocket(gatewayUrl, undefined, wsConfig);


// // message Candid type
// const AppMessageIdl = IDL.Record({'text': IDL.Text});

ws.onopen = () => {
    console.log("Connected to the canister");
};

ws.onmessage = async (event) => {
    console.log("Received message:", event.data);
    // const receivedMessage = IDL.decode([AppMessageIdl], event.data)[0]
    // console.log("Received message:", receivedMessage);


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


const rootElement = document.getElementById('root');

// Check if the root element is present in the HTML
if (!rootElement) {
  throw new Error('Root element with id "root" not found in the document');
}

// Create a root using createRoot
const root = createRoot(rootElement);

// Render the app component within StrictMode and Redux Provider
root.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);