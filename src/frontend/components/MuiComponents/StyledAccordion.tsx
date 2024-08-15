import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface StyledAccordionProps {
    title: string;
    content: string;
    isDone: boolean;
}

const StyledAccordion: React.FC<StyledAccordionProps> = ({ title, content, isDone }) => {
    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Box display="flex" alignItems="center">
                    {isDone && <CheckCircleOutlineIcon sx={{ marginRight: '8px', color: 'green' }} />}
                    <Typography>{title}</Typography>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Typography align='left'>
                    {content}
                </Typography>
            </AccordionDetails>
        </Accordion>
    );
};

export default StyledAccordion;
