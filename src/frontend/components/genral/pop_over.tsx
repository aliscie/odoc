import * as React from 'react';
import {ClickAwayListener} from '@mui/base';
import Box from '@mui/material/Box';
import {ClickAwayListener} from '@mui/base/ClickAwayListener';
import {SxProps} from '@mui/system';

interface Props {
    children: React.ReactNode,
    content: React.ReactNode,
    onClickAway?: any
    style?: SxProps
}

export default function BasicPopover(props: Props) {
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen((prev) => !prev);
    };

    const handleClickAway = () => {
        setOpen(false);
        props.onClickAway();
    };

    const styles: SxProps = {
        position: 'absolute',
        top: 28,
        right: 0,
        left: 0,
        zIndex: 1,
        border: '1px solid',
        p: 1,
        bgcolor: 'background.paper',
        minWidth: 200,
        minHeight: 200,
        ...props.style,
    };

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <Box sx={{position: 'relative'}}>

                <span onClick={handleClick}>
                    {props.children}
                </span>
                {open ? (
                    <Box sx={styles}>
                        {props.content}
                    </Box>
                ) : null}
            </Box>
        </ClickAwayListener>
    );
}

