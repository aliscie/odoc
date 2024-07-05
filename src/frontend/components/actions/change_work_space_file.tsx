import {handleRedux} from "../../redux/main";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useSnackbar} from "notistack";
import DeleteIcon from "@mui/icons-material/Delete";
import {actor} from "../../App";
import {MenuItem, Select} from "@mui/material";
import {WorkSpace} from "../../../declarations/backend/backend.did";

const ChangeWorkSpace = (props: any) => {
    const {all_friends, profile, workspaces} = useSelector((state: any) => state.filesReducer);
    const dispatch = useDispatch();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    async function handleWorkSpace(e: any) {

    }

    const work_spaces = workspaces && workspaces.map((w: WorkSpace) => w.name);
    return (<Select onChange={(e) => {
        console.log(e.target.value)
    }}>
        {work_spaces.map((w, i) => <MenuItem key={i} value={w}>{w}</MenuItem>)}
    </Select>)
}
export default ChangeWorkSpace