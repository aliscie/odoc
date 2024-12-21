import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import GroupIcon from "@mui/icons-material/Group";
import { Principal } from "@dfinity/principal";
import { handleRedux } from "../../redux/store/handleRedux";
import { Message, User } from "../../../declarations/backend/backend.did";
import useGetChats from "../Chat/useGetChats";
import { convertToBlobLink } from "../../DataProcessing/imageToVec";
import MessageComponent from "./Message";
import { useBackendContext } from "../../contexts/BackendContext";
import { OPEN_CHAT, UPDATE_NOTIFICATION } from "../../redux/types/chatsTypes";

function ChatNotification(message: Message) {
  const { backendActor } = useBackendContext();
  const dispatch = useDispatch();
  const { getChats } = useGetChats();
  const { profile, chats } = useSelector((state: any) => ({
    profile: state.filesState.profile,
    chats: state.chatsState.chats,
  }));

  const chat = chats.find((chat) => chat.id === message.chat_id);
  const [isGroupChat, setIsGroupChat] = useState(
    chat && chat.name !== "private_chat",
  );
  const [sender, setSender] = useState<User>(chat?.admins[0] || chat?.creator);

  useEffect(() => {
    getChats();
  }, []);

  useEffect(() => {
    if (!sender && message.sender.toText() === profile.id) {
      setSender(chat?.admins[0] || chat?.creator);
    }
  }, [chats, chat]);

  const handleChatClick = async () => {
    let chatSender = chat?.admins.find((i) => i.id.toString() != profile.id);
    dispatch(
      handleRedux(OPEN_CHAT, {
        current_chat_id: message.chat_id,
        current_user:
          chatSender && chatSender.id && Principal.fromText(chatSender.id),
      }),
    );

    if (profile && !message.seen_by.includes(Principal.fromText(profile.id))) {
      message.seen_by.push(Principal.fromText(profile.id));
      backendActor?.message_is_seen(message);
      dispatch(handleRedux(UPDATE_NOTIFICATION, { message }));
    }
  };

  return (
    <ListItem alignItems="flex-start" onClick={handleChatClick}>
      {isGroupChat ? (
        <div>
          <GroupIcon />
          {chat.name}
        </div>
      ) : (
        <ListItemAvatar>
          <Avatar
            key={JSON.stringify(sender)}
            alt={sender?.name}
            src={convertToBlobLink(sender?.photo)}
          />
        </ListItemAvatar>
      )}
      <MessageComponent current_chat_id={message.chat_id} {...message} />
    </ListItem>
  );
}

export default ChatNotification;
