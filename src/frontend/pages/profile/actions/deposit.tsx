import {MonetizationOn} from "@mui/icons-material";
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
import {useBackendContext} from "../../../contexts/BackendContext";
import {PayArgs, WithdrawBalanceArgs} from "../../../../declarations/backend/backend.did";
import {Principal} from "@dfinity/principal";
import {useSelector} from "react-redux";

function Content(props: any) {
    const [loading, setLoading] = React.useState(false);
    const [copy, setCopy] = React.useState(false);
    const [address, setAddress] = React.useState(null);
    const [amount, setAmount] = React.useState(10);
    const {profile} = useSelector((state: any) => state.filesState);
    const {backendActor} = useBackendContext();

    const copyAddress = async () => {
        navigator.clipboard.writeText(address);
        setCopy(true);
        setTimeout(() => {
            setCopy(false);
        }, 2000);
    };

    async function requestDepositAddress() {
        // const payment: PayArgs = {
        //     token: Principal.fromText("xevnm-gaaaa-aaaar-qafnq-cai"),
        //     memo: BigInt(10),
        //     to_merchant: Principal.fromText(profile.id),
        //     amount: BigInt(10),
        // };
        //
        // const res = await backendActor?.pay(payment);
        // console.log({res});

        const withdraw: WithdrawBalanceArgs = {
            'to': Principal.fromText("bd3sg-teaaa-aaaaa-qaaba-cai"),
            'token': Principal.fromText("xevnm-gaaaa-aaaar-qafnq-cai"),
            'amount': BigInt(10),
        }
        const res = await backendActor?.withdraw_balance(withdraw);
        console.log({res});

        // if (!isLoading) {
        //   setLoading(true);
        //   const res = await pay(amount);
        //   setLoading(false);
        //   setAddress(res);
        // }
    }

    return (
        <Card className="feature-card" sx={{margin: 1}}>
            <CardContent className="feature-card-content">
                <Input
                    label="Amount"
                    type="number"
                    onChange={(e) => {
                        setAmount(e.target.value);
                        setAddress(null);
                    }}
                />
                {!address && (
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={requestDepositAddress}
                        className="feature-card-body"
                    >
                        Request usdc deposit address
                    </Button>
                )}
                {loading ? (
                    <CircularProgress/>
                ) : (
                    <Button
                        color={copy ? "success" : "primary"}
                        onClick={copyAddress}
                        variant="body2"
                        className="feature-card-body"
                    >
                        {address}
                    </Button>
                )}

                <Fade in={copy}>
          <span>
            <DoneAllIcon color={"success"}/>
            <span> You successfully copied the address</span>
          </span>
                </Fade>
            </CardContent>
        </Card>
    );
}

const Deposit = () => {
    const handleDeposit = async () => {
        return {Ok: null};
    };

    return (
        <AlertDialog handleSave={handleDeposit} content={<Content/>}>
            <MonetizationOn/> Deposit
        </AlertDialog>
    );
};

export default Deposit;
