import * as React from "react";
import {useDispatch} from "react-redux";
import LoaderButton from "../../../components/MuiComponents/LoaderButton";
import { handleRedux } from "../../../redux/store/handleRedux";
// import {actor} from "../../../App";
import {MonetizationOn} from "@mui/icons-material";

function Deposit(props: any) {
    const dispatch = useDispatch();

    async function handleDeposit() {
        let res = actor && await actor.deposit_usdt(Number(100));
        dispatch(handleRedux("UPDATE_BALANCE", {balance: res.Ok}));
        if ("Ok" in res) {
            dispatch(handleRedux("UPDATE_BALANCE", {balance: res.Ok}));
        }
        return res
    }

    return (<LoaderButton
            variant="outlined"
            startIcon={<MonetizationOn/>}
            onClick={handleDeposit}
        >Deposit</LoaderButton>
    )
}

export default Deposit;
