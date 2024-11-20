import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, TextField, Typography } from "@mui/material";
import { Chat, Message } from "../../../declarations/backend/backend.did";
import ChatSendMessage from "../ChatSendMessage";
import MessageComponent from "./Message";
import { RootState } from "../../redux/reducers";
import MessagesGroupOption from "./groupOptions";
import LoaderButton from "../MuiComponents/LoaderButton";
import { Principal } from "@dfinity/principal";
import Autocomplete from "@mui/material/Autocomplete";
import { useBackendContext } from "../../contexts/BackendContext";

const UpdateChatSettings = ({ currentChat }) => {
  if (!currentChat) {
    return <></>;
  }
  const { profile, all_friends } = useSelector(
    (state: RootState) => state.filesState,
  );

  const getUsersByName = (names) => {
    return names.map((name) => {
      if (name.id) {
        return Principal.fromText(name.id);
      }
      if (typeof name === "object") {
        return name;
      }
      try {
        return Principal.fromText(name);
      } catch (e) {
        // console.log(e)
      }
      const user = [profile, ...all_friends].find((f) => f.name == name);
      return user && Principal.fromText(user.id);
    });
  };
  const workSpacesRef = useRef(currentChat.workspaces);
  const { backendActor } = useBackendContext();

  const handleUpdateChat = async () => {
    const chat: Chat = {
      ...currentChat,
      name: currentChat.name,
      creator: Principal.fromText(currentChat.creator.id),
      members: getUsersByName(currentChat.members),
      admins: getUsersByName(currentChat.admins),
      workspaces: workSpacesRef.current,
    };
    let res = await backendActor?.update_chat(chat);
    return res;
  };

  const { workspaces } = useSelector((state: any) => state.filesState);
  const defaultValueWorkspaces = currentChat.workspaces
    ? currentChat.workspaces.map((id) => {
        const res = workspaces.find((w) => w.id == id);
        return res ? res.name : "Error";
      })
    : [];
  const isAdmin = currentChat?.creator.id == profile.id;

  return (
    <>
      <Autocomplete
        disabled={!isAdmin}
        multiple
        onChange={(event, value: any) => {
          workSpacesRef.current = value.map((name) => {
            return workspaces.find((w) => w.name == name).id;
          });
        }}
        defaultValue={defaultValueWorkspaces}
        disablePortal
        id="combo-box-demo"
        options={workspaces.map((w) => w.name)}
        renderInput={(params) => <TextField {...params} label={"workspaces"} />}
      />

      <LoaderButton onClick={handleUpdateChat}>Save</LoaderButton>
    </>
  );
};
const MessagesList: React.FC = () => {
  const { current_chat_id, chats } = useSelector(
    (state: RootState) => state.chatsState,
  );

  const [messages, setMessages] = useState<Message[]>(null);

  const currentChat = chats.find((chat) => chat.id === current_chat_id);

  useEffect(() => {
    if (currentChat) {
      setMessages(currentChat.messages || []);
    }
  }, [currentChat]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <MessagesGroupOption currentChat={currentChat} />
      <UpdateChatSettings currentChat={currentChat} />
      <Box sx={{ flex: 1, overflowY: "auto", padding: 2 }}>
        {messages && messages.length == 0 && (
          <Typography variant="h6" gutterBottom>
            You have no messages in this chat.
          </Typography>
        )}

        {messages ? (
          messages.map((message) => {
            return (
              <MessageComponent
                key={message.id}
                current_chat_id={current_chat_id!}
                {...message}
              />
            );
          })
        ) : currentChat ? (
          <CircularProgress />
        ) : (
          <Typography type={"info"}>No messages yet.</Typography>
        )}
        <ChatSendMessage />
      </Box>
    </Box>
  );
};

export default MessagesList;
