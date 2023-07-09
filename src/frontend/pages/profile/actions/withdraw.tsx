import SwipeDownAltIcon from "@mui/icons-material/SwipeDownAlt";
import {Button} from "@mui/material";
import * as React from "react";
import {useState} from "react";
import {actor} from "../../../backend_connect/ic_agent";
import {useSnackbar} from "notistack";
import {handleRedux} from "../../../redux/main";
import {useDispatch} from "react-redux";
import LoaderButton from "../../../components/genral/loader_button";

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