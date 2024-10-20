import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import LoaderButton from "../../../components/MuiComponents/LoaderButton";
import { handleRedux } from "../../../redux/store/handleRedux";
import { MonetizationOn } from "@mui/icons-material";
import { useBackendContext } from "../../../contexts/BackendContext";
import { Result_3 } from "../../../../declarations/backend/backend.did";

const Deposit = () => {
  // const { profile } = useSelector((state: any) => state.filesState);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { backendActor } = useBackendContext();
  const dispatch = useDispatch();

  const address = await getSmartContractAddress({});

  const handleDeposit = async () => {
    if (!backendActor) return;

    const res = (await backendActor.deposit_usdt(100)) as Result_3; // Result_3 represent the return type of the function

    if ("Ok" in res) {
      dispatch(handleRedux("UPDATE_BALANCE", { balance: res.Ok }));
    } else if ("Err" in res) {
      enqueueSnackbar(res.Err, { variant: "error" });
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
};

export default Deposit;
