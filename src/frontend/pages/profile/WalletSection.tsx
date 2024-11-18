import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, Card, CardContent, Divider, Typography } from "@mui/material";
import Deposit from "./actions/Deposit";
import Withdraw from "./actions/Withdraw";
import InternalTransaction from "./actions/internlTransaction";
import { useBackendContext } from "../../contexts/BackendContext";
import { Principal } from "@dfinity/principal";
import { Account } from "../../../declarations/cketh_ledger/cketh_ledger.did";
import {
  Allowance,
  AllowanceArgs,
  ApproveArgs,
  ApproveResult,
  GetArchivesArgs,
  GetTransactionsRequest,
  Subaccount,
  Timestamp,
  Tokens,
  TransferArg,
  TransferFromArgs,
  TransferFromResult,
  TransferResult,
  TxIndex,
} from "../../../declarations/ckusdc_ledger/ckusdc_ledger.did";

const WalletSection: React.FC = () => {
  const { backendActor, ckUSDCActor } = useBackendContext();
  const { wallet, profile } = useSelector((state: any) => state.filesState);
  useEffect(() => {
    (async () => {
      const res = await backendActor.deposit_ckusdt();
      console.log({ res });
    })();
  }, []);
  return (
    <Card
      style={{
        borderRadius: 8,
        boxShadow: "0 0 3px rgba(0,0,0,0.2)",
        overflow: "hidden",
      }}
    >
      <CardContent>
        <Typography variant="h5" align="center" gutterBottom>
          Wallet
        </Typography>
        <Divider style={{ margin: "16px 0" }} />
        <Typography variant="h6" align="center">
          {wallet.balance || 0} ckUSDC
        </Typography>
        <Divider style={{ margin: "16px 0" }} />
        <Box style={{ display: "flex", justifyContent: "space-around" }}>
          <Deposit />
          <Withdraw />
          <InternalTransaction />
        </Box>
      </CardContent>
    </Card>
  );
};

export default WalletSection;
