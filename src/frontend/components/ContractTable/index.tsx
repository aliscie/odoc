import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CustomContract } from "../../../declarations/backend/backend.did";
import BasicMenu from "../MuiComponents/DropDown";
import {
  Button,
  ButtonGroup,
  Input,
  MenuItem,
  Select,
  Tooltip,
  Typography,
  Box,
} from "@mui/material";
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
      content: <DeleteContract id={contract.id} />,
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
    content: CREATE_CONTRACT,
    onClick: (view) => {
      let newContract = createCContract();
      let contracts = [...contract.contracts, newContract];
      let updateContract = { ...contract, contracts };
      setView({ content: CONTRACT, contract: newContract });
      dispatch(handleRedux("UPDATE_CONTRACT", { contract: updateContract }));
    },
  });

  // const debouncedOnChange = debounce((e: any) => {
  //   let updated_contract = { ...contract, name: e.target.value };
  //   console.log("updated_contract", updated_contract);
  //   dispatch(handleRedux("UPDATE_CONTRACT", { contract: updated_contract }));
  // }, 300);

  // const debouncedOnChange = debounce((e: any) => {
  //   const newContractName = e.target.value;
  //   const existingContract = contract.contracts.find(
  //     (c) => c.name === newContractName,
  //   );
  //   if (!existingContract) {
  //     let updated_contract = { ...contract, name: newContractName };
  //     dispatch(handleRedux("UPDATE_CONTRACT", { contract: updated_contract }));
  //   } else {
  //     console.error(`Contract with name ${newContractName} already exists`);
  //   }
  // }, 300);

  const onChange = debounce((event: any) => {
    try {
      let updatedContracts = contract.contracts.filter(
        (c) => c.id !== contractId,
      );
      updatedContracts.push({
        ...contract.contracts.find((c) => c.id === contractId),
        name: event.target.value,
      });

      console.log("updatedContracts", updatedContracts);
      dispatch(handleRedux("UPDATE_CONTRACT", { contracts: updatedContracts }));
    } catch (error) {
      console.error("Error updating contract:", error);
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
          {viewOptions.map((w, i) => (
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
