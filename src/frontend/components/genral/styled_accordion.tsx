import React from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const StyledAccordion = ({ title, content }) => (
    <Accordion>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
        >
            <Typography variant="h6">{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Typography>{content}</Typography>
        </AccordionDetails>
    </Accordion>
);

export default StyledAccordion;
