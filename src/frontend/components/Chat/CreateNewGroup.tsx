import React, { useRef, useState, ChangeEvent } from "react";
import { handleRedux } from "../../redux/store/handleRedux";
import { useDispatch, useSelector } from "react-redux";
import { Button, MenuItem, Tooltip, Select, TextField } from "@mui/material";
import MultiAutoComplete from "../MuiComponents/MultiAutocompelte";
import {
  Chat,
  Message,
  WorkSpace,
} from "../../../declarations/backend/backend.did";
import { Principal } from "@dfinity/principal";
import { useSnackbar } from "notistack";
import { randomString } from "../../DataProcessing/dataSamples";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import Input from "@mui/material/Input";
import { useBackendContext } from "../../contexts/BackendContext";
import PaymentsIcon from "@mui/icons-material/Payments";
import AlertDialog from "../MuiComponents/AlertDialog";
import LoaderButton from "../MuiComponents/LoaderButton";
import {ADD_CHAT, ADD_CHATS_NOTIFICATIONS} from "../../redux/types/chatsTypes";

// interface SelectMembersProps {
//   onChange: (friends: any) => void;
// }

// function SelectMembers({ onChange }: SelectMembersProps) {
//   const { all_friends } = useSelector((state: any) => state.filesState);
//   const [selectedFriends, setSelectedFriends] = useState([]);
//
//   return (
//     <MultiAutoComplete
//       onChange={(event, friends) => {
//         console.log(friends);
//         onChange(friends);
//         setSelectedFriends(friends);
//       }}
//       value={selectedFriends}
//       options={all_friends.map((friend) => ({
//         title: friend.name,
//         id: friend.id,
//       }))}
//       multiple
//     />
//   );
// }

function useCreateChatGroup() {
  const dispatch = useDispatch();
  const { backendActor } = useBackendContext();
  const { all_friends, profile, workspaces } = useSelector(
    (state: any) => state.filesState,
  );

  const [searchValue, setSearchValue] = useState<string>("");

  async function createChatGroup() {
    const chat_id = randomString();

    const message: Message = {
      id: randomString(),
      date: BigInt(Date.now()),
      sender: Principal.fromText(profile.id),
      seen_by: [Principal.fromText(profile.id)],
      message: `${profile.name} just created a new Chat group.`,
      chat_id,
    };
    let currentWorkspaceId = "";
    let chat: Chat = {
      id: chat_id,
      creator: Principal.fromText(profile.id),
      // members: members?.map((m) => m.id) || [],
      members: [],
      messages: [message],
      // name: nameRef.current,
      name: "untitled",
      // admins: admins.map((a) => a.id),
      admins: [Principal.fromText(profile.id)],
      workspaces: [currentWorkspaceId],
    };

    const res = await backendActor?.make_new_chat_room(chat);
    chat.creator = profile;
    dispatch(handleRedux(ADD_CHAT, { chat }));
    dispatch(handleRedux(ADD_CHATS_NOTIFICATIONS, { message }));
    return res;
  }
  const GroupOptions = () => (
    <div>
      <LoaderButton startIcon={<GroupAddIcon />} onClick={createChatGroup} />

      {/*<Button onClick={createNewGroup}>*/}
      {/*  <GroupAddIcon />*/}
      {/*</Button>*/}

      {/*<Input*/}
      {/*  defaultValue={searchValue}*/}
      {/*  onChange={(e) => setSearchValue(e.target.value)}*/}
      {/*  sx={{ ml: 1, flex: 1 }}*/}
      {/*  placeholder="Search username, content, group name"*/}
      {/*  inputProps={{ "aria-label": "search google maps" }}*/}
      {/*/>*/}
    </div>
  );

  return {
    chatGroup: {
      pure: true,
      content: <GroupOptions />,
    },
    searchValue,
  };
}

export default useCreateChatGroup;
