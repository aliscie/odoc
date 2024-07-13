import * as React from "react";
import {useDispatch} from "react-redux";
import LoaderButton from "../../../components/genral/loader_button";
import {handleRedux} from "../../../redux/main";
import {actor} from "../../../App";

function Deposit (props: any) {
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
        onClick={handleDeposit}
    >Deposit</LoaderButton>)
}

export default Deposit;