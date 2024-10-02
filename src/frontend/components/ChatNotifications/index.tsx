import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import GroupIcon from "@mui/icons-material/Group";
import { Principal } from "@dfinity/principal";
import { handleRedux } from "../../redux/store/handleRedux";
import {
  FEChat,
  Message,
  User,
} from "../../../declarations/backend/backend.did";
import useGetChats from "../Chat/useGetChats";
import { convertToBlobLink } from "../../DataProcessing/imageToVec";
import MessageComponent from "./Message";
import { useBackendContext } from "../../contexts/BackendContext";
import { OPEN_CHAT, UPDATE_NOTIFICATION } from "../../redux/types/chatsTypes";

function ChatNotification(message: Message) {
  const { backendActor } = useBackendContext();
  const dispatch = useDispatch();
  const { getChats } = useGetChats();

  const { profile } = useSelector((state: any) => state.filesState);
  const { chats } = useSelector((state: any) => state.chatsState);

  const chat = chats.find((chat: FEChat) => chat.id === message.chat_id);
  const isGroupChat = chat && chat.name !== "private_chat";
  const [sender, setSender] = useState<User>(
    chat?.admins[0] || chat?.creator,
  );

  useEffect(() => {
    (async () => {
      await getChats();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (sender) {
        return;
      }
      if (message.sender.toText() === profile.id) {
        setSender(chat?.admins[0] || chat?.creator);
      }
    })();
  }, [chats]);
  const handleChatClick = async () => {
    dispatch(
      handleRedux(OPEN_CHAT, {
        current_chat_id: message.chat_id,
        current_user: sender.id && Principal.fromText(sender.id),
      }),
    );

    if (profile && !message.seen_by.includes(Principal.fromText(profile.id))) {
      message.seen_by.push(Principal.fromText(profile.id));
      if (backendActor) {
        let res = await backendActor.message_is_seen(message);
        // console.log({ res });
      } else {
        console.log(
          "backendActor is null. Unable to mark the message as seen.",
        );
      }
      dispatch(handleRedux(UPDATE_NOTIFICATION, { message: message }));
    }
  };

  return (
    <ListItem alignItems="flex-start" onClick={handleChatClick}>
      {isGroupChat && (
        <div>
          <GroupIcon />
          {chat.name}
        </div>
      )}
      {!isGroupChat && sender && (
        <ListItemAvatar>
          <Avatar alt={sender.name} src={convertToBlobLink(sender.photo)} />
        </ListItemAvatar>
      )}
      <MessageComponent current_chat_id={message.chat_id} {...message} />
    </ListItem>
  );
}

export default ChatNotification;
