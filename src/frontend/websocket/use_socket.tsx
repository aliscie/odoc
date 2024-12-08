import { backend, canisterId } from "../../declarations/backend";
import IcWebSocket, { createWsConfig } from "ic-websocket-js";
import { SignIdentity } from "@dfinity/agent";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { handleRedux } from "../redux/store/handleRedux";
import { AuthClient } from "@dfinity/auth-client";
import { AppMessage } from "../../declarations/backend/backend.did";

function useSocket() {
  const { profile } = useSelector((state: any) => state.filesState);
  const dispatch = useDispatch();
  const [ws, setWs] = useState<IcWebSocket | undefined>(undefined);

  const gatewayUrl =
    import.meta.env.VITE_DFX_NETWORK !== "ic"
      ? "ws://127.0.0.1:8081"
      : "wss://gateway.icws.io";
  const networkUrl =
    import.meta.env.VITE_DFX_NETWORK !== "ic"
      ? `http://127.0.0.1:${import.meta.env.VITE_DFX_PORT}`
      : "https://icp-api.io";

  useEffect(() => {
    (async () => {
      const authClient = await AuthClient.create();
      if ((await authClient.isAuthenticated()) && !ws) {
        const wsConfig = createWsConfig({
          canisterId,
          canisterActor: backend,
          identity: authClient.getIdentity() as SignIdentity,
          networkUrl,
        });
        setWs(new IcWebSocket(gatewayUrl, undefined, wsConfig));
      }
    })();
  }, [ws]);

  useEffect(() => {
    if (!ws) return;

    ws.onopen = () => console.log("Connected to the canister");
    ws.onmessage = async (event) => {
      // console.log("Received message from the canister:", event.data);
      const data: AppMessage = event.data;
      const content = data.notification[0]?.content;
      const key = content && Object.keys(content)[0];

      if (data.text === "Delete") {
        const { id, sender, receiver } = data.notification[0];
        dispatch(handleRedux("DELETE_NOTIFY", { id }));
        dispatch(
          handleRedux("REMOVE_FRIEND", {
            id:
              sender.toText() !== profile.id
                ? sender.toText()
                : receiver.toText(),
          }),
        );
        return;
      }

      switch (key) {
        case "NewMessage":
          dispatch(
            handleRedux("ADD_NOTIFICATION", { message: content.NewMessage }),
          );
          break;
        case "FriendRequest":
          dispatch(
            handleRedux("ADD_FRIEND", { friend: content.FriendRequest.friend }),
          );
          dispatch(
            handleRedux("NOTIFY", { new_notification: data.notification[0] }),
          );
          break;
        case "SharePayment":
          dispatch(
            handleRedux("UPDATE_CONTRACT", { contract: content.SharePayment }),
          );
          break;
        case "Unfriend":
          const { id, sender, receiver } = data.notification[0];
          dispatch(handleRedux("DELETE_NOTIFY", { id }));
          dispatch(
            handleRedux("REMOVE_FRIEND", {
              id:
                sender.toText() === profile.id
                  ? receiver.toText()
                  : sender.toText(),
            }),
          );
          break;
        case "AcceptFriendRequest":
          dispatch(
            handleRedux("UPDATE_FRIEND", {
              receiver: data.notification[0].sender.toText(),
            }),
          );
          dispatch(handleRedux("UPDATE_NOTE", data.notification[0]));
          break;
        default:
          // console.log("No match");
      }
    };

    ws.onclose = (closeMessage) =>
      console.log(closeMessage, "Disconnected from the ws canister");
    ws.onerror = (error) => console.error("use_socket Error:", error);
  }, [ws]);

  return { ws };
}

export default useSocket;
