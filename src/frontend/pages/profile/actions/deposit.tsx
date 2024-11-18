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
  Typography,
} from "@mui/material";
import { useBackendContext } from "../../../contexts/BackendContext";
import {
  PayArgs,
  WithdrawBalanceArgs,
} from "../../../../declarations/backend/backend.did";
import { Principal } from "@dfinity/principal";
import { useSelector } from "react-redux";

function Content(props: any) {
  const [copy, setCopy] = React.useState(false);
  const { profile } = useSelector((state: any) => state.filesState);

  const copyAddress = async () => {
    navigator.clipboard.writeText(profile.id);
    setCopy(true);
    setTimeout(() => {
      setCopy(false);
    }, 2000);
  };

  return (
    <Card className="feature-card" sx={{ margin: 1 }}>
      <CardContent className="feature-card-content">
        <Typography variant="h6" component="div">
          Copy your wallet address to deposit ckusdc
        </Typography>
        <Button
          color={copy ? "success" : "primary"}
          onClick={copyAddress}
          variant="body2"
          className="feature-card-body"
        >
          {profile.id}
        </Button>

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

const Deposit = () => {
  // const handleDeposit = async () => {
  //   return { Ok: null };
  // };

  return (
    <AlertDialog content={<Content />}>
      <MonetizationOn /> Deposit
    </AlertDialog>
  );
};

export default Deposit;
