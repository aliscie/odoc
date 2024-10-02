import React, { useState } from "react";
import { Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import BasicMenu from "../../MuiComponents/BasicMenu";
import useCreateWorkSpace from "./CreateNewWorkspace";
import { WorkSpace } from "../../../../declarations/backend/backend.did";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useBackendContext } from "../../../contexts/BackendContext";
import { Principal } from "@dfinity/principal";
import { randomString } from "../../../DataProcessing/dataSamples";
import { handleRedux } from "../../../redux/store/handleRedux";
import LoaderButton from "../../MuiComponents/LoaderButton";
import ContextMenu from "../../MuiComponents/ContextMenu";
import RenameWorkspace from "./renameWorkspaces";
import DeleteWorkspace from "./deleteWorkspace";

interface Props {}

const WorkSpaces = (props: Props) => {
  const { profile } = useSelector((state: any) => state.filesState);

  const dispatch = useDispatch();
  const { backendActor } = useBackendContext();
  const { workspaces } = useSelector((state: any) => state.filesState);

  const createWorkspace = useCreateWorkSpace();

  const [selectedWorkspace, setSelectedWorkspace] = useState("default");
  const selectWorkSpace = (workspace) => {
    dispatch(
      handleRedux("CHANGE_CURRENT_WORKSPACE", { currentWorkspace: workspace }),
    );
    setSelectedWorkspace(workspace.name);
  };

  const contextMenuOptions = (options: WorkSpace) => [
    {
      content: <RenameWorkspace {...options} />,
      pure: true,
    },

    {
      pure: true,
      content: <DeleteWorkspace {...options} />,
    },
  ];
  const options = [
    createWorkspace,
    ...workspaces.map((workspace: WorkSpace) => ({
      preventClose: true,
      content: (
        <ContextMenu options={contextMenuOptions(workspace)}>
          {workspace.name}
        </ContextMenu>
      ),
      onClick: () => selectWorkSpace(workspace),
    })),
  ];
  const handleCreateWorkSpace = async () => {
    let workspace: WorkSpace = {
      id: randomString(),
      files: [],
      creator: Principal.fromText(profile.id),
      members: [],
      chats: [],
      name: "untitled",
      admins: [],
    };
    let res = await backendActor?.save_work_space(workspace);
    dispatch(handleRedux("ADD_WORKSPACE", { workspace }));
    return res;
  };

  options.push({
    onClick: () => selectWorkSpace({ name: "Default" }),
    content: <Tooltip title={"Show all your data"}>Default</Tooltip>,
  });

  options.push({
    pure: true,
    content: (
      <LoaderButton
        fullWidth={true}
        startIcon={
          <Tooltip title={"create new workspace"}>
            <AddCircleOutlineIcon />
          </Tooltip>
        }
        onClick={handleCreateWorkSpace}
      ></LoaderButton>
    ),
  });
  const handleChoseWorkspace = (event: any) => {
    console.log({});
  };
  return (
    <BasicMenu
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      options={options}
    >
      <Tooltip arrow title="Choose your workspace">
        <span onClick={handleChoseWorkspace}>{selectedWorkspace}</span>
      </Tooltip>
    </BasicMenu>
  );
};

export default WorkSpaces;
