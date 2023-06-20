import * as React from 'react';
import {useState} from 'react';
import IconButton from "@mui/material/IconButton";
import LinkIcon from "@mui/icons-material/Link";
import {Tooltip} from "@mui/material";
import ContextMenu from "./context_menu";
import MultiSelect from "./multi_select";

const OptionsCom = () => {
    let options = ["Update", "View", "Comment"];
    return <MultiSelect options={options}/>
}
const CopyButton = () => {
    let [title, setTitle] = useState(<span>Copy link.</span>)
    const copyLink = () => {
        const currentLink = window.location.href;
        navigator.clipboard.writeText(currentLink);
        setTitle(<span style={{color: "lightgreen"}}>Copied.</span>)
        setTimeout(() => {
            setTitle(<span>Copy link.</span>)
        }, 2000)
    };


    let options = [
        {preventClose: true, content: <span>People with the link can<OptionsCom/></span>},
        {content: "private",},
        {content: "Who can see",},
        {content: "Who can update",},
        {content: "Who can comment",},
    ]

    return (
        <ContextMenu options={options}>
            <Tooltip arrow title={title} placement="bottom">
                <IconButton onClick={copyLink}>
                    <LinkIcon/>
                </IconButton>
            </Tooltip>
        </ContextMenu>
    );
};

export default CopyButton;
