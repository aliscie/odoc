import { backend, canisterId } from "../../declarations/backend";
import IcWebSocket, { createWsConfig } from "ic-websocket-js";
import { SignIdentity } from "@dfinity/agent";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { AppMessage } from "../../declarations/backend/backend.did";

function useSocket() {
  const { profile } = useSelector((state: any) => state.filesState);
  const dispatch = useDispatch();
  const [ws, setWs] = useState<IcWebSocket | undefined>(undefined);

  // Make sure the URL format is correct with proper protocol and no trailing slashes
  const gatewayUrl =
    import.meta.env.VITE_DFX_NETWORK !== "ic"
      ? "ws://127.0.0.1:8081"
      : "wss://gateway.icws.io";

  const networkUrl =
    import.meta.env.VITE_DFX_NETWORK !== "ic"
      ? `http://127.0.0.1:${import.meta.env.VITE_DFX_PORT || 4943}`
      : "https://icp-api.io";

  useEffect(() => {
    let isActive = true;

    const initWebSocket = async () => {
      try {
        const authClient = await AuthClient.create();
        if ((await authClient.isAuthenticated()) && !ws && isActive) {
          const wsConfig = createWsConfig({
            canisterId,
            canisterActor: backend,
            identity: authClient.getIdentity() as SignIdentity,
            networkUrl,
          });

          // Create the WebSocket with proper error handling
          const socket = new IcWebSocket(gatewayUrl, undefined, wsConfig);
          if (isActive) {
            setWs(socket);
          }
        }
      } catch (error) {
        console.error("WebSocket initialization error:", error);
      }
    };

    initWebSocket();

    return () => {
      isActive = false;
      if (ws) {
        ws.close();
      }
    };
  }, []); // Remove ws from dependencies to prevent endless loop

  useEffect(() => {
    if (!ws) return;

    ws.onopen = () => console.log("WS Connected to the canister");

    ws.onmessage = async (event) => {
      try {
        // Properly parse the data if it's a string
        let data: AppMessage;
        if (typeof event.data === "string") {
          data = JSON.parse(event.data);
        } else {
          data = event.data;
        }

        // Safely access properties with null checks
        if (!data || !data.notification || !data.notification[0]) {
          console.warn("Received malformed message:", data);
          return;
        }

        const notification = data.notification[0];
        const content = notification?.content;

        if (!content) {
          console.warn("Message has no content:", notification);
          return;
        }

        const key = Object.keys(content)[0];

        if (data.text === "Delete") {
          const { id, sender, receiver } = notification;
          dispatch({
            type: "DELETE_NOTIFY",
            id,
          });
          dispatch({
            type: "REMOVE_FRIEND",
            id:
              sender.toText() !== profile?.id
                ? sender.toText()
                : receiver.toText(),
          });
          return;
        }

        switch (key) {
          case "NewMessage":
            dispatch({
              type: "ADD_NOTIFICATION",
              message: content.NewMessage,
            });
            break;
          case "FriendRequest":
            dispatch({
              type: "ADD_FRIEND",
              friend: content.FriendRequest.friend,
            });
            dispatch({
              type: "NOTIFY",
              new_notification: notification,
            });
            break;
          case "SharePayment":
            dispatch({
              type: "UPDATE_CONTRACT",
              contract: content?.SharePayment,
            });
            break;
          case "Unfriend":
            const { id, sender, receiver } = notification;
            dispatch({
              type: "DELETE_NOTIFY",
              id,
            });
            dispatch({
              type: "REMOVE_FRIEND",
              id:
                sender.toText() === profile?.id
                  ? receiver.toText()
                  : sender.toText(),
            });
            break;
          case "AcceptFriendRequest":
            dispatch({
              type: "UPDATE_FRIEND",
              receiver: notification.sender.toText(),
            });
            dispatch({
              type: "UPDATE_NOTE",
              ...notification,
            });
            break;
          default:
            console.log("Unhandled message type:", key);
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error, event.data);
      }
    };

    ws.onclose = (closeEvent) => {
      console.log(
        "Disconnected from the ws canister:",
        closeEvent.reason || "No reason provided",
      );
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      // Cleanup listeners to prevent memory leaks
      if (ws) {
        ws.onopen = null;
        ws.onmessage = null;
        ws.onclose = null;
        ws.onerror = null;
      }
    };
  }, [ws, dispatch, profile]);

  return { ws };
}

export default useSocket;
