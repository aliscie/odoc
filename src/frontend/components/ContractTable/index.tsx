import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CustomContract } from "../../../declarations/backend/backend.did";
import { Box, Button, Input, MenuItem, Select, Tooltip } from "@mui/material";
import DeleteContract from "./actions/DeleteContract";
import { CONTRACT, CREATE_CONTRACT, PAYMENTS, PROMISES } from "./types";
import RenderViews, { VIEW_OPTIONS } from "./views";
import { debounce } from "lodash";
import { handleRedux } from "../../redux/store/handleRedux";
import { useDispatch } from "react-redux";
import { createCContract } from "./utils";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import DeleteTableContract from "./actions/DeleteTableContract";
import RenameTableContract from "./actions/RenameTableContract";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import BasicMenu from "../MuiComponents/BasicMenu";

export function CustomContractComponent({
  contract,
}: {
  contract: CustomContract;
}) {
  const dispatch = useDispatch();
  const [view, setView] = useState<VIEW_OPTIONS>({ content: PROMISES });
  const [expanded, setExpanded] = useState(true);

  let options = [
    {
      content: <DeleteContract id={contract && contract.id} />,
      pure: true,
    },
  ];
  if (view.contract) {
    options.push({
      content: <DeleteTableContract contract={contract} view={view} />,
    });
    options.push({
      content: <RenameTableContract contract={contract} view={view} />,
    });
  }

  let viewOptions: VIEW_OPTIONS[] = [
    {
      content: PROMISES,
      name: PROMISES,
      onClick: setView,
    },
    {
      content: PAYMENTS,
      name: PAYMENTS,
      onClick: setView,
    },
  ];

  contract.contracts.forEach((c) => {
    viewOptions.push({
      onClick: (view) => {
        setView(view);
      },
      content: CONTRACT,
      name: c.name,
      contract: c,
    });
  });

  viewOptions.push({
    name: "create contract",
    content: CREATE_CONTRACT,
    onClick: (view) => {
      let newContract = createCContract();
      let contracts = [...contract.contracts, newContract];
      let updateContract = { ...contract, contracts };
      setView({ content: CONTRACT, contract: newContract });
      dispatch(handleRedux("UPDATE_CONTRACT", { contract: updateContract }));
    },
  });

  const onChange = debounce((event: any) => {
    try {
      dispatch(
        handleRedux("UPDATE_CONTRACT", {
          contract: { ...contract, name: event.target.value },
        }),
      );
    } catch (error) {
      console.log("Error updating contract:", error);
    }
  }, 300);

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 1,
        boxShadow: 3,
        backgroundColor: "background.paper",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Input
          onChange={onChange}
          defaultValue={contract.name}
          sx={{
            flex: 1,
            mr: 2,
            bgcolor: "background.default",
            borderRadius: 1,
            p: 1,
          }}
        />
        <Button variant="outlined" sx={{ mr: 1 }}>
          Filter
        </Button>
        <Select
          defaultValue={PROMISES}
          sx={{ minWidth: 150, bgcolor: "background.default", borderRadius: 1 }}
        >
          {viewOptions.map((w: VIEW_OPTIONS, i: number) => (
            <MenuItem onClick={() => w.onClick(w)} key={i} value={w.name}>
              {w.content === CREATE_CONTRACT ? (
                <Tooltip title="Create new table">
                  <CreateNewFolderIcon />
                </Tooltip>
              ) : (
                w.name
              )}
            </MenuItem>
          ))}
        </Select>
        <Box sx={{ ml: 1 }}>
          <BasicMenu
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            options={options}
          >
             <MoreVertIcon />
          </BasicMenu>
        </Box>
        <Button onClick={() => setExpanded(!expanded)} sx={{ ml: 1 }}>
          {expanded ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
        </Button>
      </Box>
      {expanded && (
        <Box sx={{ borderTop: 1, borderColor: "divider", pt: 2 }}>
          <RenderViews view={view} contract={contract} />
        </Box>
      )}
    </Box>
  );
}
