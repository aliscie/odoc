import * as React from "react";
import {styled} from "@mui/system";
import {Button, Tooltip, tooltipClasses, TooltipProps} from "@mui/material";
import { ClickAwayListener } from '@mui/base';

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
            boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
            borderRadius: "4px",
            maxWidth: 500,
        },
    }));
    const Dialog = () => {
        return <ClickAwayListener onClickAway={handleCancel}>
            <div>
                <DialogContent handleClick={handleClick} handleCancel={handleCancel}/>
            </div>
        </ClickAwayListener>
    }


    return <HtmlTooltip arrow open={open} title={<Dialog/>}>
        <Button
            color={"inherit"}
            // variant="text"
            {...props}
            onClick={handleClick}
        >
            {props.children}
        </Button>
    </HtmlTooltip>
}

export default DialogOver