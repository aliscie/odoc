import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { handleRedux } from "../../redux/store/handleRedux";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";
import { useEffect, useState } from "react";
import { Button, Divider, Tooltip, Typography } from "@mui/material";
import useGetUser from "../../utils/get_user_by_principal";
import { useBackendContext } from "../../contexts/BackendContext";
import formatTimestamp from "../../utils/time";

interface ContractItemProps {
  id: string;
  sender: string;
  receiver: string;
  amount: number;
  date_created: string;
  canceled: boolean;
}

interface User {
  name: string;
}

const ContractItem: React.FC<ContractItemProps> = ({
  id,
  sender,
  receiver,
  amount,
  date_created,
  canceled,
}) => {
  const { backendActor } = useBackendContext();
  const { profile } = useSelector((state: any) => state.filesState);
  const [users, setUsers] = useState<{ sender: string; receiver: string }>({
    sender: "Null",
    receiver: "Null",
  });

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { getUser } = useGetUser();

  useEffect(() => {
    (async () => {
      const receiverUser = await getUser(receiver.toString());
      const senderUser =
        sender === "ExternalWallet"
          ? { name: "ExternalWallet" }
          : await getUser(sender.toString());
      setUsers({
        sender: senderUser ? senderUser.name : "Null",
        receiver: receiverUser ? receiverUser.name : "Null",
      });
    })();
  }, [receiver, sender, getUser]);

  const handleDelete = async () => {
    if (!backendActor) {
      enqueueSnackbar("Backend actor is not available", { variant: "error" });
      return;
    }
    const loader = enqueueSnackbar(
      <>
        <span>Deleting...</span>
        <span className="loader" />
      </>,
    );
    const res: { Ok?: any; Err?: any } = await backendActor.delete_payment(id);
    closeSnackbar(loader);
    if ("Ok" in res) {
      enqueueSnackbar("Deleted successfully", { variant: "success" });
      dispatch(handleRedux("REMOVE_CONTRACT", { id }));
    } else {
      enqueueSnackbar(String(res.Err), { variant: "error" });
    }
  };

  const DeleteDialog: React.FC<{
    handleCancel: () => void;
    handleClick: () => void;
  }> = ({ handleCancel, handleClick }) => (
    <>
      <Typography variant="subtitle2">Confirmation</Typography>
      <Typography>Are you sure you want to delete this contract?</Typography>
      <div>
        <Button onClick={handleCancel} color="primary">
          No
        </Button>
        <Button
          onClick={async () => {
            await handleDelete();
            handleClick();
          }}
          color="primary"
          autoFocus
        >
          Yes
        </Button>
      </div>
    </>
  );

  const isSender = profile.id === sender.toString();
  const isReceiver = profile.id === receiver.toString();

  const reportTooltip = (
    <Tooltip title="Reporting the cancellation of this contract means you are stating that the cancellation is not fair">
      <Button color="warning">Report</Button>
    </Tooltip>
  );

  const canceledStyle = {
    textDecoration: "line-through",
    color: "tomato",
  };

  return (
    <ListItem key={id}>
      <ListItemText
        primary={`Sender: ${users.sender}`}
        secondary={
          <div>
            <div>Receiver: {users.receiver}</div>
            <div>Amount: {Number(amount)} USDTs</div>
            <div>Date Created: {formatTimestamp(BigInt(date_created))}</div>
          </div>
        }
        secondaryTypographyProps={{ style: canceled ? canceledStyle : {} }}
      />
      {canceled && isReceiver && reportTooltip}
      <Divider />
      {canceled && isReceiver && reportTooltip}
    </ListItem>
  );
};

export default ContractItem;
