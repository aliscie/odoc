import * as React from "react";
import {handleRedux} from "../../../redux/main";
import {useDispatch} from "react-redux";
import LoaderButton from "../../../components/genral/loader_button";
import {actor} from "../../../App";

function Withdraw(props: any) {
    const dispatch = useDispatch();

    async function handleWithdraw() {
        let res = await actor.withdraw_usdt(100);
        if ("Ok" in res) {
            dispatch(handleRedux("UPDATE_BALANCE", {balance: res.Ok}));
        }
        return res
    }

    return (<LoaderButton
        onClick={handleWithdraw}
    >Withdraw</LoaderButton>)
}

export default Withdraw;