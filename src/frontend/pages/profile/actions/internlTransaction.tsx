import { handleRedux } from "../../../redux/store/handleRedux";
import { useDispatch } from "react-redux";
import { useBackendContext } from "../../../contexts/BackendContext";
import { Result_3, User } from "../../../../declarations/backend/backend.did";
import React, { useRef, useState } from "react";
import PaymentsIcon from "@mui/icons-material/Payments";
import AlertDialog from "../../../components/MuiComponents/AlertDialog";
import { UserDropDown } from "../../../components/ContractTable/renders/userDropDown";
import useGetUser from "../../../utils/get_user_by_principal";
import { Input } from "@mui/material";
import { useSnackbar } from "notistack";

const InternalTransaction = () => {
  const { enqueueSnackbar } = useSnackbar();
  const amount = useRef<Number>();
  const [receiver, setReceiver] = useState({ name: "", id: "" });
  const { backendActor } = useBackendContext();
  const dispatch = useDispatch();

  const handlePayment = async () => {
    if (!backendActor) return;

    const res = (await backendActor.internal_transaction(
      amount.current,
      receiver.id,
    )) as Result_3;

    if ("Ok" in res) {
      enqueueSnackbar("Payment successes", {
        variant: "success",
      });
      // dispatch(handleRedux("UPDATE_BALANCE", { balance: res.Ok }));
    } else if ("Err" in res) {
      // console.error(`Withdraw failed: ${res.Err}`);
      enqueueSnackbar(res.Err, {
        variant: "error",
      });
    }

    return res;
  };

  let { getUserByName } = useGetUser();

  let row = { receiver: receiver.name };
  let onRowChange = (row, bool) => {
    const receiverName: string = row.receiver;
    const receiver: User | null = getUserByName(receiverName);
    setReceiver(receiver);
  };
  const Content = () => {
    return (
      <div>
        <div>
          <Input
            defaultValue={amount.current}
            type={"number"}
            onChange={(e) => {
              amount.current = Number(e.target.value);
            }}
          />
        </div>
        <div>Select a receiver: {UserDropDown({ row, onRowChange })}</div>
      </div>
    );
  };

  return (
    <AlertDialog
      submit={"send payment to " + receiver.name}
      handleSave={handlePayment}
      content={<Content />}
    >
      <PaymentsIcon /> Pay
    </AlertDialog>
  );
};

export default InternalTransaction;
