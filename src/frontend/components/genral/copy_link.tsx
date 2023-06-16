import * as React from 'react';
import Button from '@mui/material/Button';
import IconButton from "@mui/material/IconButton";
import LinkIcon from "@mui/icons-material/Link";
import {Tooltip} from "@mui/material";
import {useEffect, useState} from "react";

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

    return (
        <Tooltip arrow title={title} placement="bottom">
            <IconButton onClick={copyLink}>
                <LinkIcon/>
            </IconButton>
        </Tooltip>
    );
};

export default CopyButton;
