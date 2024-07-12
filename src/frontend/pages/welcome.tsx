import * as React from 'react';
import { Box, AppBar, Tabs, Tab, Typography } from '@mui/material';
import SwipeableViews from 'react-swipeable-views';

const FullWidthTabs = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ bgcolor: 'background.paper', width: '100%', marginBottom: '40px' }}>
            <AppBar position="static">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="secondary"
                    textColor="inherit"
                    variant="fullWidth"
                >
                    <Tab label="I am hiring" />
                    <Tab label="I want to be hired" />
                </Tabs>
            </AppBar>
            <SwipeableViews index={value}>
                <div>
                    <Typography>1. Find people on discover, or post about your job offer</Typography>
                    <Typography>2. Meet them and chat</Typography>
                    <Typography>3. Agree with them</Typography>
                    <Typography>4. Create file and smart contract in file</Typography>
                    <Box component="iframe" 
                         src="https://www.youtube.com/embed/z3L_pdmDMe8" 
                         width="100%" 
                         height="450" 
                         title="What is Odoc" 
                         frameBorder="0" 
                         allowFullScreen 
                         sx={{ my: 2 }}
                    />
                </div>
                <div>
                    <Typography>1. Post about your skills in discover, or find hiring posts</Typography>
                    <Typography>2. They should create smart contract for you</Typography>
                    <Typography>3. You will find it in your notifications</Typography>
                </div>
            </SwipeableViews>
        </Box>
    );
};

export default FullWidthTabs;
