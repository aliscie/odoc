import { useSelector } from "react-redux";
import { MonetizationOn } from "@mui/icons-material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import AlertDialog from "../../../components/MuiComponents/AlertDialog";
import React from "react";
import Card from "../../../components/MuiComponents/Card";
import {
  Button,
  CardContent,
  CircularProgress,
  Fade,
  Input,
} from "@mui/material";
import { Account } from "../../../../declarations/cketh_ledger/cketh_ledger.did";
import { Principal } from "@dfinity/principal";
import {
  Allowance,
  AllowanceArgs,
  ApproveArgs,
  ApproveResult,
  TransferFromArgs,
  TransferFromResult,
} from "../../../../declarations/ckusdc_ledger/ckusdc_ledger.did";
import { useBackendContext } from "../../../contexts/BackendContext";
import LoaderButton from "../../../components/MuiComponents/LoaderButton";

function Content(props: any) {
  const { backendActor, ckUSDCActor } = useBackendContext();

  const { profile } = useSelector((state: any) => state.filesState);
  const [loading, setLoading] = React.useState(false);
  const [copy, setCopy] = React.useState(false);
  const [address, setAddress] = React.useState(null);
  const [amount, setAmount] = React.useState(10);
  const copyAddress = async () => {
    navigator.clipboard.writeText(address);
    setCopy(true);
    setTimeout(() => {
      setCopy(false);
    }, 2000);
  };

  async function makeWithdraw() {
    // setLoading(true);
    const res = await backendActor.withdraw_ckusdt(amount * 1000000, address);
    // console.log({res});
    // setLoading(false);
    return res;
  }

  return (
    <Card className="feature-card" sx={{ margin: 1 }}>
      <CardContent className="feature-card-content">
        <Input
          label="Amount"
          type="number"
          onChange={(e) => {
            setAmount(e.target.value);
            // setAddress(null);
          }}
        />
        <Input
          label="Withdraw address"
          type="text"
          onChange={(e) => {
            // setAmount(e.target.value);
            setAddress(e.target.value);
          }}
        />
        {address && amount && (
          <LoaderButton onClick={makeWithdraw}>withdraw</LoaderButton>
        )}

        <Fade in={copy}>
          <span>
            <DoneAllIcon color={"success"} />
            <span> You successfully copied the address</span>
          </span>
        </Fade>
      </CardContent>
    </Card>
  );
}

// async function withdraw(ckUSDCActor, address, amount) {
//   let ac: Account = {
//     owner: Principal.fromText(profile.id),
//     subaccount: [],
//   };
//   const odocID = Principal.fromText("lrcwp-yiaaa-aaaal-acwdq-cai");
//   const userId = Principal.fromText(profile.id);
//   const oisyId = Principal.fromText(address);
//   let balance = await ckUSDCActor.icrc1_balance_of(ac);
//
//   let OdocAcc: Account = {
//     owner: odocID,
//     subaccount: [],
//   };
//   let OdocBalance = await ckUSDCActor.icrc1_balance_of(OdocAcc);
//
//   const transfer_from: TransferFromArgs = {
//     to: {
//       owner: oisyId,
//       subaccount: [],
//     },
//     fee: [],
//     spender_subaccount: [],
//     from: {
//       owner: odocID,
//       subaccount: [],
//     },
//     memo: [],
//     created_at_time: [],
//     amount: BigInt(OdocBalance),
//   };
//
//   if (OdocBalance > 2000000) {
//     const allo: AllowanceArgs = {
//       account: {
//         owner: userId,
//         subaccount: [],
//       },
//       spender: {
//         owner: odocID,
//         subaccount: [],
//       },
//     };
//
//     const approve: ApproveArgs = {
//       fee: [],
//       memo: [],
//       from_subaccount: [],
//       created_at_time: [],
//       amount: BigInt(OdocBalance),
//       expected_allowance: [],
//       expires_at: [],
//       spender: {
//         owner: odocID,
//         subaccount: [],
//       },
//     };
//
//     let allow: Allowance = await ckUSDCActor.icrc2_allowance(allo);
//
//     if (allow.allowance < BigInt(OdocBalance)) {
//       let approve_res: ApproveResult = await ckUSDCActor.icrc2_approve(approve);
//       console.log({ approve_res });
//     }
//
//     let tr: TransferFromResult =
//       await ckUSDCActor.icrc2_transfer_from(transfer_from);
//     console.log({ tr, allow });
//   }
//
//   console.log({ OdocBalance, balance });
// }
const Withdraw = () => {
  const handleDeposit = async () => {
    return { Ok: null };
  };

  return (
    <AlertDialog handleSave={handleDeposit} content={<Content />}>
      <MonetizationOn /> Withdraw
    </AlertDialog>
  );
};

export default Withdraw;
