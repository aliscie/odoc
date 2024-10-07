import React from "react";
import {
  AppBar,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
} from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import { CheckCircle, Notifications, Work } from "@mui/icons-material";
import LoginIcon from "@mui/icons-material/Login";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import HandshakeIcon from "@mui/icons-material/Handshake";
import WifiFindIcon from "@mui/icons-material/WifiFind";

const FullWidthTabs = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const Intro = () => (
    <div>
      {/*<IntroPhoto />*/}
      <Box
        component="iframe"
        src="https://www.youtube.com/embed/z3L_pdmDMe8"
        width="100%"
        height="400px"
        title="What is Odoc"
        frameBorder="0"
        allowFullScreen
        sx={{ my: 2 }}
      />
    </div>
  );
  const IntroPhoto = () => (
    <Box
      component="img"
      // sx={{
      //   height: 233,
      //   width: 350,
      //   maxHeight: { xs: 233, md: 167 },
      //   maxWidth: { xs: 350, md: 250 },
      // }}
      alt="The house from the offer."
      // src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2"
      // width="25%"
      // height="25px"
      src={
        "https://github.com/user-attachments/assets/4a562a78-6ec5-4fe5-b213-f6aba414cb2d"
      }
    />
  );
  const getStarted = [
    { text: "Login", icon: <LoginIcon /> },
    { text: "Go to discover page", icon: <WifiFindIcon /> },
    { text: "Make friends and create posts", icon: <Diversity3Icon /> },
    {
      text: "From your profile icon click contracts to create or find your contracts",
      icon: <HandshakeIcon />,
    },
  ];
  const GetStarted = () => (
    <div>
      <List>
        {getStarted.map((item: any) => {
          return (
            <ListItem>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  const Hired = () => (
    <div>
      <List>
        <ListItem>
          <ListItemIcon>
            <Work />
          </ListItemIcon>
          <ListItemText primary="Post about your skills in Index, or find hiring posts" />
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
  );
  return (
    <Box
      sx={{ bgcolor: "background.paper", width: "100%", marginBottom: "40px" }}
    >
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
        >
          <Tab label="What is odoc" />
          <Tab label="Get started" />
          {/*<Tab label="I want to be hired" />*/}
        </Tabs>
      </AppBar>
      <SwipeableViews index={value}>
        <Intro />
        <GetStarted />
        {/*<Hired />*/}
      </SwipeableViews>
    </Box>
  );
};

export default FullWidthTabs;
