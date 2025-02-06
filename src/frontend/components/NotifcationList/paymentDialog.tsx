import React, { useState } from "react";
import { useBackendContext } from "../../contexts/BackendContext";
import { useSelector } from "react-redux";
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
  Tabs,
  Tab,
} from "@mui/material";
import { formatRelativeTime } from "../../utils/time";
import { styled } from "@mui/material/styles";

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

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`action-tabpanel-${index}`}
    aria-labelledby={`action-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
  </div>
);

const PaymentDialog = ({ payment, onClose, onAction }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [objectionReason, setObjectionReason] = useState("");
  const [changeAmount, setChangeAmount] = useState("");
  const [changeAmountReason, setChangeAmountReason] = useState("");
  const [releaseReason, setReleaseReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { backendActor } = useBackendContext();
  const { all_friends } = useSelector((state) => state.filesState);

  const sender = all_friends.find(f => f.id === payment.sender.toText());
  const receiver = all_friends.find(f => f.id === payment.receiver.toText());
  const isReleased = Object.keys(payment.status)[0] === "Released";

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleObjection = async () => {
    if (!objectionReason.trim()) return;
    setIsLoading(true);
    try {
      const result = await backendActor.object_on_cancel(payment, objectionReason);
      if ('Ok' in result) {
        onClose();
      } else {
        console.error('Action failed:', result.Err);
      }
    } catch (error) {
      console.error('Error performing objection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeAmount = async () => {
    if (!changeAmount.trim() || isNaN(changeAmount) || !changeAmountReason.trim()) return;
    setIsLoading(true);
    try {
      const result = await backendActor.request_amount_change(
        payment,
        parseFloat(changeAmount),
        changeAmountReason
      );
      if ('Ok' in result) {
        onClose();
      } else {
        console.error('Action failed:', result.Err);
      }
    } catch (error) {
      console.error('Error performing amount change:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRelease = async () => {
    if (!releaseReason.trim()) return;
    setIsLoading(true);
    try {
      const result = await backendActor.request_release(payment, releaseReason);
      if ('Ok' in result) {
        onClose();
      } else {
        console.error('Action failed:', result.Err);
      }
    } catch (error) {
      console.error('Error performing release:', error);
    } finally {
      setIsLoading(false);
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
          <StyledValue>{sender?.name || 'Unknown'}</StyledValue>
        </Grid>
      </StyledDetailGrid>

      <StyledDetailGrid container spacing={2}>
        <Grid item xs={4}>
          <StyledLabel>Receiver</StyledLabel>
        </Grid>
        <Grid item xs={8}>
          <StyledValue>{receiver?.name || 'Unknown'}</StyledValue>
        </Grid>
      </StyledDetailGrid>

      <StyledDetailGrid container spacing={2}>
        <Grid item xs={4}>
          <StyledLabel>Status</StyledLabel>
        </Grid>
        <Grid item xs={8}>
          <StyledValue>{Object.keys(payment.status)[0]}</StyledValue>
        </Grid>
      </StyledDetailGrid>

      <StyledDetailGrid container spacing={2}>
        <Grid item xs={4}>
          <StyledLabel>Created</StyledLabel>
        </Grid>
        <Grid item xs={8}>
          <StyledValue>
            {formatRelativeTime(payment.date_created)}
          </StyledValue>
        </Grid>
      </StyledDetailGrid>

      <StyledDetailGrid container spacing={2}>
        <Grid item xs={4}>
          <StyledLabel>Contract ID</StyledLabel>
        </Grid>
        <Grid item xs={8}>
          <StyledValue sx={{ wordBreak: 'break-all' }}>{payment.contract_id}</StyledValue>
        </Grid>
      </StyledDetailGrid>
    </Box>
  );

  const renderActionTabs = () => {
    if (isReleased) return null;

    return (
      <>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Object" />
          <Tab label="Change Amount" />
          <Tab label="Release" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <ActionSection elevation={0} variant="outlined">
            <Typography variant="h6" gutterBottom>
              Object to Payment
            </Typography>
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
            <Button
              variant="contained"
              color="primary"
              onClick={handleObjection}
              disabled={isLoading || !objectionReason.trim()}
            >
              {isLoading ? 'Processing...' : 'Submit Objection'}
            </Button>
          </ActionSection>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <ActionSection elevation={0} variant="outlined">
            <Typography variant="h6" gutterBottom>
              Request Amount Change
            </Typography>
            <TextField
              fullWidth
              label="New Amount"
              type="number"
              value={changeAmount}
              onChange={(e) => setChangeAmount(e.target.value)}
              disabled={isLoading}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Reason for Change"
              multiline
              rows={2}
              value={changeAmountReason}
              onChange={(e) => setChangeAmountReason(e.target.value)}
              disabled={isLoading}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleChangeAmount}
              disabled={isLoading || !changeAmount.trim() || !changeAmountReason.trim()}
            >
              {isLoading ? 'Processing...' : 'Submit Amount Change'}
            </Button>
          </ActionSection>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <ActionSection elevation={0} variant="outlined">
            <Typography variant="h6" gutterBottom>
              Request Release
            </Typography>
            <TextField
              fullWidth
              label="Release Reason"
              multiline
              rows={2}
              value={releaseReason}
              onChange={(e) => setReleaseReason(e.target.value)}
              disabled={isLoading}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleRelease}
              disabled={isLoading || !releaseReason.trim()}
            >
              {isLoading ? 'Processing...' : 'Submit Release Request'}
            </Button>
          </ActionSection>
        </TabPanel>
      </>
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
        {renderActionTabs()}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
