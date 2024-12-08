import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, TextField } from "@mui/material";
import { Chat, Message } from "../../../declarations/backend/backend.did";
import { RootState } from "../../redux/reducers";
import MessagesGroupOption from "./groupOptions";
import LoaderButton from "../MuiComponents/LoaderButton";
import { Principal } from "@dfinity/principal";
import Autocomplete from "@mui/material/Autocomplete";
import { useBackendContext } from "../../contexts/BackendContext";
import { randomId } from "@mui/x-data-grid-generator";
import { handleRedux } from "../../redux/store/handleRedux";
import { formatRelativeTime } from "../../utils/time";
import ChatBox from "../MuiComponents/chatUi";

const UpdateChatSettings = ({ currentChat }) => {
  if (!currentChat || currentChat.name !== "private_chat") {
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
  const { backendActor } = useBackendContext();
  const dispatch = useDispatch();
  const { current_chat_id, chats } = useSelector(
    (state: RootState) => state.chatsState,
  );

  const currentChat: Chat = chats.find((chat) => chat.id === current_chat_id);

  const { profile, all_friends } = useSelector(
    (state: any) => state.filesState,
  );
  const { current_user } = useSelector((state: any) => state.chatsState);

  const handleSendMessage = async (message) => {
    if (message.trim()) {
      const newMessage: Message = {
        id: `${Date.now()}`,
        date: BigInt(Date.now()),
        sender: Principal.fromText(profile.id),
        seen_by: [Principal.fromText(profile.id)],
        message,
        chat_id: current_chat_id,
      };

      if (newMessage.chat_id === "chat_id") {
        console.log("chat_id is not set");
        newMessage.chat_id = randomId();
      }
      let user = current_user ? [current_user] : [];
      let res = await backendActor.send_message(user, newMessage);
      if ("Err" in res) {
        // enqueueSnackbar("Error sending message: " + res.Err, {
        //   variant: "error",
        // });
      } else {
        dispatch(handleRedux("UPDATE_MESSAGE", { message: newMessage }));
      }
      dispatch(handleRedux("SEND_MESSAGE", { message: newMessage }));
    }
    return { Ok: true };
  };
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <MessagesGroupOption currentChat={currentChat} />
      <UpdateChatSettings currentChat={currentChat} />

      <ChatBox
        key={currentChat && currentChat.messages.length}
        profile={profile}
        handleSendMessage={handleSendMessage}
        messages={
          currentChat &&
          currentChat.messages &&
          currentChat.messages.map((m: Message) => {
            let name = all_friends.find(
              (f) => f.id == m.sender.toString(),
            )?.name;
            if (name == profile.name) {
              name = "";
            }
            return {
              id: m.id,
              text: m.message,
              isOutgoing: profile.id == m.sender.toString(),
              avatar: "m.sender.photo",
              timestamp: formatRelativeTime(m.date),
              name,
              userId: m.sender.toString() !== profile.id && m.sender.toString(),
            };
          })
        }
      />
    </Box>
  );
};

export default MessagesList;
