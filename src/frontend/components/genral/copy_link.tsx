import * as React from 'react';
import {useEffect, useState} from 'react';
import IconButton from "@mui/material/IconButton";
import LinkIcon from "@mui/icons-material/Link";
import {Button, DialogActions, DialogContent, DialogTitle, Paper, Tooltip} from "@mui/material";
import ContextMenu from "./context_menu";
import MultiSelect from "./multi_select";
import {randomString} from "../../data_processing/data_samples";
import {actor} from "../../backend_connect/ic_agent";
import {useSelector} from "react-redux";
import DialogOver from "./daiolog_over";

const OptionsCom = () => {
    let options = ["Update", "View", "Comment"];
    return <MultiSelect options={options}/>
}

let Dialog = (props: any) => {

    const {current_file} = useSelector((state: any) => state.filesReducer);
    let file_share_id = current_file.share_id[0];
    let url = window.location.host;
    let [share_link, setShareLink] = useState(`${url}/share?id=${file_share_id}`);
    useEffect(() => {
        (async () => {
            if (!file_share_id) {
                let res = await actor.share_file(current_file.id, randomString())
                if (res.Ok) {

                    setShareLink(`${url}/share?id=${res.Ok}`)
                }
                console.log({res})
            }

        })()

    }, [])

    return <Paper>
        {share_link ? <span>{share_link}</span> : <span className={"loader"}></span>}
    </Paper>
}

const CopyButton = () => {
    // const {current_file} = useSelector((state: any) => state.filesReducer);
    // let [title, setTitle] = useState(<span>Copy link.</span>)

    // const copyLink = async () => {
    //     let res = await actor.share_file(current_file.id, randomString())
    //     console.log(res)
    //
    //     const currentLink = window.location.href;
    //     navigator.clipboard.writeText(currentLink);
    //     setTitle(<span style={{color: "lightgreen"}}>Copied.</span>)
    //     setTimeout(() => {
    //         setTitle(<span>Copy link.</span>)
    //     }, 2000)
    // };


    // let options = [
    //     {preventClose: true, content: <span>People with the link can<OptionsCom/></span>},
    //     {content: "private",},
    //     {content: "Who can see",},
    //     {content: "Who can update",},
    //     {content: "Who can comment",},
    // ]


    return (
        <DialogOver
            // color={"success"}
            // disabled={is_released}
            variant="text"
            DialogContent={Dialog}
        >
            {/*<ContextMenu options={options}>*/}
            {/*    <Tooltip arrow title={title} placement="bottom">*/}
            {/*        <IconButton onClick={copyLink}>*/}
            <LinkIcon/>
            {/*        </IconButton>*/}
            {/*    </Tooltip>*/}
            {/*</ContextMenu>*/}
        </DialogOver>
    );
};

export default CopyButton;
