import React, { useState } from "react";
import { Tooltip } from "@mui/material";
import { useSelector } from "react-redux";
import BasicMenu from "../MuiComponents/BasicMenu";
import useCreateWorkSpace from "../Chat/CreateNewWorkspace";
import { WorkSpace } from "../../../declarations/backend/backend.did";

interface Props {}

const Workspaces = (props: Props) => {
  const { workspaces } = useSelector((state: any) => state.filesState);

  const createWorkspace = useCreateWorkSpace();

  const [selectedWorkspace, setSelectedWorkspace] = useState("My work space");

  const options = [
    createWorkspace,
    ...workspaces.map((workspace: WorkSpace) => ({
      content: workspace.name,
      onClick: () => setSelectedWorkspace(workspace.name),
    })),
  ];

  return (
    <BasicMenu
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      options={options}
    >
      <Tooltip arrow title="Choose your workspace">
        {/* Display the selected workspace name */}
        <span>{selectedWorkspace}</span>
      </Tooltip>
    </BasicMenu>
  );
};

export default Workspaces;
