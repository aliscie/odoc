import * as React from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{p: 3}}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

type View = { id: string, name: string, component: any };

interface Props {
    views: View[],
    default: string // id
}

export default function useViews(props: Props) {
    const [value, setValue]: any = React.useState(props.default);

    const handleChange: any = (event: React.ChangeEvent<{ value: unknown }>) => {
        setValue(event.target.value as number);
    };

    let OptionsComponent = <Select
        size="small"
        value={value}
        onChange={handleChange}
        label="Select Tab"
        variant="outlined"

    >
        {props.views.map((item: View) => <MenuItem value={item.id}>{item.name}</MenuItem>)}
    </Select>

    let ViewsComponent = props.views.map((item: View, index: number) => {
        return <CustomTabPanel value={value} index={item.id}>{item.component}</CustomTabPanel>
    })


    return {OptionsComponent, ViewsComponent};
}
