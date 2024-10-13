import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import { useSnackbar } from "notistack";
import { useBackendContext } from "../../../contexts/BackendContext";
import LoaderButton from "../../MuiComponents/LoaderButton";
import { handleRedux } from "../../../redux/store/handleRedux";
import { useDispatch } from "react-redux";
import ConformationMessage from "../../MuiComponents/conformationButton";

function DeleteContract({ id }) {
  const dispatch = useDispatch();
  const { backendActor } = useBackendContext();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const onClick = async () => {
    const res = await backendActor?.delete_custom_contract(id);
    if ("Ok" in res) {
      enqueueSnackbar("Contract deleted", { variant: "success" });
    } else if ("Not found" === res.Err) {
      dispatch(handleRedux("REMOVE_CONTRACT", { id }));
    } else {
      enqueueSnackbar(res.Err, { variant: "error" });
      return res;
    }
    dispatch(handleRedux("REMOVE_CONTRACT", { id }));
    return res;
  };
  let icon = <DeleteIcon color={"error"} />;
  return (
    <ConformationMessage
      message={"Yes delete it!"}
      conformationMessage={`Are you sure you want to delete this contract table`}
      onClick={onClick}
    >
      {icon} Delete
    </ConformationMessage>
    // <LoaderButton startIcon={icon} onClick={onClick}>
    //   Delete contract
    // </LoaderButton>
  );
}

export default DeleteContract;
