import { useSelector } from "react-redux";
import { MonetizationOn } from "@mui/icons-material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import AlertDialog from "../../../components/MuiComponents/AlertDialog";
import React from "react";
import Card from "../../../components/MuiComponents/Card";
import { CardContent, Fade, Input } from "@mui/material";
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
    const res = await backendActor.withdraw_ckusdt(amount * 1000000, address);
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
