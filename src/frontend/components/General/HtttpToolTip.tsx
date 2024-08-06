import {styled} from "@mui/system";
import {Tooltip, tooltipClasses, TooltipProps} from "@mui/material";
import * as React from "react";


const HtmlTooltip = styled(({className, ...props}: TooltipProps) => (
        <Tooltip {...props} classes={{popper: className}}/>
    ))(({theme}) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
            borderRadius: "4px",
            maxWidth: 500,
        },
    }))
export default HtmlTooltip