import { useSelector } from "react-redux";
import { MonetizationOn } from "@mui/icons-material";
import { useBackendContext } from "../../../contexts/BackendContext";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { Principal } from "@dfinity/principal";
import AlertDialog from "../../../components/MuiComponents/AlertDialog";
import React, { useEffect } from "react";
import Card from "../../../components/MuiComponents/Card";
import {
  Button,
  CardContent,
  CircularProgress,
  Fade,
  Typography,
} from "@mui/material";

function Content(props: any) {
  const { profile } = useSelector((state: any) => state.filesState);

  // const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { backendActor } = useBackendContext();
  const principal = Principal.fromText(profile.id);

  const [copy, setCopy] = React.useState(false);
  const [addrss, setAddrss] = React.useState(null);
  const copyAddress = async () => {
    navigator.clipboard.writeText(addrss);
    setCopy(true);
    setTimeout(() => {
      setCopy(false);
    }, 2000);
  };
  useEffect(() => {
    (async () => {
      const ethereum_address = await backendActor?.ethereum_address([
        principal,
      ]);
      setAddrss(ethereum_address);
    })();
  }, []);

  return (
    <Card className="feature-card" sx={{ margin: 1 }}>
      <CardContent className="feature-card-content">
        <Typography variant="h5" className="feature-card-title">
          Your USDC wallet address
        </Typography>
        {addrss ? (
          <Button
            color={copy ? "success" : "primary"}
            onClick={copyAddress}
            variant="body2"
            className="feature-card-body"
          >
            address
          </Button>
        ) : (
          <CircularProgress />
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
const Deposit = () => {
  const handleDeposit = async () => {
    return { Ok: null };
  };

  return (
    <AlertDialog handleSave={handleDeposit} content={<Content />}>
      <MonetizationOn /> Deposit
    </AlertDialog>
  );
};

export default Deposit;
