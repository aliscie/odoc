import { backend, canisterId } from "../../declarations/backend";
import IcWebSocket, { createWsConfig } from "ic-websocket-js";
import { SignIdentity } from "@dfinity/agent";
import { useDispatch, useSelector } from "react-redux";

import React, { useEffect, useState } from "react";
import { handleRedux } from "../redux/store/handleRedux";
import { AuthClient } from "@dfinity/auth-client";
import { AppMessage, Friend } from "../../declarations/backend/backend.did";

function useSocket() {
  const { profile } = useSelector((state: any) => state.filesState);
  let gatewayUrl = "wss://gateway.icws.io";
  let icUrl = `https://y43fd-5qaaa-aaaal-acbqa-cai.ic0.app`;
  if (import.meta.env.VITE_DFX_NETWORK != "ic") {
    gatewayUrl = "ws://127.0.0.1:8084";
    icUrl = `http://127.0.0.1:${import.meta.env.VITE_DFX_PORT}`;
  }
  const dispatch = useDispatch();
  const [ws, setWs] = useState<IcWebSocket | undefined>(undefined);
  // let anonymousIdentity = Principal.fromText("2vxsx-fae");
  useEffect(() => {
    (async () => {
      const authClient = await AuthClient.create();
      const _identity = authClient.getIdentity();
      if ((await authClient.isAuthenticated()) && !ws) {
        const wsConfig = createWsConfig({
          canisterId: canisterId,
          canisterActor: backend,
          identity: _identity as SignIdentity,
          networkUrl: icUrl,
        });
        setWs(new IcWebSocket(gatewayUrl, undefined, wsConfig));
      }
    })();
  }, []);

  useEffect(() => {
    if (ws) {
      ws.onopen = () => {
        console.log("Connected to the canister");
      };

      ws.onmessage = async (event) => {
        console.log({ event });

        let data: AppMessage = event.data;

        // console.log("Received message:", data);

        let keys =
          data.notification[0] &&
          data.notification[0].content &&
          Object.keys(data.notification[0].content);
        if (data.text == "Delete") {
          dispatch(
            handleRedux("DELETE_NOTIFY", { id: data.notification[0].id }),
          );
          let sender = event.data.notification[0].sender.toText();
          let receiver = event.data.notification[0].receiver.toText();
          let remove_id = sender !== profile.id ? sender : receiver;
          dispatch(handleRedux("REMOVE_FRIEND", { id: remove_id }));
          return;
        }
        switch (keys && keys[0]) {
          case "NewMessage":
            dispatch(
              handleRedux("ADD_NOTIFICATION", {
                message: data.notification[0].content.NewMessage,
              }),
            );
            break;
          case "FriendRequest":
            let friend: Friend =
              data.notification[0].content.FriendRequest.friend;
            dispatch(handleRedux("ADD_FRIEND", { friend }));
            dispatch(
              handleRedux("NOTIFY", { new_notification: data.notification[0] }),
            );https://stackoverflow.com/questions/54182806/redux-seems-slow-when-saving-large-collection-to-store
            break;
          case "ContractUpdate":
            break;
          case "SharePayment":
            let share_payment = data.notification[0].content["SharePayment"];
            dispatch(
              handleRedux("UPDATE_CONTRACT", { contract: share_payment }),
            );
            break;
          case "Unfriend":
            let id = event.data.notification[0].id;

            dispatch(handleRedux("DELETE_NOTIFY", { id: id }));
            let user_id = profile.id;
            let sender = event.data.notification[0].sender.toText();
            let receiver = event.data.notification[0].receiver.toText();
            let remove_id = sender == user_id ? receiver : sender;
            dispatch(handleRedux("REMOVE_FRIEND", { id: remove_id }));
            break;
          case "AcceptFriendRequest":
            // dispatch(handleRedux("CONFIRM_FRIEND", {
            //     friend: {
            //         confirmed: true,
            //         sender: props,
            //         receiver: profile
            //     }
            // }));
            dispatch(
              handleRedux("UPDATE_FRIEND", {
                receiver: event.data.notification[0].sender.toText(),
              }),
            );
            dispatch(handleRedux("UPDATE_NOTE", event.data.notification[0]));
          default:
            console.log("No match");
        }
      };

      ws.onclose = () => {
        console.log("Disconnected from the ws canister");
      };

      ws.onerror = (error) => {
        console.error("use_socket Error:", error);
      };
    }
  }, [ws]);

  return { ws };
}

export default useSocket;
