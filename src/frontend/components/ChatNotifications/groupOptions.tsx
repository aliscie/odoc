import { Input, TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import { Principal } from "@dfinity/principal";
import Autocomplete from "@mui/material/Autocomplete";
import { Chat } from "../../../declarations/backend/backend.did";
import { useBackendContext } from "../../contexts/BackendContext";
import LoaderButton from "../MuiComponents/LoaderButton";
import { handleRedux } from "../../redux/store/handleRedux";
import {
  DELETE_CHAT,
  DELETE_CHATS_NOTIFICATIONS,
  UPDATE_CHAT,
} from "../../redux/types/chatsTypes";
import ConformationMessage from "../MuiComponents/conformationButton";

function MessagesGroupOption({ currentChat }) {
  const dispatch = useDispatch();
  const { backendActor } = useBackendContext();
  const isGroupChat = currentChat?.name !== "private_chat";

  if (!currentChat || !isGroupChat) {
    return null;
  }
  const { profile, all_friends } = useSelector(
    (state: RootState) => state.filesState,
  );

  const getUserByPrincopal = (p: string) => {
    return [profile, ...all_friends].find((u) => u.id == p);
  };
  const [members, setMembers] = useState(
    currentChat.members.map((m) => getUserByPrincopal(m.toText()).name),
  );

  const [name, setName] = useState(currentChat.name);
  const [admins, setAdmins] = useState(currentChat.admins.map((m) => m.name));
  const { workspaces } = useSelector((state: any) => state.filesState);

  const isAdmin = currentChat?.creator.id == profile.id;

  const getUsersByName = (names) => {
    return names.map((name) => {
      const user = [profile, ...all_friends].find((f) => f.name == name);
      return user && Principal.fromText(user.id);
    });
  };
  const onNameChange = (e) => {
    setName(e.target.value);
    dispatch(
      handleRedux(UPDATE_CHAT, {
        chat: { ...currentChat, name: e.target.value },
      }),
    );
  };

  const workSpacesRef = useRef(currentChat.workspaces);

  const handleUpdateChat = async () => {
    const chat: Chat = {
      ...currentChat,
      name,
      creator: Principal.fromText(currentChat.creator.id),
      members: getUsersByName(members),
      admins: getUsersByName(admins),
      workspaces: workSpacesRef.current,
    };
    let res = await backendActor?.update_chat(chat);
    return res;
  };
  const handleDeleteChat = async () => {
    let res = await backendActor?.delete_chat(currentChat.id);
    dispatch(handleRedux(DELETE_CHAT, { chat_id: currentChat.id }));
    dispatch(
      handleRedux(DELETE_CHATS_NOTIFICATIONS, { chat_id: currentChat.id }),
    );
    dispatch(handleRedux("OPEN_CHAT", { current_chat_id: false }));
    return res;
  };

  const defaultValueWorkspaces = currentChat.workspaces.map((id) => {
    const res = workspaces.find((w) => w.id == id);
    return res ? res.name : "Error";
  });
  return (
    <div>
      <Input
        label={"chat name"}
        key={currentChat?.id}
        onChange={onNameChange}
        disabled={!isAdmin}
        value={name || ""}
      />
      <div>
        This group created by:{" "}
        {profile && profile.id === currentChat.creator.id
          ? "You"
          : getUserByPrincopal(currentChat.creator.id).name}
      </div>

      <Autocomplete
        disabled={!isAdmin}
        multiple={true}
        onChange={(event, value: any) => setMembers(value)}
        defaultValue={members}
        disablePortal
        id="combo-box-demo"
        options={all_friends.map((f) => f.name)}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="members" />}
      />

      <Autocomplete
        disabled={!isAdmin}
        multiple={true}
        onChange={(event, value: any) => setAdmins(value)}
        defaultValue={members}
        id="combo-box-demo"
        options={all_friends.map((f) => f.name)}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Admins" />}
      />

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
      <ConformationMessage
        message={"Yes delete it!"}
        conformationMessage={`Are you sure you want to delete ${currentChat.name} group chat? `}
        onClick={handleDeleteChat}
      >
        Delete
      </ConformationMessage>
    </div>
  );
}

export default MessagesGroupOption;
