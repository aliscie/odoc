import * as React from 'react';
import {styled} from '@mui/system';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, {AccordionProps} from '@mui/material/Accordion';
import MuiAccordionSummary, {AccordionSummaryProps} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))({});

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{fontSize: '0.9rem'}}/>} {...props} />
))({
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: '8px',
        display: 'flex',
        alignItems: 'center', // Center the icon with the text vertically
    },
});

const AccordionDetails = styled(MuiAccordionDetails)({
    textAlign: 'left',
});

interface AccordionData {
    title: string;
    content: string;
    is_done: boolean; // Add the "is_done" property to the AccordionData interface
}

interface CustomizedAccordionsProps {
    data: AccordionData[];
}

const CustomizedAccordions: React.FC<CustomizedAccordionsProps> = ({data}) => {
    const [expanded, setExpanded] = React.useState<string | false>('panel1');

    const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (
        <div>
            {data.map((item, index) => (
                <Accordion
                    key={index}
                    expanded={expanded === `panel${index + 1}`}
                    onChange={handleChange(`panel${index + 1}`)}
                >
                    <AccordionSummary
                        aria-controls={`panel${index + 1}-content`}
                        id={`panel${index + 1}-header`}
                    >
                        {item.is_done && <CheckCircleOutlineIcon sx={{marginRight: '8px', color: 'green'}}/>}
                        <Typography>{item.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>{item.content}</Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );
};

export default CustomizedAccordions;
