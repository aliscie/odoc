import { handleRedux } from "../../../redux/store/handleRedux";
import {useDispatch} from "react-redux";
import LoaderButton from "../../../components/MuiComponents/LoaderButton";
import { useBackendContext } from "../../../contexts/BackendContext";
import {AccountBalanceWallet} from "@mui/icons-material";
import { Result_3 } from "../../../../declarations/backend/backend.did";

const Withdraw = (props: any) => {
    const { backendActor } = useBackendContext();
    const dispatch = useDispatch();


    const handleWithdraw = async () => {
        if (!backendActor) return;

        const res = await backendActor.withdraw_usdt(100) as Result_3; // Result_3 represent the return type of the function

        if ("Ok" in res) {
            dispatch(handleRedux("UPDATE_BALANCE", { balance: res.Ok }));
        } else if ("Err" in res) {
            console.error(`Withdraw failed: ${res.Err}`);
        }

        return res;
    }

    return (<LoaderButton
        variant="outlined"
        startIcon={<AccountBalanceWallet/>}
        onClick={handleWithdraw}
    >Withdraw</LoaderButton>)
}

export default Withdraw;
