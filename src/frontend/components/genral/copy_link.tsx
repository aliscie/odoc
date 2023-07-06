import * as React from 'react';
import {useEffect, useState} from 'react';
import LinkIcon from "@mui/icons-material/Link";
import {ListItemButton, ListItemText} from "@mui/material";
import {randomString} from "../../data_processing/data_samples";
import {actor} from "../../backend_connect/ic_agent";
import {useSelector} from "react-redux";
import DialogOver from "./daiolog_over";
import MultiAutoComplete from "./multi_autocompelte";
import List from "@mui/material/List";
import CheckIcon from '@mui/icons-material/Check';
import {User} from "../../../declarations/user_canister/user_canister.did";

let Dialog = (props: any) => {

    const {current_file} = useSelector((state: any) => state.filesReducer);
    let file_share_id = current_file.share_id[0];
    let url = window.location.host;
    let [share_link, setShareLink] = useState(`${url}/share?id=${file_share_id}`);
    let [is_copy, setCopy] = useState(false);
    useEffect(() => {
        (async () => {
            if (!file_share_id) {
                setShareLink(null);
                let res = await actor.share_file(current_file.id, randomString())
                if (res.Ok) {

                    setShareLink(`${url}/share?id=${res.Ok}`)
                }
                console.log({res})
            }

        })()

    }, [])
    let options = [
        {title: "View"},
        {title: "Update"},
        {title: "Comment"},
    ]

    const copyLink = async () => {
        navigator.clipboard.writeText(share_link);
        setCopy(true)
        setTimeout(() => {
            setCopy(false)
        }, 2000)
    };
    const {all_friends} = useSelector((state: any) => state.filesReducer);

    let users = all_friends.map((f: User) => {
        return {title: f.name}
    })
    return <List
        // style={{
        //     color: "var(--color)",
        //     background:'var(--background-color)'
        // }}
    >
        <ListItemButton onClick={copyLink}>
            {share_link ? <span>{share_link}</span> : <span className={"loader"}></span>}
            {is_copy ? <CheckIcon size={"small"} color={"success"}/> : null}
        </ListItemButton>

        <ListItemText
            // primaryTypographyProps={{style: {color: "var(--color)"}}}
            // secondaryTypographyProps={{style: props.canceled ? canceled_style : normal_style}}
            primary={"Anyone with the link can "}
            secondary={<MultiAutoComplete defaultValue={{title: "View"}} options={options} multiple={true}/>}
        />

        <ListItemText
            // primaryTypographyProps={{style: {color: "var(--color)"}}}
            // secondaryTypographyProps={{style: props.canceled ? canceled_style : normal_style}}
            primary={"Who can view"}
            secondary={<MultiAutoComplete options={users} multiple={true}/>}
        />
        <ListItemText
            // primaryTypographyProps={{style: {color: "var(--color)"}}}
            // secondaryTypographyProps={{style: props.canceled ? canceled_style : normal_style}}
            primary={"Who can update"}
            secondary={<MultiAutoComplete options={users} multiple={true}/>}
        />
        <ListItemText
            // primaryTypographyProps={{style: {color: "var(--color)"}}}
            // secondaryTypographyProps={{style: props.canceled ? canceled_style : normal_style}}
            primary={"Who can comment"}
            secondary={<MultiAutoComplete
                // defaultValue={{title: ""}}
                options={users} multiple={true}/>}
        />


    </List>
}

const CopyButton = () => {

    return (
        <DialogOver
            variant="text"
            DialogContent={Dialog}
        >
            <LinkIcon/>
        </DialogOver>
    );
};

export default CopyButton;
