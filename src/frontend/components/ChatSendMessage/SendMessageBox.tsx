import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InputBase, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useSnackbar } from "notistack";
import { handleRedux } from "../../redux/store/handleRedux";
import { useBackendContext } from "../../contexts/BackendContext";
import { Message } from "../../../declarations/backend/backend.did";
import { Principal } from "@dfinity/principal";
import LoaderButton from "../MuiComponents/LoaderButton";

const SendMessageBox: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { backendActor } = useBackendContext();
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const { current_chat_id, current_user } = useSelector(
    (state: any) => state.chatsState,
  );
  const { profile } = useSelector((state: any) => state.filesState);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: `${Date.now()}`,
        date: BigInt(Date.now()),
        sender: Principal.fromText(profile.id),
        seen_by: [Principal.fromText(profile.id)],
        message,
        chat_id: current_chat_id,
      };

      if (newMessage.chat_id === "chat_id") {
        console.log("chat_id is not set");
      }
      let res: undefined | { Ok: string } | { Err: string } =
        await backendActor.send_message([current_user], newMessage);
      // TODO use ws.send_message in addition to actor.send_message because that would be faster.
      if ("Err" in res) {
        enqueueSnackbar("Error sending message: " + res.Err, {
          variant: "error",
        });
      } else {
        dispatch(handleRedux("UPDATE_MESSAGE", { message: newMessage }));
      }
      dispatch(handleRedux("SEND_MESSAGE", { message: newMessage }));
      setMessage("");
    }
    return { Ok: true };
  };

  return (
    <Paper
      component="form"
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "2px 4px",
        position: "relative",
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Type a message..."
        multiline
        maxRows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        inputProps={{ "aria-label": "Type a message" }}
      />
      <LoaderButton
        sx={{ p: 1 }}
        onClick={handleSendMessage}
        aria-label="send"
        startIcon={<SendIcon />}
      />
    </Paper>
  );
};

export default SendMessageBox;
