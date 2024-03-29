import {handleRedux} from "../../redux/main";
import React from "react";
import {useDispatch} from "react-redux";
import {useSnackbar} from "notistack";
import DeleteIcon from "@mui/icons-material/Delete";
import {actor} from "../../App";

const DeleteFile = (props: any) => {
    const dispatch = useDispatch();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    async function handleDeleteFile(e: any) {
        e.target.classList.add("disabled")
        let loading = enqueueSnackbar(<span>Deleting {props.item.name}... <span
            className={"loader"}/></span>, {variant: "info"});
        let res = await actor.delete_file(props.item.id)
        dispatch(handleRedux("REMOVE", {id: props.item.id}))
        e.target.classList.remove("disabled")
        closeSnackbar(loading)
        enqueueSnackbar(`${props.item.name} is deleted`, {variant: "success"});
    }

    return (<span onClick={handleDeleteFile}> <DeleteIcon size={"small"}/> Delete</span>)
}
export default DeleteFile