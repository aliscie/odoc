import BasicMenu from "../genral/basic_menu";
import React, {useState} from "react";
import {Tooltip} from "@mui/material";
import useCreateWorkSpace from "../chat/create_new_workspace";
import {useSelector} from "react-redux";
import {WorkSpace} from "../../../declarations/backend/backend.did";

interface Props {

}


function Workspaces(props: Props) {
    const {workspaces} = useSelector((state: any) => state.filesReducer);

    const createWorkspace = useCreateWorkSpace();

    const [state, setState] = useState("My work space")

    let options = [createWorkspace, ...workspaces.map((item: WorkSpace) => {
        return {content: item.name, onClick: () => setState(item.name)}
    })];

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
            options
        }
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