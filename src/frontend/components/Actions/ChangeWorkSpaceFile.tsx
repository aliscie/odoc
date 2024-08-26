import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { WorkSpace } from "../../../declarations/backend/backend.did";

const ChangeWorkSpace = (props: any) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { workspaces } = useSelector((state: any) => state.filesState);

  const workSpaceNames =
    workspaces?.map((workspace: WorkSpace) => workspace.name) || [];

  const handleWorkSpaceChange = (event: SelectChangeEvent<unknown>) => {
    const selectedWorkSpace = event.target.value;
    console.log(selectedWorkSpace);
    enqueueSnackbar(`Switched to workspace: ${selectedWorkSpace}`, {
      variant: "success",
    });
  };

  return (
    <Select onChange={handleWorkSpaceChange}>
      {workSpaceNames.map((name, index) => (
        <MenuItem key={index} value={name}>
          {name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default ChangeWorkSpace;
