import React, { memo, useCallback, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AgGridDataGrid from "../MuiComponents/dataGridSheet";
import { randomString } from "../../DataProcessing/dataSamples";
import {
  addColumnToContract,
  contractContextMenu,
  createCColumn,
  createNewPromis,
  deleteColumnFromContract,
  getContractColumnDefs,
  handleAmountChange,
  handleReceiverChange,
  handleStatusChange,
  renameColumnInContract,
  transformPromisesDataAndColumns,
} from "./utils";
import { Principal } from "@dfinity/principal";
import { debounce } from "lodash";
import { formatRelativeTime } from "../../utils/time";
import DeleteIcon from "@mui/icons-material/Delete";
import DialogComponent from "../MuiComponents/dialogComponent";
import { useBackendContext } from "../../contexts/BackendContext";
import { useSnackbar } from "notistack";
import { handleRedux } from "../../redux/store/handleRedux";
import { useDispatch } from "react-redux";
// export function createFlagImg(flag: string) {
//   return (
//     '<img border="0" width="15" height="10" src="https://flags.fmcdn.net/data/flags/mini/' +
//     flag +
//     '.png"/>'
//   );
// }
// const generateDummyPayments = (count, profile, contract_id) =>
//   Array.from({ length: count }, (_, i) => ({
//     contract_id,
//     id: randomString(),
//     amount: Math.floor(Math.random() * 10000),
//     status: { Confirmed: null },
//     date_created: Date.now(),
//     date_released: Date.now(),
//     sender: profile.id,
//     receiver: "3vxsx-fae",
//     cells: [],
//   }));
// // Payment Status type definition
const PAYMENT_STATUSES = {
  None: null,
  RequestCancellation: null,
  Released: null,
  Objected: "",
  Confirmed: null,
  ConfirmedCancellation: null,
  ApproveHighPromise: null,
  HighPromise: null,
};
//
const DataTypeSelection = {
  PAYMENT: "payment",
  PROMISE: "promise",
  CONTRACT: "contract",
};

// Define payment/promise column definitions

const MetadataTooltip = memo(({ metadata }) => (
  <Box>
    {Object.entries(metadata).map(([key, val]) => (
      <Typography key={key} variant="body2">
        {key}: {val instanceof Date ? val.toLocaleDateString() : val.toString()}
      </Typography>
    ))}
  </Box>
));

// Memoized editable input to prevent focus loss during parent rerenders
const EditableInput = memo(({ value, onSave }) => {
  const [localValue, setLocalValue] = useState(value);

  const debouncedSave = useCallback(
    debounce((val) => onSave(val), 500),
    [onSave],
  );

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedSave(newValue);
  };

  return (
    <TextField
      value={localValue}
      onChange={handleChange}
      onBlur={() => onSave(localValue)}
      size="small"
      variant="standard"
      autoFocus
      sx={{
        "& .MuiInputBase-input": {
          fontSize: "h6.fontSize",
          fontWeight: "h6.fontWeight",
        },
      }}
    />
  );
});

