import React from "react";
import {useDispatch} from "react-redux";
import {useSnackbar} from "notistack";
import {Button, Tooltip} from "@mui/material";
import {backend} from "../../backend_connect/main";
import {handleRedux} from "../../redux/main";

const RenameFile = (props: any) => {
    const ref = React.useRef(null);
    const dispatch = useDispatch();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    let item = props.item;

    async function saveName() {
        enqueueSnackbar(`Updating the name to: ${ref.current.value}`)
        await backend.rename_file(item.id, ref.current.value)
        item.name = ref.current.value;
        dispatch(handleRedux("UPDATE", {id: item.id, file: item}))
        enqueueSnackbar(`Name successfully updated.`, {variant: 'success'})
    }

    async function onKeyDown(e: any) {
        e.currentTarget.focus()
        if (e.key === 'Enter') {
            await saveName()
        }

    }

    return (<span>
        <Tooltip arrow placement="top" title="Hit enter or click save will save the name">
            <input onKeyDown={onKeyDown} ref={ref} autoFocus={true} placeholder={props.item.name}/>
       </Tooltip>
            <Button onClick={saveName}>Save</Button>
    </span>)
}
export default RenameFile