import BasicMenu from "../genral/basic_menu";
import React, {useState} from "react";
import {Tooltip} from "@mui/material";

interface Props {

}

let workspaces = [
    "Default",
    "Isha developers",
    "Isha video editors",
    "Sounds of Isha",
]

function Workspaces(props: Props) {
    const [state, setState] = useState("My work space")
    return <BasicMenu
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        options={
            workspaces.map((item: string) => {
                return {content: item, onClick: () => setState(item)}
            })}
    >
        <Tooltip arrow title={"Chose your workspace"}>
        {state}
        </Tooltip>
        {/*<Avatar style={{display: 'inline'}} alt="Remy Sharp" src={image_link}/>*/}
        {/*Each work spaces has its own chats and its won files,*/}
        {/*Default workspaces shows all files and chats*/}

    </BasicMenu>
}

export default Workspaces