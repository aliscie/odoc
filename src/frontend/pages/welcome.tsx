import React from 'react';
import { Box, AppBar, Tabs, Tab, Typography, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import SwipeableViews from 'react-swipeable-views';
import { Search, Chat, CheckCircle, Description, Work, Notifications } from '@mui/icons-material';

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
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <Search />
                            </ListItemIcon>
                            <ListItemText primary="Find people on Discover, or post about your job offer" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <Chat />
                            </ListItemIcon>
                            <ListItemText primary="Meet them and chat" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CheckCircle />
                            </ListItemIcon>
                            <ListItemText primary="Agree with them" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <Description />
                            </ListItemIcon>
                            <ListItemText primary="Create file and smart contract in file" />
                        </ListItem>
                    </List>
                </div>
                <div>
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <Work />
                            </ListItemIcon>
                            <ListItemText primary="Post about your skills in Discover, or find hiring posts" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CheckCircle />
                            </ListItemIcon>
                            <ListItemText primary="They should create a smart contract for you" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <Notifications />
                            </ListItemIcon>
                            <ListItemText primary="You will find it in your notifications" />
                        </ListItem>
                    </List>
                </div>
            </SwipeableViews>
        </Box>
    );
};

export default FullWidthTabs;
