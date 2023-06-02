import * as React from 'react';
import Button from '@mui/material/Button';
import IconButton from "@mui/material/IconButton";
import LinkIcon from "@mui/icons-material/Link";

const CopyButton = () => {
    const copyLink = () => {
        const currentLink = window.location.href;
        navigator.clipboard.writeText(currentLink);
        // Optionally, you can show a success message or perform other actions
        // after copying the link
        console.log('Link copied: ', currentLink);
    };

    return (
        <IconButton color={"inherit"} onClick={copyLink}>
            <LinkIcon/>
        </IconButton>
    );
};

export default CopyButton;
