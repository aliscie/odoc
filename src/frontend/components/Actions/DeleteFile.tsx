import React, { MouseEvent } from "react";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import DeleteIcon from "@mui/icons-material/Delete";
import { handleRedux } from "../../redux/store/handleRedux";
import { useBackendContext } from "../../contexts/BackendContext";

interface DeleteFileProps {
  item: {
    id: string;
    name: string;
  };
}

const DeleteFile: React.FC<DeleteFileProps> = ({ item }) => {
  const { backendActor } = useBackendContext();
  const dispatch = useDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleDeleteFile = async (e: MouseEvent<HTMLSpanElement>) => {
    if (!backendActor) {
      enqueueSnackbar("Failed to delete: Backend actor not available", {
        variant: "error",
      });
      return;
    }

    e.currentTarget.classList.add("disabled");

    const loading = enqueueSnackbar(
      <span>
        Deleting {item.name}... <span className="loader" />
      </span>,
      { variant: "info" },
    );

    try {
      const res = await backendActor.delete_file(item.id);
      dispatch(handleRedux("REMOVE", { id: item.id }));
      enqueueSnackbar(`${item.name} is deleted`, { variant: "success" });
    } catch (error) {
      enqueueSnackbar(`Failed to delete ${item.name}`, { variant: "error" });
    } finally {
      e.currentTarget.classList.remove("disabled");
      closeSnackbar(loading);
    }
  };

  return (
    <span onClick={handleDeleteFile}>
      <DeleteIcon fontSize="small" /> Delete
    </span>
  );
};

export default DeleteFile;
