import * as React from "react";
import {styled} from "@mui/system";
import {Button, Paper, Tooltip, tooltipClasses, TooltipProps} from "@mui/material";
import ClickAwayListener from "@mui/base/ClickAwayListener";

function DialogOver({DialogContent, ...props}: any) {

    const [open, setOpen] = React.useState(false);
    const handleClick = () => {
        props.onClick && props.onClick();
        setOpen(true);
    };

    const handleCancel = () => {
        setOpen(false);
    };


    const HtmlTooltip = styled(({className, ...props}: TooltipProps) => (
        <Tooltip {...props} classes={{popper: className}}/>
    ))(({theme}) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: '#f5f5f9',
            color: 'rgba(0, 0, 0, 0.87)',
            maxWidth: 220,
            fontSize: theme.typography.pxToRem(12),
            border: '1px solid #dadde9',
        },
    }));
    const Dialog = () => {
        return <ClickAwayListener onClickAway={handleCancel}>
            <Paper>
                <DialogContent handleClick={handleClick} handleCancel={handleCancel}/>
            </Paper>
        </ClickAwayListener>
    }


    return <HtmlTooltip arrow open={open} title={<Dialog/>}>
        <Button
            {...props}
            onClick={handleClick}
            variant="text"
        >
            {props.children}
        </Button>
    </HtmlTooltip>
}

export default DialogOver