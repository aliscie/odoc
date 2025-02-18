import AgGridDataGrid from "../MuiComponents/dataGridSheet";
import React, { useMemo } from "react";
import {
  NotificationPromiesContextMenu,
  transformPromisesDataAndColumns,
} from "./utils";
import { formatRelativeTime } from "../../utils/time";
import { PAYMENT_STATUSES } from "./index";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import { RowClassRules } from "ag-grid-community";
import { Box, Divider, Typography, useTheme } from "@mui/material";
import { getAvailableStatusOptions } from "./statusOptions";

function NotificationPromises() {
  const theme = useTheme();
  const { contracts, profile, all_friends } = useSelector(
    (state: any) => state.filesState,
  );

  const getPaymentColumnDefs = useMemo(
    () =>
      (isPromise = false) => [
        {
          rowDrag: true,
          field: "amount",
          headerName: "Amount",
          sortable: true,
          filter: "agNumberColumnFilter",
          editable: isPromise,
          valueFormatter: (params) => `${params.value.toLocaleString()}`,
          cellStyle: (params) => ({
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
          }),
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
          cellEditorParams: (params) => ({
            values: getAvailableStatusOptions(params.data, profile.id),
          }),
          cellStyle: (params) => ({
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
          }),
          valueSetter: (params) => {
            const newValue = params.newValue;
            if (newValue === "Objected") {
              const reason = window.prompt("Enter objection reason:");
              if (reason !== null) {
                params.data.status = { [newValue]: reason || "" };
                return true;
              }
              return false;
            } else {
              params.data.status = { [newValue]: PAYMENT_STATUSES[newValue] };
              return true;
            }
          },
        },
        {
          field: "date_created",
          headerName: "Date Created",
          valueFormatter: (params) => formatRelativeTime(params.value),
          sortable: true,
          filter: "agDateColumnFilter",
          editable: false,
          cellStyle: (params) => ({
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
          }),
        },
        {
          field: "sender",
          headerName: "Sender",
          valueFormatter: (params) => {
            if (profile.id === params.value.toString()) {
              return "You";
            }
            return (
              all_friends?.find((u) => u.id == params.value.toString())?.name ||
              "None"
            );
          },
          sortable: true,
          filter: true,
          editable: false,
          cellStyle: (params) => ({
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
          }),
        },
        {
          field: "receiver",
          tooltipValueGetter: (params) =>
            all_friends.length > 1
              ? "Double click here to select a receiver."
              : "Go to discover page to make new friends then select a receiver here.",
          headerName: "Receiver",
          valueFormatter: (params) => {
            if (profile.id === params.value.toString()) {
              return "You";
            }
            return (
              all_friends?.find((u) => u.id == params.value.toString())?.name ||
              "None"
            );
          },
          sortable: true,
          filter: true,
          editable: isPromise,
          cellEditor: "agSelectCellEditor",
          cellEditorParams: () => ({
            values: all_friends.map((u) => u.name),
          }),
          cellStyle: (params) => ({
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
          }),
          valueSetter: (params) => {
            const selectedName = params.newValue;
            const selectedUser = all_friends.find(
              (u) => u.name === selectedName,
            );
            if (selectedUser) {
              params.data.receiver = selectedUser.id;
              return true;
            }
            return false;
          },
        },
      ],
    [all_friends, theme.palette],
  );

  const { notifications } = useSelector(
    (state: RootState) => state.notificationState,
  );

  const promises = useMemo(() => {
    const result = [];
    notifications.forEach((n) => {
      if ("CPaymentContract" in n.content) {
        let p = n.content.CPaymentContract[0];
        if (Object.keys(p.status)[0] !== "Released") {
          result.push({ ...p, is_seen: n.is_seen });
        }
      }
    });
    return result;
  }, [notifications]);

  if (promises.length === 0) {
    return null;
  }

  const promisesData = transformPromisesDataAndColumns(
    promises,
    getPaymentColumnDefs(true),
    true,
  );

  const rowClassRules: RowClassRules = {
    "unseen-row": (params) => !params.data.is_seen,
    "high-amount": (params) => params.data.amount > 1000,
    "pending-status": (params) => {
      const status = Object.keys(params.data.status)[0];
      return status === "Pending";
    },
  };

  const gridStyle = {
    height: "500px",
    width: "100%",
    "& .unseen-row": {
      backgroundColor: theme.palette.action.hover,
    },
    "& .high-amount": {
      color: theme.palette.error.main,
    },
    "& .pending-status": {
      backgroundColor: theme.palette.warning.light,
      "&:hover": {
        backgroundColor: theme.palette.warning.main,
      },
    },
    "& .ag-header": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
    "& .ag-header-cell": {
      color: theme.palette.primary.contrastText,
    },
    "& .ag-row-hover": {
      backgroundColor: `${theme.palette.action.hover} !important`,
    },
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <Box sx={{ mb: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography
          variant="h6"
          sx={{
            py: 2,
            color: theme.palette.text.primary,
            fontWeight: "large",
          }}
        >
          Your promises notifications
        </Typography>
        <Typography
          variant="h6"
          sx={{
            py: 2,
            color: theme.palette.text.primary,
            fontWeight: "small",
          }}
        >
          Here you can watch the status of your promises till they are released
          or removed.
        </Typography>
      </Box>
      <AgGridDataGrid
        context={{ users: all_friends }}
        getContextMenuItems={NotificationPromiesContextMenu}
        noRowsOverlayComponent={() => (
          <Typography
            sx={{
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2rem" },
              color: theme.palette.text.secondary,
            }}
          >
            Right click here to add rows or columns.
          </Typography>
        )}
        rows={promisesData.rows}
        columns={promisesData.columns}
        rowClassRules={rowClassRules}
        sx={gridStyle}
        domLayout="autoHeight"
      />
      <Divider sx={{ my: 2 }} />
    </Box>
  );
}

export default NotificationPromises;
