import React from "react";
import { useDispatch } from "react-redux";
import LoaderButton from "../../../components/MuiComponents/LoaderButton";
import { handleRedux } from "../../../redux/store/handleRedux";
import { MonetizationOn } from "@mui/icons-material";
import { useBackendContext } from "../../../contexts/BackendContext";

function Deposit() {
    const { backendActor } = useBackendContext();
    const dispatch = useDispatch();

    const handleDeposit = async () => {
        if (!backendActor) return;

        const res = await backendActor.deposit_usdt(100);
        if (res?.Ok) {
            dispatch(handleRedux("UPDATE_BALANCE", { balance: res.Ok }));
        }
        return res;
    };

    return (
        <LoaderButton
            variant="outlined"
            startIcon={<MonetizationOn />}
            onClick={handleDeposit}
        >
            Deposit
        </LoaderButton>
    );
}

export default Deposit;
