import React from "react";
import {ListItemIcon, MenuItem, Tooltip} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const InputOption = (props: any) => {
    // let input_id = random_number();
    let ref = React.useRef(null);
    const [isTyping, setIsTyping] = React.useState(false)

    const handleCreateFile = async (e: any) => {
        props.onEnter && props.onEnter(e.target.value)

    };
    const onClick = async () => {
        setIsTyping(true)
        setTimeout(() => {
            ref.current.focus()
            // console.log({ref: ref.current})
        }, 20)
    }

    const onKeyDown = async (e: any) => {
        if (e.key === 'Enter') {
            setIsTyping(false)
            await handleCreateFile(e)
        }
    }

    return (<span onClick={onClick}>
        {isTyping ? <Tooltip disable={props.disableToolTip == true} arrow placement="top" title={props.tooltip}>
                <input ref={ref} style={{display: isTyping ? "block" : "none"}}
                       onKeyDown={onKeyDown}/>
            </Tooltip> :
            <MenuItem

                variant="outlined" startIcon={<DeleteIcon/>}>
                <ListItemIcon>
                    {props.icon}
                </ListItemIcon>
                {props.title}
            </MenuItem>}

    </span>)
}
export default InputOption