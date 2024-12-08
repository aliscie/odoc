import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Card, CardContent, Divider, Typography } from "@mui/material";
import Deposit from "./actions/Deposit";
import Withdraw from "./actions/Withdraw";
import InternalTransaction from "./actions/internlTransaction";
import { useBackendContext } from "../../contexts/BackendContext";
import { Principal } from "@dfinity/principal";
import { canisterId } from "../../../declarations/backend";
import { handleRedux } from "../../redux/store/handleRedux";
import {
  Account,
  Allowance,
  AllowanceArgs,
  ApproveArgs,
  Subaccount,
  Timestamp,
} from "../../../declarations/ckusdc_ledger/ckusdc_ledger.did";
import LinearProgressWithLabel from "../../components/MuiComponents/linearProgress";

const WalletSection: React.FC = () => {
  console.log("WalletSection");
  const dispatch = useDispatch();
  const { backendActor, ckUSDCActor } = useBackendContext();
  const { wallet, profile } = useSelector((state: any) => state.filesState);

  const fetchFee = async () => await ckUSDCActor.icrc1_fee();

  const fetchBalance = async (account) =>
    await ckUSDCActor.icrc1_balance_of(account);

  const approveTransaction = async (balance, fee_value) => {
    const approveArg: ApproveArgs = {
      fee: [BigInt(fee_value)],
      memo: [],
      from_subaccount: [],
      created_at_time: [],
      amount: BigInt(Number(balance)),
      expected_allowance: [],
      expires_at: [],
      spender: {
        owner: Principal.fromText(canisterId),
        subaccount: [],
      },
    };

    return await ckUSDCActor.icrc2_approve(approveArg);
  };

  const depositCkusdt = async () => {
    const res = await backendActor.deposit_ckusdt();
    if (res && res["Ok"]) {
      dispatch(handleRedux("SET_WALLET", { wallet: res["Ok"] }));
    }
    return res;
  };
  const ref = useRef(false);
  const [depositing, setDeposintg] = useState(null);
  const [newDeposit, setNewDeposit] = useState(null);
  useEffect(() => {
    if (ref.current === false) {
      (async () => {
        const fee_value = await fetchFee();
        const account = {
          owner: Principal.fromText(profile.id),
          subaccount: [],
        };
        const backendAccount = {
          owner: Principal.fromText(canisterId),
          subaccount: [],
        };
        const balance = await fetchBalance(account);

        const backendBalance = await fetchBalance(backendAccount);
        console.log({ balance, backendBalance });
        if (balance > BigInt(1000000)) {
          setDeposintg(10);
          setNewDeposit(balance);
          // -------------------- icrc2_approve --------------------
          let approve = await approveTransaction(balance, fee_value);
          console.log({ approve, fee_value });
          // let subaccount : Subaccount = Principal.fromText(profile.id).toUint8Array();
          // -------------------- icrc2_allowance --------------------
          const allowance: AllowanceArgs = {
            account: {
              owner: Principal.fromText(profile.id),
              subaccount: [],
            },
            spender: {
              owner: Principal.fromText(canisterId),
              subaccount: [],
              // subaccount: [],
            },
          };
          setDeposintg(50);
          let allowance_res: Allowance =
            await ckUSDCActor?.icrc2_allowance(allowance);
          console.log({ allowance_res });
          setDeposintg(70);
          // -------------------- transfer from user to odoc wallet --------------------
          let deposit = await depositCkusdt();
          console.log({ deposit });
          setDeposintg(100);
          setDeposintg(null);
          setNewDeposit(null);
        }
      })();
    }
    ref.current = true;
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
        {newDeposit &&
          "You got new deposit of " + Number(newDeposit) / 1000000 + " ckUSDC"}
        {depositing && <LinearProgressWithLabel value={depositing} />}
        {!depositing && (
          <Typography variant="h6" align="center">
            {wallet.balance || 0} ckUSDC
          </Typography>
        )}
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