const EditableTitle = ({ value, onChange, metadata }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = useCallback(
    (newValue) => {
      onChange(newValue);
      setIsEditing(false);
    },
    [onChange],
  );

  return (
    <Tooltip
      title={<MetadataTooltip metadata={metadata} />}
      placement="bottom-start"
    >
      <Box>
        {isEditing ? (
          <EditableInput value={value} onSave={handleSave} />
        ) : (
          <Typography
            variant="h6"
            onClick={() => setIsEditing(true)}
            sx={{
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "action.hover",
                borderRadius: 1,
                px: 1,
              },
              px: 1,
            }}
          >
            {value}
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
};

const CustomContractViewer = ({
  profile,
  all_friends,
  contracts,
  onContractChange,
}) => {
  // if (!contracts[0]) {
  //   return <Box>This contract deleted... </Box>;
  // }

  const [selectedDataType, setSelectedDataType] = useState(
    DataTypeSelection.PROMISE,
  );
  const [selectedContract, setSelectedContract] = useState(null);

  const [contractsState, setContractsState] = useState(contracts);

  const getPaymentColumnDefs = (isPromise = false) => [
    {
      lockPosition: true,
      rowDrag: true,
      field: "id",
      headerName: "ID",
      sortable: true,
      filter: true,
      editable: false,
    },
    {
      field: "amount",
      headerName: "Amount",
      sortable: true,
      filter: "agNumberColumnFilter",
      editable: isPromise,
      valueFormatter: (params) => `${params.value.toLocaleString()}`,
      onCellValueChanged: (params) =>
        handleAmountChange(params, contractsState[0], onContractChange),
    },
    {
      field: "status",
      headerName: "Status",
      valueGetter: (params) => {
        const statusKey = Object.keys(params.data.status)[0];
        const statusValue = params.data.status[statusKey];
        return statusKey === "Objected" && statusValue
          ? `${statusKey} (${statusValue})`
          : statusKey;
      },
      sortable: true,
      filter: true,
      editable: isPromise,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: Object.keys(PAYMENT_STATUSES),
      },
      valueSetter: (params) => {
        const newValue = params.newValue;
        if (newValue === "Objected") {
          // Get objection reason from user
          const reason = window.prompt("Enter objection reason:");
          if (reason !== null) {
            // Only update if user didn't cancel
            params.data.status = { [newValue]: reason || "" };
            return true;
          }
          return false;
        } else {
          params.data.status = { [newValue]: PAYMENT_STATUSES[newValue] };
          return true;
        }
      },
      onCellValueChanged: (params) => {
        let updated = handleStatusChange(params, contractsState[0]);
        onContractChange(updated);
      },
    },
    {
      field: "date_created",
      headerName: "Date Created",
      valueFormatter: (params) => formatRelativeTime(params.value),
      sortable: true,
      filter: "agDateColumnFilter",
      editable: false,
    },
    {
      field: "sender",
      headerName: "Sender",
      valueFormatter: (params) => {
        console.log({ valueFormatterSender: params });
        return (
          params.context.users?.find((u) => u.id == params.value.toString())
            ?.name || "None"
        );
        // return "xxx";
      },
      sortable: true,
      filter: true,
      editable: false,
    },

    {
      field: "receiver",
      headerName: "Receiver",
      valueGetter: (params) => {
        return (
          params.context.users?.find(
            (u) => u.id === params.data.receiver.toString(),
          )?.name || "Anonymous"
        );
      },
      sortable: true,
      filter: true,
      editable: isPromise,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: (params) => {
        return { values: params.context.users.map((u) => u.name) };
      },
      valueSetter: (params) => {
        const selectedName = params.newValue;
        const selectedUser = params.context.users.find(
          (u) => u.name === selectedName,
        );

        if (selectedUser) {
          params.data.receiver = selectedUser.id;
          return true;
        }
        return false;
      },
      onCellValueChanged: (params) =>
        handleReceiverChange(params, contractsState[0], onContractChange),
    },
  ];

  const handleMainContractNameChange = (newName) => {
    const updatedContract = {
      ...contractsState[0],
      name: newName,
    };
    setContractsState([updatedContract]);
    // let updatedContract = { ...contractsState[0] };
    // updatedContract.name = newName
    onContractChange(updatedContract);
  };

  const handleCContractNameChange = (contractId, newName) => {
    const updatedContract = {
      ...contractsState[0],
      contracts: contractsState[0].contracts.map((c) =>
        c.id === contractId ? { ...c, name: newName } : c,
      ),
    };
    setContractsState([updatedContract]);
    if (selectedContract?.id === contractId) {
      setSelectedContract({ ...selectedContract, name: newName });
    }
    onContractChange(updatedContract); // Add this line
  };

  const handleDataTypeChange = (event) => {
    const value = event.target.value;

    if (
      value === DataTypeSelection.PAYMENT ||
      value === DataTypeSelection.PROMISE
    ) {
      setSelectedDataType(value);
      setSelectedContract(null);
    } else if (value !== "create_new") {
      // It's a contract ID
      const contract = contractsState[0].contracts.find((c) => c.id === value);
      if (contract) {
        setSelectedContract(contract);
        setSelectedDataType(DataTypeSelection.CONTRACT);
      }
    }
  };

  const handleCreateNewContract = () => {
    const newContract = {
      id: randomString(),
      name: `New Table ${contractsState[0].contracts.length + 1}`,
      date_created: Date.now() * 1e6,
      creator: Principal.fromText(profile.id),
      rows: [],
      columns: [createCColumn("untitled")],
    };

    const updatedContract = {
      ...contractsState[0],
      contracts: [...contractsState[0].contracts, newContract],
    };

    setContractsState([updatedContract]);
    setSelectedContract(newContract);
    setSelectedDataType(DataTypeSelection.CONTRACT);
    onContractChange(updatedContract);
  };
  console.log({ contractsState });
  const promisesData = transformPromisesDataAndColumns(
    contractsState[0]?.promises,
    getPaymentColumnDefs(true),
    true,
  );
  const paymentsData = transformPromisesDataAndColumns(
    contractsState[0].payments,
    getPaymentColumnDefs(false),
    false,
  );

  const getContextMenuItems = (params) => {
    const baseMenuItems = [
      {
        // custom item
        name: "add row",
        action: (params) => {
          let promises = [...contractsState[0].promises];
          let sender = profile && Principal.fromText(profile?.id);
          promises.push(createNewPromis(sender));
          const updatedContract = { ...contractsState[0], promises };
          onContractChange && onContractChange(updatedContract);
        },
      },
      {
        // custom item
        name: "delete row",

        action: (params) => {
          let promises = [...contractsState[0].promises];
          promises = promises.filter((p) => p.id != params.node?.data.id);
          const updatedContract = { ...contractsState[0], promises };
          onContractChange(updatedContract);
        },
      },
      {
        // custom item
        name: "add column",
        action: (params) => {
          const updatedContract = addColumnToContract(
            contractsState[0],
            randomString(),
            "",
          );
          onContractChange(updatedContract);
        },
      },
    ];

    const nonDeletableColumns = [
      "id",
      "amount",
      "sender",
      "receiver",
      "date_created",
      "date_released",
      "status",
    ];

    // Only add delete column option for custom columns
    const currentColumnId = params.column?.getColId();
    if (params.column && !nonDeletableColumns.includes(currentColumnId)) {
      baseMenuItems.push({
        name: "rename column",
        action: (params) => {
          const oldFieldName = params.column?.getColId();
          const newFieldName = window.prompt(
            "Enter new name for column:",
            oldFieldName,
          );

          if (!newFieldName || newFieldName === oldFieldName) return;

          // Check if new name already exists
          if (params.api.getColumnDef(newFieldName)) {
            alert("A column with this name already exists.");
            return;
          }

          const updatedContract = renameColumnInContract(
            contractsState[0],
            oldFieldName,
            newFieldName,
          );
          onContractChange(updatedContract);
        },
      });

      baseMenuItems.push({
        name: "delete column",
        action: (params) => {
          const fieldName = params.column.getColId();
          const updatedContract = deleteColumnFromContract(
            contractsState[0],
            fieldName,
          );
          onContractChange(updatedContract);
        },
      });
    }

    return baseMenuItems;
  };

  const { login, logout, backendActor } = useBackendContext();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <AppBar position="static" color="default" elevation={1} sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <EditableTitle
            value={contractsState[0].name}
            onChange={handleMainContractNameChange}
            metadata={{
              Created: new Date(contractsState[0].date_created),
              Updated: new Date(contractsState[0].date_updated),
              Creator: contractsState[0].creator,
            }}
          />

          <FormControl sx={{ minWidth: 250 }}>
            <InputLabel>Select Data</InputLabel>
            <Select
              value={selectedDataType}
              label="Select Data"
              onChange={handleDataTypeChange}
            >
              <MenuItem value={DataTypeSelection.PROMISE}>Promises</MenuItem>
              <MenuItem value={DataTypeSelection.PAYMENT}>Payments</MenuItem>

              {/*<MenuItem sx={{ borderTop: 1, borderColor: 'divider', mt: 1, pt: 1 }}>Contracts</MenuItem>*/}
              {contractsState[0].contracts.map((contract) => (
                <MenuItem
                  key={contract.id}
                  value={contract.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {contract.name}
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the MenuItem
                      if (
                        window.confirm(
                          `Are you sure you want to delete table "${contract.name}"?`,
                        )
                      ) {
                        const updatedContract = {
                          ...contractsState[0],
                          contracts: contractsState[0].contracts.filter(
                            (c) => c.id !== contract.id,
                          ),
                        };
                        setContractsState([updatedContract]);
                        if (selectedContract?.id === contract.id) {
                          setSelectedContract(null);
                          setSelectedDataType(DataTypeSelection.PROMISE);
                        }
                        onContractChange(updatedContract);
                      }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </MenuItem>
              ))}
              <MenuItem>
                <Button
                  fullWidth
                  startIcon={<AddIcon />}
                  onClick={handleCreateNewContract}
                >
                  Create New Table
                </Button>
              </MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ flexGrow: 1 }} />

          <DialogComponent
            onConfirm={async () => {
              let res = await backendActor.delete_custom_contract(
                contractsState[0].id,
              );
              if (res.Ok == null || res.Err === "Not found") {
                dispatch(
                  handleRedux("REMOVE_CONTRACT", { id: contractsState[0].id }),
                );
              } else if (res.Err) {
                enqueueSnackbar(res.Err, { variant: "error" });
              }
            }}
            button={<Button color={"error"}>Delete</Button>}
            title={"Delete post"}
            content={"Are you sure you want to delete this contract?"}
          />
        </Stack>
      </AppBar>

      <Box sx={{ mt: 2, px: 2 }}>
        {selectedDataType === DataTypeSelection.CONTRACT &&
          selectedContract && (
            <EditableTitle
              value={selectedContract.name}
              onChange={(newName) =>
                handleCContractNameChange(selectedContract.id, newName)
              }
              metadata={{
                Created: new Date(selectedContract.date_created),
                Creator: selectedContract.creator,
              }}
            />
          )}

        <Box sx={{ mt: 2 }}>
          {selectedDataType === DataTypeSelection.PAYMENT && (
            <AgGridDataGrid
              getContextMenuItems={() => {
                return [];
              }}
              context={{ users: all_friends }}
              rows={paymentsData.rows}
              columns={paymentsData.columns}
            />
          )}
          {selectedDataType === DataTypeSelection.PROMISE && (
            <AgGridDataGrid
              getContextMenuItems={getContextMenuItems}
              context={{ users: all_friends, onContractChange, contractsState }}
              rows={promisesData.rows}
              columns={promisesData.columns}
            />
          )}
          {selectedDataType === DataTypeSelection.CONTRACT &&
            selectedContract && (
              <AgGridDataGrid
                getContextMenuItems={contractContextMenu}
                context={{
                  contractsState,
                  onContractChange,
                  selectedContract,
                }}
                rows={selectedContract.rows}
                columns={getContractColumnDefs(selectedContract.columns)}
              />
            )}
        </Box>
      </Box>
    </Box>
  );
};
export default CustomContractViewer;
