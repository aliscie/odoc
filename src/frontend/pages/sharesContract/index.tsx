import React, { useEffect, useState, useMemo } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
} from "@mui/material";
import { randomString } from "../../DataProcessing/dataSamples";
import {
  CustomContract,
  User,
  CPayment,
} from "../../../declarations/backend/backend.did";
import { PaymentHistory } from "./PaymentHistory";
import { PaymentDialog } from "./PaymentDialog";
import { BeneficiariesTable } from "./AddBeneficiaryDialog";
import { useSelector } from "react-redux";
import { Principal } from "@dfinity/principal";

type ViewType = "beneficiaries" | "payments";

interface SharesProps {
  contract?: CustomContract;
  profile?: User;
  onUpdateShares?: (shares: BeneficiaryShare[]) => void;
  onMakePayment?: (amount: number) => Promise<void>;
  onContractChange?: (contract: CustomContract) => void;
  allFriends?: User[];
}

interface BeneficiaryShare {
  id: string;
  userId: string;
  share: number;
  date_created: number;
}

export const Shares: React.FC<SharesProps> = ({
  contract = {
    id: "",
    permissions: [],
    creator: "",
    date_created: 0,
    payments: [],
    name: "",
    formulas: [],
    contracts: [],
    date_updated: 0,
    promises: [],
  },
  profile,
  onUpdateShares,
  onMakePayment,
  onContractChange,
  allFriends = [],
}) => {
  const theme = useTheme();
  const [currentView, setCurrentView] = useState<ViewType>("beneficiaries");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentDialog, setPaymentDialog] = useState({
    open: false,
    amount: 0,
  });

  // Memoized calculations
  const { totalShares, remainingShares, isCreator, isBeneficiary } =
    useMemo(() => {
      const totalShares = contract.promises.reduce(
        (sum, promise) => sum + promise.amount,
        0,
      );
      const remainingShares = 100 - totalShares;
      const isCreator =
        profile?.id && contract?.creator
          ? profile.id === contract.creator
          : false;
      const isBeneficiary = profile?.id
        ? contract.promises.some((promise) => promise.receiver === profile.id)
        : false;

      return {
        totalShares,
        remainingShares,
        isCreator,
        isBeneficiary,
      };
    }, [contract.promises, contract.creator, profile?.id]);

  const handlePaymentDialogOpen = () => {
    setPaymentDialog({ open: true, amount: 0 });
  };
  const handlePaymentDialogClose = () =>
    setPaymentDialog({ open: false, amount: 0 });

  const handlePayment = async () => {
    if (!onMakePayment || paymentDialog.amount <= 0) return;

    setLoading(true);
    setError(null);

    try {
      const newPayments = contract.promises.map((promise) => ({
        id: randomString(),
        status: { "None": null },
        date_created: Date.now(),
        date_released: Date.now(),
        cells: [],
        contract_id: contract.id,
        sender: Principal.fromText(profile?.id),
        receiver: promise.receiver,
        amount: Number(
          (paymentDialog.amount * (promise.amount / 100)).toFixed(2),
        ),
      }));

      const updatedContract = {
        ...contract,
        payments: [...contract.payments, ...newPayments],
      };

      await onMakePayment(paymentDialog.amount);
      onContractChange?.(updatedContract);
      handlePaymentDialogClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to process payment",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBeneficiaries = (updatedPromises: CPayment[]) => {
    const updatedContract = {
      ...contract,
      promises: updatedPromises,
      date_updated: Date.now(),
    };
    onContractChange?.(updatedContract);
  };

  if (!contract) {
    return (
      <Box p={2}>
        <Typography color="text.secondary">
          No contract information available
        </Typography>
      </Box>
    );
  }
  console.log({ paymentDialog });

  return (
    <Box sx={{ width: "100%" }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>View</InputLabel>
              <Select
                value={currentView}
                onChange={(e) => setCurrentView(e.target.value as ViewType)}
                label="View"
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.divider,
                  },
                }}
              >
                <MenuItem value="beneficiaries">Beneficiaries</MenuItem>
                <MenuItem value="payments">Payment History</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {currentView === "beneficiaries" ? (
            <BeneficiariesTable
              key={contract.promises}
              remainingShares={remainingShares}
              promises={contract.promises}
              isCreator={isCreator}
              onUpdate={handleUpdateBeneficiaries}
            />
          ) : (
            <PaymentHistory
              payments={contract.payments}
              isBeneficiary={isBeneficiary}
              remainingShares={remainingShares}
              onMakePayment={handlePaymentDialogOpen}
            />
          )}
        </CardContent>
      </Card>

      <PaymentDialog
        open={paymentDialog?.open}
        amount={paymentDialog?.amount}
        loading={loading}
        promises={contract.promises}
        allFriends={allFriends}
        onClose={handlePaymentDialogClose}
        onChange={(amount) => setPaymentDialog((prev) => ({ ...prev, amount }))}
        onSubmit={handlePayment}
      />
    </Box>
  );
};

const mockProfile: User = {
  id: "user-1",
  name: "John Doe",
  description: "Test User",
  email: "john@example.com",
  photo: new Uint8Array(),
};

const mockFriends: User[] = [
  {
    id: "friend-1",
    name: "Alice Smith",
    description: "Friend 1",
    email: "alice@example.com",
    photo: new Uint8Array(),
  },
  {
    id: "friend-2",
    name: "Bob Johnson",
    description: "Friend 2",
    email: "bob@example.com",
    photo: new Uint8Array(),
  },
  {
    id: "friend-3",
    name: "Carol Williams",
    description: "Friend 3",
    email: "carol@example.com",
    photo: new Uint8Array(),
  },
];

const initialContract: CustomContract = {
  id: "contract-123",
  permissions: [],
  creator: "user-1",
  date_created: Date.now() - 604800000, // 1 week ago
  date_updated: Date.now() - 86400000, // 1 day ago
  payments: [],
  name: "Revenue Share Contract",
  formulas: [],
  contracts: [],
  promises: [],
};

export const DummyShares: React.FC = () => {
  const [contractData, setContractData] =
    useState<CustomContract>(initialContract);

  const handleUpdateShares = async (shares: any[]) => {
    console.log("Updating shares:", shares);
  };

  const handleMakePayment = async (amount: number): Promise<void> => {
    try {
      const newPayments = contractData.promises.map((promise) => ({
        id: crypto.randomUUID(),
        status: { "None": null },
        date_created: Date.now(),
        date_released: Date.now(),
        cells: [],
        contract_id: contractData.id,
        sender: profile?.id || "", // Use string ID instead of Principal
        receiver: promise.receiver,
        amount: Number((amount * (promise.amount / 100)).toFixed(2)),
      }));

      setContractData((prev) => ({
        ...prev,
        payments: [...prev.payments, ...newPayments],
        date_updated: Date.now(),
      }));

      console.log("Payment processed successfully");
    } catch (error) {
      console.error("Payment failed:", error);
      throw new Error("Payment processing failed");
    }
  };

  const handleContractChange = (updatedContract: CustomContract) => {
    // console.log("Contract updated:", updatedContract);
    setContractData(updatedContract);
  };
  const { all_friends, profile } = useSelector(
    (state: any) => state.filesState,
  );
  return (
    <Box sx={{ p: 2 }}>
      <Shares
        contract={contractData}
        profile={profile}
        allFriends={all_friends}
        onUpdateShares={handleUpdateShares}
        onMakePayment={handleMakePayment}
        onContractChange={handleContractChange}
      />
    </Box>
  );
};

export default DummyShares;
