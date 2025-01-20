// src/components/Shares/PaymentHistory.tsx
import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import {
  Payment as PaymentIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";
// import AgGridDataGrid from '../../MuiComponents/dataGridSheet';
import { formatRelativeTime } from "../../utils/time";
import {
  User,
  CPayment as Payment,
} from "../../../declarations/backend/backend.did";
import AgGridDataGrid from "../../components/MuiComponents/dataGridSheet";
import { useSelector } from "react-redux";

interface PaymentHistoryProps {
  payments: Payment[];
  canMakePayment: boolean;
  isBeneficiary: boolean;
  remainingShares: number;
  all_friends: User[];
  onMakePayment: () => void;
}

export const PaymentHistory: React.FC<PaymentHistoryProps> = ({
  payments,
  isBeneficiary,
  remainingShares,
  onMakePayment,
}) => {
  const { profile ,all_friends} = useSelector((state: any) => state.filesState);
  const paymentsColumnDefs = [
    {
      editable: false,
      field: "date_created",
      headerName: "Date",
      valueFormatter: (params) => formatRelativeTime(params.value),
      flex: 1,
    },
    {
      editable: false,
      field: "sender",
      headerName: "From",
      valueFormatter: (params) =>
        [profile, ...all_friends].find((f) => f.id === params.value)?.name ||
        params.value,
      flex: 1,
    },
    {
      editable: false,
      field: "receiver",
      headerName: "To",
      valueFormatter: (params) =>
        all_friends.find((f) => f.id === params.value)?.name || params.value,
      flex: 1,
    },
    {
      editable: false,
      field: "amount",
      headerName: "Amount",
      valueFormatter: (params) => params.value.toLocaleString(),
      flex: 1,
    },
    // {
    //   editable: false,
    //   field: "status",
    //   headerName: "Status",
    //   flex: 1,
    //   valueGetter: (params) => {
    //     const statusKey = Object.keys(params.data.status)[0];
    //     return statusKey;
    //   },
    // },
  ];
  const canMakePayment = !isBeneficiary && remainingShares === 0;
  return (
    <Box key={remainingShares}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <AssessmentIcon />
          <Typography variant="h6">Payment History</Typography>
        </Stack>
        {canMakePayment && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<PaymentIcon />}
            onClick={onMakePayment}
          >
            Make Payment
          </Button>
        )}
      </Box>
      <Box sx={{ height: 400, position: "relative" }}>
        <AgGridDataGrid
          key={payments}
          rows={payments}
          columns={paymentsColumnDefs}
          context={{ all_friends }}
        />
        {!canMakePayment && !isBeneficiary && remainingShares > 0 && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <PaymentIcon sx={{ fontSize: 16 }} />
            Payments enabled when all shares are allocated
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default PaymentHistory;
