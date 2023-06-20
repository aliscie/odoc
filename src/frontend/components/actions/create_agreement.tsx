import {backend} from "../../backend_connect/main";
import {handleRedux} from "../../redux/main";
import React from "react";
import {useDispatch} from "react-redux";
import {useSnackbar} from "notistack";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import {Input, Tooltip} from "@mui/material";

const CreateAgreement = () => {
    const dispatch = useDispatch();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [isTyping, setIsTyping] = React.useState(false)

    const handleCreateFile = async (e: any) => {
        e.target.classList.add("disabled")
        let loading = enqueueSnackbar(<span>Creating agreement... <span
            className={"loader"}/></span>, {variant: "info"});
        let res = await backend.create_agreement(e.target.value)
        e.target.classList.remove("disabled")
        dispatch(handleRedux("ADD", {data: res}))
        closeSnackbar(loading)
        enqueueSnackbar('New file is created!', {variant: "success"});
    };
    const onClick = async () => {
        setIsTyping(true)
        let create_file_name_field = document.getElementById("create_file_name_field");
        setTimeout(() => {
            create_file_name_field.focus()
        }, 10)
    }

    const onKeyDown = async (e: any) => {
        if (e.key === 'Enter') {
            setIsTyping(false)
            await handleCreateFile(e)
        }
    }

    return (<span>
        <Tooltip arrow placement="top" title="Set the name of the new file then hit enter.">
            <Input id={"create_file_name_field"} style={{display: isTyping ? "block" : "none"}}
                   onKeyDown={onKeyDown}/>
        </Tooltip>
        <span style={{display: isTyping ? "none" : "block"}} onClick={onClick}> <EditNoteRoundedIcon/>Note page</span>
    </span>)
}
export default CreateAgreement