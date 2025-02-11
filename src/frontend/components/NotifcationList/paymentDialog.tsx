import React, { useState, useMemo } from "react";
import { useBackendContext } from "../../contexts/BackendContext";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { formatRelativeTime } from "../../utils/time";
import { styled } from "@mui/material/styles";
import { useSnackbar } from "notistack";

const StyledDetailGrid = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledLabel = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.palette.text.secondary,
}));

const StyledValue = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

const ActionSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const PaymentDialog = ({ payment, onClose }) => {
  const [selectedAction, setSelectedAction] = useState("");
  const [objectionReason, setObjectionReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { backendActor } = useBackendContext();
  const { profile, all_friends } = useSelector((state) => state.filesState);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const paymentStatus = Object.keys(payment.status)[0];

  const { sender, receiver } = useMemo(() => {
    const senderData = all_friends.find(
      (f) => f.id === payment.sender.toText()
    );
    const receiverData = all_friends.find(
      (f) => f.id === payment.receiver.toText()
    );

    return {
      sender: {
        ...senderData,
        name: senderData?.id === profile.id ? "You" : senderData?.name || "Unknown",
      },
      receiver: {
        ...receiverData,
        name: receiverData?.id === profile.id ? "You" : receiverData?.name || "Unknown",
      },
    };
  }, [all_friends, payment, profile.id]);

  const flags = useMemo(
    () => ({
      isReleased: paymentStatus === "Released",
      isSender: payment.sender.toText() === profile?.id,
      isReceiver: payment.receiver.toText() === profile?.id,
      isRequestingCancellation: paymentStatus === "RequestCancellation",
      isHighPromise: paymentStatus === "HighPromise",
      isConfirmed: paymentStatus === "Confirmed",
      canClaimPayment: paymentStatus !== "Confirmed" && paymentStatus !== "Released",
    }),
    [payment, profile?.id, paymentStatus]
  );

  const handleAction = async (actionFn, ...args) => {
    setIsLoading(true);
    try {
      const result = await actionFn(...args);
      if ("Ok" in result) {
        onClose();
      } else {
        enqueueSnackbar(result.Err, { variant: "error" });
      }
    } catch (error) {
      console.error("Error performing action:", error);
      enqueueSnackbar("An error occurred while processing your request", {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleObjection = () => {
    if (!objectionReason.trim()) return;
    handleAction(backendActor.object_on_cancel, payment, objectionReason).then(() => {
      payment.status = { Objected: objectionReason };
    });
  };

  const handleApproveHighPromise = () => {
    handleAction(backendActor.approve_high_promise, payment).then(() => {
      payment.status = { ApproveHighPromise: null };
    });
  };

  const handleConfirmCPayment = () => {
    handleAction(backendActor.confirmed_c_payment, payment).then(() => {
      payment.status = { Confirmed: null };
    });
  };

  const handleConfirmCancellation = () => {
    handleAction(backendActor.confirmed_cancellation, payment).then(() => {
      payment.status = { ConfirmedCancellation: null };
    });
  };

  const handleViewContract = () => {
    if (payment.contract_id) {
      navigate(`/contract?id=${payment.contract_id}`);
      onClose();
    }
  };

  const getAvailableActions = () => {
    if (flags.isReleased || flags.isSender) return [];

    const actions = [];
    if (flags.isReceiver) {
      actions.push({ value: "object", label: "Object to Payment" });
      if (flags.canClaimPayment) {
        actions.push({ value: "claim", label: "Claim Payment" });
      }
      if (flags.isRequestingCancellation) {
        actions.push({ value: "cancel", label: "Confirm Cancellation" });
      }
      if (flags.isHighPromise) {
        actions.push({ value: "escrow", label: "Claim Escrow" });
      }
    }
    return actions;
  };

  const handleSubmitAction = () => {
    switch (selectedAction) {
      case "object":
        handleObjection();
        break;
      case "claim":
        handleConfirmCPayment();
        break;
      case "cancel":
        handleConfirmCancellation();
        break;
      case "escrow":
        handleApproveHighPromise();
        break;
      default:
        break;
    }
  };

  const renderPaymentDetails = () => (
    <Box sx={{ mb: 3 }}>
      <StyledDetailGrid container spacing={2}>
        <Grid item xs={4}>
          <StyledLabel>Amount</StyledLabel>
        </Grid>
        <Grid item xs={8}>
          <StyledValue>{payment.amount}</StyledValue>
        </Grid>
      </StyledDetailGrid>

      <StyledDetailGrid container spacing={2}>
        <Grid item xs={4}>
          <StyledLabel>Sender</StyledLabel>
        </Grid>
        <Grid item xs={8}>
          <StyledValue>{sender.name}</StyledValue>
        </Grid>
      </StyledDetailGrid>

      <StyledDetailGrid container spacing={2}>
        <Grid item xs={4}>
          <StyledLabel>Receiver</StyledLabel>
        </Grid>
        <Grid item xs={8}>
          <StyledValue>{receiver.name}</StyledValue>
        </Grid>
      </StyledDetailGrid>

      <StyledDetailGrid container spacing={2}>
        <Grid item xs={4}>
          <StyledLabel>Status</StyledLabel>
        </Grid>
        <Grid item xs={8}>
          <StyledValue>{paymentStatus}</StyledValue>
        </Grid>
      </StyledDetailGrid>

      <StyledDetailGrid container spacing={2}>
        <Grid item xs={4}>
          <StyledLabel>Created</StyledLabel>
        </Grid>
        <Grid item xs={8}>
          <StyledValue>{formatRelativeTime(payment.date_created)}</StyledValue>
        </Grid>
      </StyledDetailGrid>

      {payment.contract_id && (
        <>
          <StyledDetailGrid container spacing={2}>
            <Grid item xs={4}>
              <StyledLabel>Contract ID</StyledLabel>
            </Grid>
            <Grid item xs={8}>
              <StyledValue sx={{ wordBreak: "break-all" }}>
                {payment.contract_id}
              </StyledValue>
            </Grid>
          </StyledDetailGrid>
          {flags.isSender && (
            <Button
              variant="outlined"
              color="primary"
              onClick={handleViewContract}
              fullWidth
              sx={{ mt: 2 }}
            >
              Show Full Contract
            </Button>
          )}
        </>
      )}
    </Box>
  );

  const renderActionSection = () => {
    const availableActions = getAvailableActions();
    if (availableActions.length === 0) return null;

    return (
      <ActionSection elevation={0} variant="outlined">
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select Action</InputLabel>
          <Select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            label="Select Action"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {availableActions.map((action) => (
              <MenuItem key={action.value} value={action.value}>
                {action.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedAction === "object" && (
          <TextField
            fullWidth
            label="Objection Reason"
            multiline
            rows={2}
            value={objectionReason}
            onChange={(e) => setObjectionReason(e.target.value)}
            disabled={isLoading}
            sx={{ mb: 2 }}
          />
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmitAction}
          disabled={isLoading || (selectedAction === "object" && !objectionReason.trim()) || !selectedAction}
          fullWidth
        >
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            `Submit ${availableActions.find(a => a.value === selectedAction)?.label || 'Action'}`
          )}
        </Button>
      </ActionSection>
    );
  };

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 3,
      }}
    >
      <DialogTitle>Payment Details</DialogTitle>
      <DialogContent>
        {renderPaymentDetails()}
        {renderActionSection()}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
