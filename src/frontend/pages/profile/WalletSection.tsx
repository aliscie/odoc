import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Card, CardContent, Divider, Typography } from "@mui/material";
import Deposit from "./actions/Deposit";
import Withdraw from "./actions/Withdraw";
import InternalTransaction from "./actions/internlTransaction";
import { useBackendContext } from "../../contexts/BackendContext";
import {
  Account,
  ApproveArgs,
  Subaccount,
  Timestamp,
  Tokens,
} from "../../../declarations/cketh_ledger/cketh_ledger.did";
import { Principal } from "@dfinity/principal";
import { canisterId } from "../../../declarations/backend";
import { Wallet } from "../../../declarations/backend/backend.did";
import { handleRedux } from "../../redux/store/handleRedux";
// import { Nat } from "@dfinity/candid";

const WalletSection: React.FC = () => {
  const dispatch = useDispatch();
  const { backendActor, ckUSDCActor } = useBackendContext();
  const { wallet, profile } = useSelector((state: any) => state.filesState);
  useEffect(() => {
    (async () => {
      const account = {
        owner: Principal.fromText(profile.id),
        subaccount: [],
      };
      let balance: Tokens = await ckUSDCActor.icrc1_balance_of(account);
      if (balance > BigInt(1000000)) {
        // let b : number = Number(balance);
        const approveArg: ApproveArgs = {
          fee: [BigInt(10000)],
          memo: [],
          from_subaccount: [],
          created_at_time: [],
          amount: BigInt(balance),
          expected_allowance: [BigInt(balance)],
          expires_at: [],
          spender: {
            owner: Principal.fromText(canisterId),
            subaccount: [],
          },
        };
        const approve = await ckUSDCActor.icrc2_approve(approveArg);
        const transactions =
          await backendActor.check_external_transactions(100);
        const res: Wallet = await backendActor.deposit_ckusdt();
        res && dispatch(handleRedux("SET_WALLET", { wallet: res }));

        console.log({ approve, transactions, res, wallet });
      }
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
