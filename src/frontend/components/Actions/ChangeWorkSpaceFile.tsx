import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { handleRedux } from "../../redux/store/handleRedux";

const ChangeWorkSpace = (props: any) => {
  const dispatch = useDispatch();


  const { workspaces, files } = useSelector((state: any) => state.filesState);
  const fileId = window.location.pathname.split("/")[1];
  const current_file = files.find((file: any) => file.id === fileId);

  const handleWorkSpaceChange = (value) => {
    let updatedWorkspaces = value.map((w) => {
      return w.id;
    });
    dispatch(
      handleRedux("UPDATE_FILE_WORKSPACES", {
        id: current_file.id,
        workspaces: updatedWorkspaces,
      }),
    );
  };
  let theFile = current_file && files.find((f) => f.id == current_file.id);

  const defaultValue =
    theFile &&
    theFile.workspaces.map((workspaceId) => {
      const W = workspaces.find((w) => w.id == workspaceId);
      return { title: W.name, id: W.id };
    });

  return (
    <Autocomplete
      multiple
      disabled={props.readOnly}
      onChange={(e, value) => handleWorkSpaceChange(value)}
      limitTags={3}
      id="multiple-limit-tags"
      options={workspaces.map((workspace) => {
        return { title: workspace.name, id: workspace.id };
      })}
      getOptionLabel={(option) => option.title}
      value={defaultValue || []}
      renderInput={(params) => (
        <TextField
          {...params}
          label={"workspaces"}
          // placeholder="Favorites"
        />
      )}
      // sx={{ width: "250px" }}
    />

    // <Select onChange={handleWorkSpaceChange}>
    //   {workSpaceNames.map((name, index) => (
    //     <MenuItem key={index} value={name}>
    //       {name}
    //     </MenuItem>
    //   ))}
    // </Select>
  );
};

export default ChangeWorkSpace;
