import {handleRedux} from "../../redux/main";
import React from "react";
import {useDispatch} from "react-redux";
import {useSnackbar} from "notistack";
import DeleteIcon from "@mui/icons-material/Delete";
import {actor} from "../../App";
import {MenuItem, Select} from "@mui/material";

const ChangeWorkSpace = (props: any) => {
    const dispatch = useDispatch();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    async function handleWorkSpace(e: any) {

    }

    const workspaces = ['Workspace1', 'Workspace2', 'Workspace3'];

    return (<Select onChange={(e) => {
        console.log(e.target.value)
    }}>
        {workspaces.map((w, i) => <MenuItem key={i} value={w}>{w}</MenuItem>)}
    </Select>)
}
export default ChangeWorkSpace