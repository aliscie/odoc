import { Input, TextField } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import { Principal } from "@dfinity/principal";
import Autocomplete from "@mui/material/Autocomplete";
import { Chat } from "../../../declarations/backend/backend.did";
import { useBackendContext } from "../../contexts/BackendContext";
import LoaderButton from "../MuiComponents/LoaderButton";
import { handleRedux } from "../../redux/store/handleRedux";
import { DELETE_CHAT, UPDATE_CHAT } from "../../redux/types/chatsTypes";

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

  const getUserByPrincopal = (p) => {
    return [profile, ...all_friends].find((u) => u.id == p.toText());
  };
  const [members, setMembers] = useState(
    currentChat.members.map((m) => getUserByPrincopal(m).name),
  );

  const [name, setName] = useState(currentChat.name);
  const [admins, setAdmins] = useState(currentChat.admins.map((m) => m.name));
  const [workSpaces, setWorkspaces] = useState([currentChat.workspace]);

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
  const handleUpdateChat = async () => {
    const chat: Chat = {
      ...currentChat,
      name,
      creator: Principal.fromText(currentChat.creator.id),
      members: getUsersByName(members),
      admins: getUsersByName(admins),
      workspace: String(workSpaces[0]),
    };
    let res = await backendActor?.update_chat(chat);
    return res;
  };
  const handleDeleteChat = async () => {
    let res = await backendActor?.delete_chat(currentChat.id);
    dispatch(handleRedux(DELETE_CHAT, { chat_id: currentChat.id }));
    return res;
  };

  return (
    <div>
      <Input
        key={currentChat?.id}
        onChange={onNameChange}
        disabled={!isAdmin}
        defaultValue={currentChat?.name || ""}
      />

      <Autocomplete
        disabled={!isAdmin}
        label="members"
        multiple={true}
        onChange={(event, value: any) => setMembers(value)}
        defaultValue={members}
        disablePortal
        id="combo-box-demo"
        options={all_friends.map((f) => f.name)}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} />}
      />

      <Autocomplete
        label="Admins"
        disabled={!isAdmin}
        multiple={true}
        onChange={(event, value: any) => setAdmins(value)}
        defaultValue={members}
        id="combo-box-demo"
        options={all_friends.map((f) => f.name)}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} />}
      />

      <Autocomplete
        disabled={!isAdmin}
        label={"workspaces"}
        multiple={true}
        onChange={(event, value: any) => {
          setWorkspaces(value);
        }}
        defaultValue={members}
        disablePortal
        id="combo-box-demo"
        options={["defaults", "odoc", "ish"]}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} />}
      />

      <LoaderButton onClick={handleUpdateChat}>Save</LoaderButton>
      <LoaderButton type={"error"} onClick={handleDeleteChat}>
        Delete
      </LoaderButton>
    </div>
  );
}

export default MessagesGroupOption;
