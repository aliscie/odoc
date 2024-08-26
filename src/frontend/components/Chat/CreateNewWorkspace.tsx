import React, { useRef, useState } from "react";
import { handleRedux } from "../../redux/store/handleRedux";
import { useDispatch, useSelector } from "react-redux";
import { TextField, Button, Tooltip, Input } from "@mui/material";
import { WorkSpace } from "../../../declarations/backend/backend.did";
import { Principal } from "@dfinity/principal";
import { randomString } from "../../DataProcessing/dataSamples";
import { useSnackbar } from "notistack";
import { useBackendContext } from "../../contexts/BackendContext";
import AddIcon from "@mui/icons-material/Add";
import { Result_11 } from "../../../declarations/backend/backend.did";

function useCreateWorkSpace() {
  const { backendActor } = useBackendContext();
  const { enqueueSnackbar } = useSnackbar();
  const { profile } = useSelector((state: any) => state.filesState);
  const dispatch = useDispatch();

  const nameRef = useRef("");

  const handleChange =
    (ref: React.MutableRefObject<string>) =>
    (event: { target: { value: string } }) => {
      ref.current = event.target.value;
    };

  const top_dialog = {
    open: true,
    handleSave: async () => {
      if (!backendActor) {
        enqueueSnackbar("Backend service is unavailable", { variant: "error" });
        return false;
      }

      if (nameRef.current.length === 0) {
        enqueueSnackbar("Name is required", { variant: "error" });
        return false;
      }

      const newWorkSpace: WorkSpace = {
        name: nameRef.current,
        id: randomString(),
        files: [],
        creator: Principal.fromText(profile.id),
        members: [],
        chats: [],
        admins: [],
      };

      let saveWorkSpace = (await backendActor.save_work_space(
        newWorkSpace,
      )) as Result_11;

      if ("Ok" in saveWorkSpace) {
        dispatch(handleRedux("ADD_WORKSPACE", { newWorkSpace }));
        enqueueSnackbar("WorkSpace created", { variant: "success" });
      } else {
        enqueueSnackbar("Error: " + saveWorkSpace.Err, { variant: "error" });
      }
      return true;
    },
    content: (
      <>
        <TextField name="name" label="Name" onChange={handleChange(nameRef)} />
      </>
    ),
  };

  const createNewWorkspace = async () => {
    dispatch(handleRedux("TOP_DIALOG", top_dialog));
  };

  const [searchValue, setSearchValue] = useState("");

  const WorkspaceOptions = () => {
    return (
      <div>
        <Tooltip arrow title={"Create new workspace"}>
          <Button onClick={createNewWorkspace}>
            <AddIcon />
          </Button>
        </Tooltip>
        <Input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search workspaces"
          inputProps={{ "aria-label": "search workspaces" }}
        />
      </div>
    );
  };

  return {
    workspaceGroup: {
      pure: true,
      content: <WorkspaceOptions />,
    },
    searchValue,
  };
}

export default useCreateWorkSpace;
