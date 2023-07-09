import * as React from "react";
import {actor} from "../../../backend_connect/ic_agent";
import {useDispatch} from "react-redux";
import LoaderButton from "../../../components/genral/loader_button";
import {handleRedux} from "../../../redux/main";

function Deposit(props: any) {
    const dispatch = useDispatch();

    async function handleDeposit() {
        let res = await actor.deposit_usdt(100);
        dispatch(handleRedux("UPDATE_BALANCE", {balance: res.Ok}));
        if ("Ok" in res) {
            dispatch(handleRedux("UPDATE_BALANCE", {balance: res.Ok}));
        }
        return res
    }

    return (<LoaderButton
        onClick={handleDeposit}
    >Deposit</LoaderButton>)
}

export default Deposit;