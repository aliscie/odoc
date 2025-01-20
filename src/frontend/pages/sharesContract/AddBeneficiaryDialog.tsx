import React, { useMemo, useCallback, useState, useEffect } from "react";
import { Box, Typography, Stack, useTheme, alpha } from "@mui/material";
import { AccountCircle as AccountCircleIcon } from "@mui/icons-material";
import { ColDef } from "ag-grid-community";
import AgGridDataGrid from "../../components/MuiComponents/dataGridSheet";
import { CPayment } from "../../../declarations/backend/backend.did";
import { randomString } from "../../DataProcessing/dataSamples";
import { Principal } from "@dfinity/principal";
import { useSelector } from "react-redux";

interface BeneficiariesTableProps {
  all_friends: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  promises: CPayment[];
  isCreator?: boolean;
  onUpdate: (promises: CPayment[]) => void;
}

export const BeneficiariesTable: React.FC<BeneficiariesTableProps> = ({
  promises,
  isCreator = false,
  onUpdate,
}) => {
  const {  all_friends } = useSelector(
    (state: any) => state.filesState,
  );
  const theme = useTheme();
  const [remainingShares, setRemainingShares] = useState(100);

  // Calculate remaining shares whenever promises change
  useEffect(() => {
    const totalShares = promises.reduce(
      (sum, promise) => sum + (promise.amount || 0),
      0,
    );
    setRemainingShares(100 - totalShares);
  }, [promises]);

  const handleAddBeneficiary = useCallback(() => {
    const newPromise: CPayment = {
      id: randomString(),
      receiver: Principal.fromText("2vxsx-fae"),
      amount: 0,
      status: { None: null },
      date_created: Date.now(),
      date_released: Date.now(),
      cells: [],
      contract_id: promises[0]?.contract_id || "",
      sender: Principal.fromText("2vxsx-fae"),
    };

    onUpdate([...promises, newPromise]);
  }, [promises, onUpdate]);

  const handleDeleteBeneficiary = useCallback(
    (promiseId: string) => {
      onUpdate(promises.filter((p) => p.id !== promiseId));
    },
    [promises, onUpdate],
  );

  const handleCellValueChanged = useCallback(
    (params: any) => {
      const { data, colDef, newValue } = params;
      const updatedPromises = promises.map((p) => {
        if (p.id === data.id) {
          const currentAmount = p.amount || 0;
          let updatedValue = newValue;

          if (colDef.field === "amount") {
            const maxAllowed = remainingShares + currentAmount;
            updatedValue = Math.min(Number(newValue) || 0, maxAllowed);
          }

          return { ...p, [colDef.field]: updatedValue };
        }
        return p;
      });
      onUpdate(updatedPromises);
    },
    [promises, remainingShares, onUpdate],
  );

  const getContextMenuItems = useCallback(
    (params: any) => {
      const menuItems = [];

      if (remainingShares > 0) {
        menuItems.push({
          name: "Add Beneficiary",
          action: handleAddBeneficiary,
          icon: '<span class="ag-icon ag-icon-plus"></span>',
        });
      }

      if (params.node) {
        menuItems.push({
          name: "Delete Beneficiary",
          action: () => handleDeleteBeneficiary(params.node.data.id),
          icon: '<span class="ag-icon ag-icon-minus"></span>',
        });
      }

      return menuItems;
    },
    [remainingShares, handleAddBeneficiary, handleDeleteBeneficiary],
  );

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "receiver",
        headerName: "Beneficiary",
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditor: "agSelectCellEditor",
        onCellValueChanged: (params) => {
          const { data, newValue } = params;
          const selectedFriend = all_friends.find(
            (friend) => friend.id === newValue,
          );

          if (selectedFriend) {
            const updatedPromises = promises.map((promise) => {
              if (promise.id === data.id) {
                return {
                  ...promise,
                  receiver: selectedFriend.id,
                };
              }
              return promise;
            });

            onUpdate(updatedPromises);
          }
        },

        cellEditorParams: (params: any) => ({
          values: all_friends
            .filter((friend) => {
              const currentPromise = promises.find(
                (p) => p.id === params?.data?.id,
              );
              return (
                !promises.some((p) => p.receiver === friend.id) ||
                currentPromise?.receiver === friend.id
              );
            })
            .map((friend) => friend.id),
        }),
        valueFormatter: (params) => {
          const friend = all_friends.find((f) => f.id === params.value);
          return friend ? friend.name : "Select Beneficiary";
        },
        flex: 2,
        cellStyle: {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background.paper,
        },
      },
      {
        onCellValueChanged: (params) => {
          const oldValue = params.oldValue || 0;
          const newValue = params.newValue || 0;
          const difference = oldValue - newValue;

          setRemainingShares((prevRemaining) => prevRemaining + difference);

          handleCellValueChanged(params);
        },

        field: "amount",
        headerName: "Share %",
        editable: true,
        valueParser: (params) => Number(params.newValue),
        cellStyle: {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background.paper,
        },
        cellEditorParams: (params: any) => ({
          min: 0,
          max: remainingShares + (params?.data?.amount || 0),
        }),
        flex: 1,
      },
    ],
    [all_friends, promises, remainingShares, theme.palette],
  );

  const gridTheme = useMemo(
    () =>
      ({
        "--ag-background-color": theme.palette.background.paper,
        "--ag-foreground-color": theme.palette.text.primary,
        "--ag-border-color": theme.palette.divider,
        "--ag-header-background-color": theme.palette.background.default,
        "--ag-odd-row-background-color": alpha(theme.palette.action.hover, 0.1),
        "--ag-row-hover-color": alpha(theme.palette.action.hover, 0.2),
        "--ag-selected-row-background-color": alpha(
          theme.palette.primary.main,
          0.1,
        ),
        "--ag-header-column-separator-color": theme.palette.divider,
        "--ag-cell-horizontal-border": `1px solid ${theme.palette.divider}`,
        "--ag-input-focus-border-color": theme.palette.primary.main,
        "--ag-input-disabled-background-color": alpha(
          theme.palette.action.disabled,
          0.1,
        ),
        "--ag-invalid-color": theme.palette.error.main,
        "--ag-alpine-active-color": theme.palette.primary.main,
      }) as React.CSSProperties,
    [theme.palette],
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <AccountCircleIcon sx={{ color: theme.palette.text.secondary }} />
          <Typography variant="subtitle1">Beneficiaries</Typography>
          <Typography
            variant="caption"
            sx={{
              bgcolor: alpha(theme.palette.action.hover, 0.1),
              px: 1,
              py: 0.5,
              borderRadius: 1,
              color: theme.palette.text.secondary,
            }}
          >
            Remaining: {remainingShares}%
          </Typography>
        </Stack>
      </Box>

      <Box
        sx={{
          height: 400,
          width: "100%",
          "& .ag-theme-material": {
            ...gridTheme,
          },
          "& .ag-header-cell": {
            backgroundColor: theme.palette.background.default,
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
          "& .ag-cell": {
            borderRight: `1px solid ${theme.palette.divider}`,
          },
          "& .ag-cell-focus": {
            borderColor: `${theme.palette.primary.main} !important`,
          },
          "& .ag-menu": {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            border: `1px solid ${theme.palette.divider}`,
          },
          "& .ag-menu-option:hover": {
            backgroundColor: alpha(theme.palette.action.hover, 0.1),
          },
        }}
      >
        <AgGridDataGrid
          rows={promises}
          columns={columnDefs}
          getContextMenuItems={getContextMenuItems}
          onCellValueChanged={handleCellValueChanged}
          className="ag-theme-material"
          rowSelection="single"
          animateRows={true}
          suppressMovableColumns={true}
          suppressRowClickSelection={true}
          defaultColDef={{
            sortable: true,
            resizable: true,
            suppressMovable: true,
          }}
        />
      </Box>
    </Box>
  );
};

export default BeneficiariesTable;
