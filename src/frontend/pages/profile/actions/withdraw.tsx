import * as React from "react";
import { handleRedux } from "../../../redux/store/handleRedux";
import {useDispatch} from "react-redux";
import LoaderButton from "../../../components/MuiComponents/LoaderButton";
import { useBackendContext } from "../../../contexts/BackendContext";
import {AccountBalanceWallet} from "@mui/icons-material";

function Withdraw(props: any) {
    const { backendActor } = useBackendContext();
    const dispatch = useDispatch();

    async function handleWithdraw() {
        let res = await backendActor.withdraw_usdt(Number(100));
        if ("Ok" in res) {
            dispatch(handleRedux("UPDATE_BALANCE", {balance: res.Ok}));
        }
        return res
    }

    return (<LoaderButton
        variant="outlined"
        startIcon={<AccountBalanceWallet/>}
        onClick={handleWithdraw}
    >Withdraw</LoaderButton>)
}

export default Withdraw;
