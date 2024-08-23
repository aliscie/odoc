import React, { useRef, useState, ChangeEvent } from "react";
import { handleRedux } from "../../redux/store/handleRedux";
import { useDispatch, useSelector } from "react-redux";
import { Button, MenuItem, Tooltip, Select, TextField } from "@mui/material";
import MultiAutoComplete from "../MuiComponents/MultiAutocompelte";
import { Chat, Message, WorkSpace } from "../../../declarations/backend/backend.did";
import { Principal } from "@dfinity/principal";
import { useSnackbar } from "notistack";
import { randomString } from "../../DataProcessing/dataSamples";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import Input from '@mui/material/Input';
import { useBackendContext } from "../../contexts/BackendContext";

interface SelectMembersProps {
    onChange: (friends: any) => void;
}

function SelectMembers({ onChange }: SelectMembersProps) {
    const { all_friends } = useSelector((state: any) => state.filesState);
    const [selectedFriends, setSelectedFriends] = useState([]);

    return (
        <MultiAutoComplete
            onChange={(event, friends) => {
                console.log(friends);
                onChange(friends);
                setSelectedFriends(friends);
            }}
            value={selectedFriends}
            options={all_friends.map(friend => ({ title: friend.name, id: friend.id }))}
            multiple
        />
    );
}

function useCreateChatGroup() {
    const { enqueueSnackbar } = useSnackbar();
    const { all_friends, profile, workspaces } = useSelector((state: any) => state.filesState);
    const { backendActor } = useBackendContext();
    const dispatch = useDispatch();

    const options = all_friends ? all_friends.map(f => ({
        title: f.name,
        id: Principal.fromText(f.id)
    })) : [];

    const nameRef = useRef<string>("");
    const [admins, setAdmins] = useState([{ title: profile?.name || '', id: Principal.fromText(profile?.id || '') }]);
    const [members, setMembers] = useState<typeof options | undefined>(undefined);
    const [searchValue, setSearchValue] = useState<string>("");

    const handleChange = (ref: React.MutableRefObject<string>) => (event: ChangeEvent<HTMLInputElement>) => {
        ref.current = event.target.value;
    };

    const workspacesOptions = workspaces ? workspaces.map((w: WorkSpace) => w.name) : [];

    const topDialog = {
        open: true,
        handleSave: async () => {
            if (nameRef.current.length === 0) {
                enqueueSnackbar("Name is required", { variant: "error" });
                return false;
            }

            const chat_id = randomString();
            const message: Message = {
                id: randomString(),
                date: BigInt(Date.now()),
                sender: Principal.fromText(profile.id),
                seen_by: [Principal.fromText(profile.id)],
                message: `${profile.name} just created a new Chat group named ${nameRef.current}`,
                chat_id
            };

            const chat: Chat = {
                id: chat_id,
                creator: Principal.fromText(profile.id),
                members: members?.map(m => m.id) || [],
                messages: [message],
                name: nameRef.current,
                admins: admins.map(a => a.id),
                workspace: ""
            };

            try {
                const res = await backendActor?.make_new_chat_room(chat);
                if (res && "Ok" in res) {
                    enqueueSnackbar("Chat group created successfully", { variant: "success" });
                } else if (res && "Err" in res) {
                    enqueueSnackbar(`Error: ${res.Err}`, { variant: "error" });
                }
            } catch (error) {
                enqueueSnackbar("Failed to create chat group", { variant: "error" });
                console.error("Error creating chat group:", error);
            }
            return true;
        },
        content: (
            <>
                <TextField name="name" label="Name" onChange={handleChange(nameRef)} />
                <MultiAutoComplete
                    label="Admins"
                    onChange={(event: any, values: any) => {
                        setAdmins(values.some((v: any) => v.id.toText() === profile.id) ? values : [...values, admins[0]]);
                    }}
                    value={admins}
                    options={options}
                    multiple
                />
                <MultiAutoComplete
                    label="Members"
                    onChange={(event: any, value: any) => setMembers(value)}
                    value={members}
                    options={options}
                    multiple
                />
                <Select onChange={e => console.log(e.target.value)}>
                    {workspacesOptions.map((w, i) => (
                        <MenuItem key={i} value={w}>{w}</MenuItem>
                    ))}
                </Select>
            </>
        )
    };

    const createNewGroup = async () => {
        dispatch(handleRedux("TOP_DIALOG", topDialog));
    };

    const GroupOptions = () => (
        <div>
            <Tooltip arrow title="Create new group">
                <Button onClick={createNewGroup}><GroupAddIcon /></Button>
            </Tooltip>
            <Input
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search username, content, group name"
                inputProps={{ 'aria-label': 'search google maps' }}
            />
        </div>
    );

    return {
        chatGroup: {
            pure: true,
            content: <GroupOptions />
        },
        searchValue
    };
}

export default useCreateChatGroup;
