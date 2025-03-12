import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useBackendContext } from "../../contexts/BackendContext";
import { useSnackbar } from "notistack";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  AccountBalanceWallet,
  ArrowDownward,
  ArrowUpward,
  Close,
  ContentCopy,
  Send,
} from "@mui/icons-material";
import { formatRelativeTime } from "../../utils/time";
import Link from "@mui/material/Link";

const defaultWallet = {
  owner: "0x0000000000000000000000000000000000000000",
  balance: 0,
  debts: {},
  total_debt: 0,
  exchanges: [],
  received: 0,
  spent: 0,
};

const WalletPage = ({ wallet = defaultWallet }) => {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [openDialog, setOpenDialog] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { backendActor } = useBackendContext();
  const { all_friends } = useSelector((state: any) => state.filesState);
  const { enqueueSnackbar } = useSnackbar();

  const handleClose = () => setOpenDialog("");

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(wallet?.owner || "");
    // You might want to use MUI's Snackbar here instead of alert
    alert("Address copied to clipboard!");
  };

  const handleTransaction = async (type) => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setIsProcessing(true);
    try {
      let result;
      if (type === "pay" && recipient) {
        result = await backendActor.internal_transaction(
          parseFloat(amount),
          recipient,
          { LocalSend: null },
        );
      } else if (type === "withdraw" && withdrawAddress) {
        // Call withdraw_ckusdt for withdrawals
        result = await backendActor.withdraw_ckusdt(
          Number(amount), // Convert to u64
          withdrawAddress,
        );
      }
      // console.log({result})

      if ("Ok" in result) {
        enqueueSnackbar("Transaction completed successfully", {
          variant: "success",
        });
        handleClose();
        setAmount("");
        setWithdrawAddress("");
        setRecipient("");
      } else if ("Err" in result) {
        enqueueSnackbar(JSON.stringify(result.Err), { variant: "error" });
      }
    } catch (error) {
      console.error("Transaction failed:", error);
      enqueueSnackbar(error.message || "Transaction failed", {
        variant: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  const { profile } = useSelector((state: any) => state.filesState);
  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", p: 3 }}>
      {/* Balance Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Stack spacing={3}>
            <Box display="flex" alignItems="center" gap={1}>
              <AccountBalanceWallet />
              <Typography variant="h5">Your Wallet</Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography color="text.secondary">
                  Available Balance
                </Typography>
                <Typography variant="h3" component="div">
                  ${wallet.balance.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography color="text.secondary">Total Debts</Typography>
                <Typography variant="h4" color="error">
                  ${wallet.total_debt}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="text.secondary">Total Received</Typography>
                <Typography color="success.main" variant="h6">
                  ${wallet.received}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="text.secondary">Total Spent</Typography>
                <Typography color="error" variant="h6">
                  ${wallet.spent}
                </Typography>
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowDownward />}
          onClick={() => setOpenDialog("deposit")}
          fullWidth
        >
          Deposit
        </Button>
        <Button
          variant="outlined"
          startIcon={<ArrowUpward />}
          onClick={() => setOpenDialog("withdraw")}
          fullWidth
        >
          Withdraw
        </Button>
        <Button
          variant="outlined"
          startIcon={<Send />}
          onClick={() => setOpenDialog("pay")}
          fullWidth
        >
          Pay
        </Button>
      </Stack>

      {/* Transaction History */}
      <Paper>
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            Transaction History
          </Typography>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {wallet.exchanges.length > 0 ? (
              wallet.exchanges.map((exchange, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {formatRelativeTime(exchange.date_created)}
                  </TableCell>
                  <TableCell>
                    {exchange._type &&
                      (() => {
                        const type = Object.keys(exchange._type)[0];
                        switch (type) {
                          case "Withdraw":
                            return "Withdrawal";
                          case "Deposit":
                            return "Deposit";
                          case "LocalSend":
                            return "Local send";
                          case "LocalReceive":
                            return "Received";
                          default:
                            return type;
                        }
                      })()}
                  </TableCell>
                  <TableCell>
                    {exchange.from === profile?.id
                      ? "You"
                      : all_friends.find((f) => f.id === exchange.from)?.name ||
                        exchange.from}
                  </TableCell>
                  <TableCell>
                    {exchange.to === profile?.id
                      ? "You"
                      : all_friends.find((f) => f.id === exchange.to)?.name ||
                        exchange.to}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color:
                        exchange._type &&
                        (Object.keys(exchange._type)[0] === "Deposit" ||
                          Object.keys(exchange._type)[0] === "LocalReceive")
                          ? "success.main"
                          : "error.main",
                    }}
                  >
                    ${Math.abs(exchange.amount).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="text.secondary">
                    No transactions yet
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Deposit Dialog */}
      <Dialog
        open={openDialog === "deposit"}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Deposit Funds
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box py={2}>
            <Typography variant="subtitle2" gutterBottom>
              Copy your address and go to{" "}
              <Link
                href="https://oisy.com/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  "&:hover": { color: "primary.dark" },
                }}
              >
                oisy.com
              </Link>{" "}
              to transfer CKUSDC to your wallet.
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={wallet.owner}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleCopyAddress}>
                      <ContentCopy />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Send your funds to this address. The balance will be updated
              automatically.
            </Typography>
          </Box>
          <Typography color={"error"}>
              Gas fees of Ethirum is 1$, if you send 1$ only it will be lost and
              your balance will stay 0$
            </Typography>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog
        open={openDialog === "withdraw"}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Withdraw Funds
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
            />
            <TextField
              label="Withdrawal Address"
              value={withdrawAddress}
              onChange={(e) => setWithdrawAddress(e.target.value)}
              fullWidth
            />
          </Stack>

          <Typography color={"error"}>
            Gas fees of Ethirum is 1$, if you send 1$ only it will be lost and
            your external wallet will get 0$
          </Typography>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            onClick={() => handleTransaction("withdraw")}
            variant="contained"
            disabled={isProcessing}
            startIcon={isProcessing ? <CircularProgress size={20} /> : null}
          >
            {isProcessing ? "Processing..." : "Confirm Withdrawal"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Pay Dialog */}
      <Dialog
        open={openDialog === "pay"}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Pay Someone
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Select
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              displayEmpty
              fullWidth
            >
              <MenuItem value="" disabled>
                Select recipient
              </MenuItem>
              {all_friends
                .filter((f) => f.id !== profile.id)
                .map((friend) => (
                  <MenuItem key={friend.id} value={friend.id}>
                    {friend.name} ({friend.id.slice(0, 8)}...)
                  </MenuItem>
                ))}
            </Select>
            <TextField
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            onClick={() => handleTransaction("pay")}
            variant="contained"
            disabled={isProcessing}
            startIcon={isProcessing ? <CircularProgress size={20} /> : null}
          >
            {isProcessing ? "Processing..." : "Send Payment"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WalletPage;
