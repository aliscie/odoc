import {useDispatch, useSelector} from "react-redux";
import { MonetizationOn } from "@mui/icons-material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import AlertDialog from "../../../components/MuiComponents/AlertDialog";
import React, { useState } from "react";
import Card from "../../../components/MuiComponents/Card";
import { CardContent, Fade, Input } from "@mui/material";
import { useBackendContext } from "../../../contexts/BackendContext";
import LoaderButton from "../../../components/MuiComponents/LoaderButton";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useSnackbar } from "notistack";
import {handleRedux} from "../../../redux/store/handleRedux";
function Content(props: any) {
  const { backendActor, ckUSDCActor } = useBackendContext();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [address, setAddress] = React.useState(null);
  const [amount, setAmount] = React.useState(0);
  const [isDone, setIsDone] = useState(false);
  const dispatch = useDispatch();
  async function makeWithdraw() {
    const res = await backendActor.withdraw_ckusdt(
      BigInt(amount),
      address,
    );
    if (res["Ok"]) {
      dispatch(handleRedux("SET_WALLET", { wallet: res["Ok"] }));
      setIsDone(true);
    } else {
      enqueueSnackbar(JSON.stringify(res), { variant: "error" });
    }

    console.log({ res });
    return res;
  }

  return (
    <Card className="feature-card" sx={{ margin: 1 }}>
      {isDone && <CheckCircleOutlineIcon size={"large"} color={"success"} />}
      {!isDone && (
        <CardContent className="feature-card-content">
          <Input
            label="Amount"
            type="number"
            placeholder="Amount"
            onChange={(e) => {
              setAmount(Number(e.target.value));
            }}
          />
          <Input
            label="ckUSDC Address"
            type="text"
            placeholder="ckUSDC Address"
            onChange={(e) => {
              setAddress(e.target.value);
            }}
          />
          {address && amount && (
            <LoaderButton onClick={makeWithdraw}>withdraw</LoaderButton>
          )}
        </CardContent>
      )}
    </Card>
  );
}
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
